'use client'
import { useState } from 'react'
import cls from 'classnames'
import { useAuth } from '../context/authContext'
import styles from '../styles/Login.module.css'
import Image from 'next/image'
import localFont from 'next/font/local'
import logo from '../public/assets/cedemLogo.png'
import Link from 'next/link'
import Recover from './Recover'

const MichromaReg = localFont({ 
  src: '../public/fonts/Michroma-Regular.ttf'
} )

const MontserratLight = localFont({
  src: '../public/fonts/Montserrat-Light.ttf'
})

const MontserratExtraBold = localFont({
  src: '../public/fonts/Montserrat-ExtraBold.ttf'
})

const MontserratSemiBold = localFont({
  src: '../public/fonts/Montserrat-SemiBold.ttf'
})

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState(null)
  const [isLogIn, setIsLogIn] = useState(true)

  const { login, signup, currentUser } = useAuth()

  async function submitHandler() {
    if (!email || !password){
      setError('Por favor ingresa correo y contraseña')
      return 
    }

    if (isLogIn == true) {
      try {
        await login(email, password)
      } catch (err) {
        setError("Correo o contraseña incorrecta")
      }
      return
    }

    if (isLogIn == false) {

      if (nombre == "" || nombre.length < 5) {
        setError("Ingresa tu nombre completo")
        return
      }

      await signup(email, password, nombre)

    }

    

  }

  return (
    <div className={cls(MontserratLight.className, styles.cont, 'pb-5')}>
        <div className='row justify-content-center'>
          
          <div className={cls(styles.main, styles.text, '')}>
            <Image src={logo} className={cls(styles.logo, 'img-fluid')}  alt='CEDEM' width={300} height={300} />
            {/*<p className={cls(MontserratExtraBold.className, styles.title)}>
              Consultoría de Dueños
            </p>*/}
            <p className={cls(MontserratSemiBold.className, styles.subtitle)}>
              Oportunidades y Problemas de Crecimiento
            </p>
            <div className='row  justify-content-center align-items-center'>
              <div className={cls(styles.caja, 'mt-4 p-2')}>
                <p className={cls(styles.title, styles.ingreso, '')}>{isLogIn ? 'Ingresar' : 'Registrarse'}</p>
                
                {error && <div className={cls(MontserratSemiBold.className, styles.error, 'py-2')}>{ error }</div>}
                
                {!isLogIn &&<div className={cls('')}>
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input type="text" id="name" onChange={(e) => setNombre(e.target.value)} className={cls(styles.input, styles.text, "form-control")} value={nombre} />
                </div>
                }
                <div className={cls('')}>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} className={cls(styles.input, styles.text, "form-control")} value={email} />
                </div>
                <div className={cls('')}>
                  <label htmlFor="inputPassword5" className="form-label">Password</label>
                  <input type="password" id="inputPassword5" onChange={(e) => setPassword(e.target.value)} className={cls(styles.input, styles.text, "form-control")} value={password} aria-describedby="passwordHelpBlock" />
                  
                </div>
                <div className='mt-3 pb-2'>
                  <button type="button" onClick={submitHandler} className="btn btn-primary">Submit</button>
                </div>
                <p className={cls(styles.ingreso, styles.login, '')} onClick={() => setIsLogIn(!isLogIn)}>{ isLogIn ? 'Register' : 'Ingresar' }</p>
                <h5 className={cls(styles.ingreso, styles.login, '')}><Recover /></h5>
              </div>
              
            </div>
            
          </div>
          
        </div>
        
    </div>
  )
}
