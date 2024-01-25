import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio4.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import _ from 'lodash'


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

export default function Ejercicio4({ action, action2 }) {

  const { currentUser } = useAuth()

  let [list, setList] = useState([])

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
      for (let x in getDolenciasS.val()) {
        newArray.push(getDolenciasS.val()[x])
      }
    }
    setList(newArray)
  }

  useEffect(() => {
    
    getList()


  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row justify-content-center'>
        <div className={cls(styles.main, 'row')}>
          <div>
            <p className={cls('text-center')}>
              Lista por Categoría
            </p>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Causas</p>
            <ul className="list-group-numbered">
              { list.filter((word) => word.categoria == "C").map((v, k) => {
                return (
                  
                  <li key={k} className="list-group-item"> {v.dolencia} </li>

                )
              })}
            </ul>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Efectos</p>
            <ul className="list-group-numbered">
              { list.filter((word) => word.categoria == "E").map((v, k) => {
                return (
                  
                  <li key={k} className="list-group-item"> {v.dolencia} </li>

                )
              })}
            </ul>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>No Problemas</p>
            <ul className="list-group-numbered">
              { list.filter((word) => word.categoria == "N").map((v, k) => {
                return (
                  
                  <a key={k} className="list-group-item"> {v.dolencia}  </a>

                )
              })}
            </ul>
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
