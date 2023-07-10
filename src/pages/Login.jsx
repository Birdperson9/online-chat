import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { user, handleUserLogin } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  // useEffect(() => {
  //   if (user) {
  //     navigate('/')
  //   }
  // }, [])

  const handleInputChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    setCredentials({ ...credentials, [name]: value })
  }

  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form
          onSubmit={(e) => {
            handleUserLogin(e, credentials)
          }}
        >
          <div className='field--wrapper'>
            <label htmlFor='email'>Email:</label>
            <input
              required
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={credentials.email}
              onChange={(e) => {
                handleInputChange(e)
              }}
            />
          </div>

          <div className='field--wrapper'>
            <label>Password:</label>
            <input
              required
              type='password'
              name='password'
              placeholder='Enter password...'
              value={credentials.password}
              onChange={(e) => {
                handleInputChange(e)
              }}
            />
          </div>

          <div className='field--wrapper'>
            <input className='btn btn--lg btn--main' type='submit' value='Login' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login