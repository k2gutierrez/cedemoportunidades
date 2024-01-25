import React, { useEffect, useState } from 'react'
import styles from '../styles/Resumen.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";


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

export default function Resumen({ action1, action2 }) {

  const { currentUser } = useAuth()

  let [listS, setListS] = useState([])
  let [listP, setListP] = useState([])

  async function getList () {
    let newArray1 = []
    let newArray2 = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray1.push(getDolenciasP.val()[x])
      }
    }
    setListP(newArray1)

    const getDolenciasS = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion'))
    if (getDolenciasS.exists()) {
      for (let x in getDolenciasS.val()) {
        newArray2.push(getDolenciasS.val()[x])
      }
    }
    setListS(newArray2)
  }

  useEffect(() => {

    getList()

  }, [])


  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row justify-content-center text-center'>
        <div className={cls(styles.main, 'justify-content-center align-items-center')}>
          <div>
            <p className={cls('text-center')}>
              Oportunidades y Problemas de Crecimiento
            </p>
          </div>

          <div className={cls(' text-start')}>
            <p className={cls('text-center')}>Causas de Causa</p>

              {listP.filter((word) => word.causaDeCausas == true).map((v, k) => {

                return (
                  <div key={k} className={cls(styles.card, "card border-primary mb-3")} >
                    <div className="card-header">{ v.dolencia }</div>
                    <div className="card-body text-primary">
                      <p className="card-text">{ v.descripcion }</p>
                    </div>
                  </div>


                )
              })}
              {listS.filter((word) => word.causaDeCausas == true).map((v, k) => {

                return (
                  <div key={k} className={cls(styles.card, "card border-primary mb-3")} >
                    <div className="card-header">{ v.dolencia }</div>
                    <div className="card-body text-primary">
                      <p className="card-text">{ v.descripcion }</p>
                    </div>
                  </div>

                )
              })}

          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Efectos</p>
              <ol className="list-group list-group-numbered">
                {listP.filter((word) => word.categoria == "E").map((v, k) => {

                  return (
                    
                    <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
                {listS.filter((word) => word.categoria == "E").map((v, k) => {

                  return (
                    
                    <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
              </ol>
          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>No problemas</p>
              <ol className="list-group list-group-numbered">
                {listP.filter((word) => word.categoria == "N").map((v, k) => {

                  return (
                    
                      <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
                {listS.filter((word) => word.categoria == "N").map((v, k) => {

                  return (
                    
                      <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
              </ol>

          </div>
          
        </div>
        </div>
        
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action1} className="btn btn-info">Volver al inicio</button>
            <button type="button" onClick={action2} className="btn btn-info" disabled>Imprimir PDF</button>
        </div>
    </div>
  )
}
