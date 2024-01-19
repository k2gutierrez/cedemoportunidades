'use client'
import React from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/Dashboard.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'

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

export default function Dashboard({ action }) {

    const { logout, currentUser } = useAuth()

    return (
        <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
            <div className='row justify-content-center align-items-center'>
            <div className={cls(styles.main, 'row justify-content-center align-items-center gap-3')}>
                <div className={cls(styles.text, '')}>
                    <p className={cls(styles.title)}>Oportunidades y Problemas de Crecimiento</p>
                </div>
                <div className={cls(styles.subtitle)}>
                    <p>
                        Instrucciones
                    </p>
                    <p className={cls(styles.text, 'text-start')}> 
                        A continuación aparecerán diferentes opciones a elegir...
                        Cuando estés listo da click en el botón "Comenzar actividad"
                    </p>
                </div>
                <div className={cls('my-3')}>
                    <button type="button" onClick={action} className="btn btn-info">Comenzar</button>
                </div>
            </div>
            </div>
        </div>
    )
}
