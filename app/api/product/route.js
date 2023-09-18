import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
const {
  Product,
  ProductsInfo,
  Category,
  ProductInfo,
  Brand
} = require('@/models/models')
const uuid = require('uuid')

export const POST = async (request) => {
  try {
    const formData = await request.formData()

    let name = formData.get('name')
    let price = formData.get('price')
    let brandId = formData.get('brandId')
    let categoryId = formData.get('categoryId')
    let description = formData.get('description')
    let info = formData.get('info')
    const img = formData.get('img')
    if (!name || !price || !brandId || !categoryId || !description || !img) {
      return NextResponse.json({
        ok: false,
        message: 'Not all fields provided',
        dataObject: { name, price, brandId, categoryId, description, info, img }
      })
    }
    const foundProduct = await Product.findOne({
      where: { name: name }
    })
    const foundBrand = await Brand.findByPk(brandId)
    const foundCategory = await Category.findByPk(categoryId)
    if (foundProduct !== null) {
      return NextResponse.json({
        ok: false,
        message: 'Product already exists',
        dataObject: {
          newDevice: { name, price, brandId, categoryId, description }
        }
      })
    }
    if (foundCategory === null) {
      return NextResponse.json({
        ok: false,
        message: 'This category not found',
        dataObject: {
          newDevice: { name, price, brandId, categoryId, description }
        }
      })
    }
    if (foundBrand === null) {
      return NextResponse.json({
        ok: false,
        message: 'This brand not found',
        dataObject: {
          newDevice: { name, price, brandId, categoryId, description }
        }
      })
    }

    let fileName = 'noImg.jpg'
    if (img.size > 0) {
      fileName = uuid.v4() + '.jpg'
      await writeFile(
        `public/static/${fileName}`,
        Buffer.from(await img.arrayBuffer())
      )
    }

    const newDevice = await Product.create({
      name,
      price,
      brandId,
      categoryId,
      description,
      img: fileName
    })

    if (info) {
      info = JSON.parse(info)
      info.forEach((i) => {
        ProductsInfo.create({
          title: i.title,
          description: i.description,
          deviceId: newDevice.id
        })
      })
    }

    return NextResponse.json({
      ok: true,
      message: 'Product created successfully',
      dataObject: { newDevice }
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      ok: false,
      message: 'Error',
      dataObject: { error: e.message }
    })
  }
}

export const GET = async (req) => {
  try {
    const nextSearchParams = new URLSearchParams(req.nextUrl.search)
    const brandId = nextSearchParams.get('brandId') || null
    const categoryId = nextSearchParams.get('categoryId') || null
    const limit = nextSearchParams.get('limit') || null
    const page = nextSearchParams.get('page') || 1
    const order = nextSearchParams.get('order') || null
    const offset = (page - 1) * (limit || 0)

    const whereHandler = () => {
      if (brandId && !categoryId) return { brandId }
      if (!brandId && categoryId) return { categoryId }
      if (brandId && categoryId) return { categoryId, brandId }
      else {
      }
    }

    let products = await Product.findAll({
      where: { ...whereHandler() },
      include: { model: ProductInfo, as: 'info' },
      limit,
      page,
      offset,
      order: JSON.parse(order)
    })

    const count = await Product.count({
      where: { ...whereHandler() }
    })

    if (count === 0) {
      return NextResponse.json({
        ok: true,
        message: 'Products not found',
        dataObject: { products }
      })
    }
    return NextResponse.json({
      ok: true,
      message: 'Products found successfully',
      dataObject: { count, products }
    })
  } catch (e) {
    return NextResponse.json({
      ok: false,
      message: 'Error',
      dataObject: { error: e.message }
    })
  }
}
