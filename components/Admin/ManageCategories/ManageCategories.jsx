'use client'
import React, { useState } from 'react'
import { createCategory } from '@/http/Admin/categories'
import { useAdminStore } from '@/store/adminStore/adminStore'
import { useAdminListsStore } from '@/store/adminStore/adminListsStore'
import classes from '@/components/Admin/FormsStyles.module.css'
import { FiPlus } from 'react-icons/fi'
import { useUserStore } from '@/store/mainStore/store'
import AdminNewInput from '@/components/UI/Admin/AdminNewInput/AdminNewInput'
import MessageString from '@/components/UI/MessageString/MessageString'
import CategoryRowItem from '@/components/Admin/ManageCategories/CategoryRowItem/CategoryRowItem'

const ManageCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { categoriesList, fetchCategoriesList } = useAdminListsStore(
    (state) => ({
      categoriesList: state.categoriesList,
      fetchCategoriesList: state.fetchCategoriesList
    })
  )

  const { newCategory, setNewCategory, reset } = useAdminStore((state) => ({
    newCategory: state.newCategory,
    setNewCategory: state.setNewCategory,
    reset: state.reset
  }))

  const { message, setMessage } = useUserStore((state) => ({
    message: state.message,
    setMessage: state.setMessage
  }))

  const create = async () => {
    await createCategory(newCategory).then(async (r) => {
      setMessage(r)
      r.ok && reset()
      r.ok && (await fetchCategoriesList().then())
    })
  }

  return (
    <>
      <h1>MANAGE CATEGORIES</h1>
      <div className={classes.formWithSidePreview}>
        <div className={classes.form}>
          <AdminNewInput
            placeholder={'Add category...'}
            value={!selectedCategory ? newCategory.name : ''}
            onChange={(e) => {
              setNewCategory({ ...newCategory, name: e.target.value })
              setMessage(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                create().then()
              }
            }}
          >
            <div className={classes.icoBlock}>
              <FiPlus
                className={classes.submitIco}
                onClick={() => {
                  create().then()
                }}
              />
            </div>
          </AdminNewInput>

          {categoriesList.length > 0 ? (
            categoriesList.map((el) => (
              <CategoryRowItem
                key={el.value}
                item={el}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ))
          ) : (
            <p className={classes.placeholder}>No categories</p>
          )}
        </div>
      </div>
      {message && <MessageString message={message} />}
    </>
  )
}

export default ManageCategories
