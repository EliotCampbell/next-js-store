import classes from '@/components/Login/Login.module.css'
import Input from '@/components/UI/Input/Input'
import Button from '@/components/UI/Button/Button'
import React, { useState } from 'react'
import { registrationFetch } from '@/http/auth'
import { useUserStore } from '@/store/mainStore/store'
import MessageString from '@/components/UI/MessageString/MessageString'

const Register = ({ setLogOrRegSwitcher }) => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    username: '',
    repeatPassword: ''
  })

  const { message, setMessage } = useUserStore((state) => ({
    message: state.message,
    setMessage: state.setMessage
  }))

  const register = async (event) => {
    event.preventDefault()
    try {
      if (input.password !== input.repeatPassword) {
        return setMessage({ ok: false, message: "Passwords don't match" })
      }
      const formData = new FormData(event.target)
      const data = await registrationFetch(formData)
      if (data.ok === true) {
        setLogOrRegSwitcher('signin')
      } else if (data.ok === false) {
        setMessage(data)
      } else {
        console.log(`Registration error`)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <>
      <h2 className={classes.h2}>Create a Buy This! Account</h2>
      <form onSubmit={register} className={classes.form} id={'register'}>
        <Input
          type={'email'}
          name={'email'}
          label={'E-mail'}
          placeholder={'my-email@mail.com'}
          value={input.email}
          onChange={(e) => {
            setMessage(null)
            setInput({ ...input, email: e.target.value })
          }}
        ></Input>
        <Input
          type={'UserName'}
          name={'username'}
          label={'Username'}
          placeholder={'My Username'}
          value={input.username}
          onChange={(e) => {
            setMessage(null)
            setInput({ ...input, username: e.target.value })
          }}
        ></Input>
        <Input
          type={'password'}
          name={'password'}
          label={'Password'}
          placeholder={'password'}
          value={input.password}
          onChange={(e) => {
            setMessage(null)
            setInput({ ...input, password: e.target.value })
          }}
        ></Input>
        <Input
          name={'repeatPassword'}
          label={'Repeat password'}
          placeholder={'Repeat password'}
          value={input.repeatPassword}
          onChange={(e) => {
            setMessage(null)
            setInput({ ...input, repeatPassword: e.target.value })
          }}
          type={'password'}
        ></Input>
        {message && <MessageString message={message} />}
        <div className={classes.buttonWrapper}>
          <div
            className={classes.registerLink}
            onClick={() => {
              setMessage(null)
              setLogOrRegSwitcher('signin')
            }}
          >
            Already have an account?
          </div>
          <Button type={'submit'}>{'Register'}</Button>
        </div>
      </form>
    </>
  )
}

export default Register
