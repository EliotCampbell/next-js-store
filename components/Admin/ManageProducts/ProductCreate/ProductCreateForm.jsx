'use client'

import React, { useState } from 'react'
import { useAdminStore } from '@/store/adminStore/adminStore'
import { useAdminListsStore } from '@/store/adminStore/adminListsStore'
import AdminReactSelect from '@/components/UI/Admin/AdminReactSelect/AdminReactSelect'
import AdminNewInput from '@/components/UI/Admin/AdminNewInput/AdminNewInput'
import classes from '@/components/Admin/FormsStyles.module.css'
import ProductPreviewCard from '@/components/Shop/ProductPreviewCard/ProductPreviewCard'
import Button from '@/components/UI/Button/Button'
import { createProduct } from '@/http/Admin/products'
import MessageString from '@/components/UI/MessageString/MessageString'
import AdminNewTextArea from '@/components/UI/Admin/AdminNewTextArea/AdminNewTextArea'

const ProductCreateForm = () => {
  const { categoriesList, brandsList, fetchProductsList } = useAdminListsStore(
    (state) => ({
      categoriesList: state.categoriesList,
      brandsList: state.brandsList,
      fetchProductsList: state.fetchProductsList
    })
  )

  const { newProduct, preview, setNewProduct, setPreview, reset } =
    useAdminStore((state) => ({
      newProduct: state.newProduct,
      preview: state.preview,
      reset: state.reset,
      setNewProduct: state.setNewProduct,
      setPreview: state.setPreview
    }))

  const [message, setMessage] = useState(null)

  const createHandler = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    await createProduct(formData).then((r) => {
      setMessage(r)
      r.ok && reset()
    })
    await fetchProductsList()
  }

  const regExp = /^(?:[0-9]{1,8}(?:\.[0-9]{0,2})?|99999999(?:\.00?)?)$/

  return (
    <div className={classes.productCreateForm}>
      <div className={classes.formWithSidePreview}>
        <form
          className={classes.form}
          onSubmit={(event) => createHandler(event)}
        >
          <AdminNewInput
            label={'A new product name'}
            placeholder={'Name of the new product...'}
            value={newProduct.name}
            name={'name'}
            autocomplete={false}
            onChange={(e) => {
              setMessage(null)
              setNewProduct({ ...newProduct, name: e.target.value })
            }}
          ></AdminNewInput>
          <div className={classes.inputContainer}>
            <AdminReactSelect
              value={newProduct.brand === '' ? null : newProduct.brand}
              label={'Choose brand'}
              options={brandsList}
              name={'brandId'}
              onChange={(option) => {
                setMessage(null)
                setNewProduct({ ...newProduct, brand: option })
              }}
            ></AdminReactSelect>
            <div className={classes.inputContainerVerticalSplitter}></div>
            <AdminReactSelect
              value={newProduct.category === '' ? null : newProduct.category}
              label={'Choose category'}
              options={categoriesList}
              name={'categoryId'}
              onChange={(option) => {
                setMessage(null)
                setNewProduct({ ...newProduct, category: option })
              }}
            ></AdminReactSelect>
          </div>

          <AdminNewInput
            value={newProduct.price}
            placeholder={'47...'}
            label={'Input product price'}
            name={'price'}
            onChange={(e) => {
              setMessage(null)
              if (regExp.test(e.target.value) || e.target.value === '')
                setNewProduct({ ...newProduct, price: e.target.value })
            }}
          />
          <AdminNewTextArea
            placeholder={'Many words about it...'}
            label={'Input product description'}
            value={newProduct.description}
            name={'description'}
            onChange={(e) => {
              setMessage(null)
              setNewProduct({
                ...newProduct,
                description: e.target.value
              })
            }}
          />
          <AdminNewInput
            type={'file'}
            accept={'.png,.jpg'}
            name={'img'}
            onChange={(e) => {
              setMessage(null)
              setNewProduct({ ...newProduct, file: e.target.files[0] })
              setPreview(URL.createObjectURL(e.target.files[0]))
            }}
          />
          {message && (
            <div className={classes.messageDiv}>
              <MessageString message={message} setMessage={setMessage} />
            </div>
          )}
          <Button>Create product</Button>
        </form>
        <div className={classes.productsCardWrapper}>
          <p className={classes.preview}>Preview</p>
          <ProductPreviewCard
            productId={newProduct.id}
            brandId={newProduct.brand.value}
            productName={newProduct.name === '' ? 'Name' : newProduct.name}
            productImg={preview}
            productPrice={newProduct.price}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductCreateForm
