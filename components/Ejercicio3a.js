import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Ejercicio3.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import _ from 'lodash'
import expli from '../public/assets/explicacion2.jpeg'


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

export default function Ejercicio3a({ action, action2 }) {

  const { currentUser } = useAuth()

  {/*let [list, setList] = useState([])
  let arr = []

  async function getList () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
      }
    }
    const getDolenciasS = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolenciasS.exists()) {
      for (let y in getDolenciasS.val()) {
        newArray.push(getDolenciasS.val()[y])
      }
    }
    setList(newArray)
  }

  async function add () {
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      Categorizado: arr
    })
  }

  useEffect(() => {

    getList()

  }, [])*/}

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row justify-content-center'>
        <div className={cls(styles.main, 'row')}>
          <div>
            <h1 className={cls('text-start')}>
              ESPERA LA EXPLICACIÓN ANTES DE CONTINUAR!
            </h1>
            <Image className='img-fluid my-4' src={expli} alt='Problemas y Oportunidades de Crecimiento' width={1100} height={600} />
          </div>
        </div>
        </div>
        <div className={cls('my-3 d-flex justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>

            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
