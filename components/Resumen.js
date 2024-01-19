import React, { useEffect, useState } from 'react'
import styles from '../styles/Resumen.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'


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

export default function Resumen({ action }) {

  const { currentUser } = useAuth()

  let [list, setList] = useState([])
  let [listEfectos, setListEfectos] = useState([])
  let [listNP, setListNP] = useState([])

  async function getList () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/CausasDeCausas'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
      }
    }
    setList(newArray)
  }

  async function getListEfectos () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/Categorizado'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
      }
    }

    let listEfectos = newArray.filter((word) => word.opcion == "E")
    let listNP = newArray.filter((word) => word.opcion == "N")

    setListEfectos(listEfectos)
    setListNP(listNP)
  }

  useEffect(() => {

    getList()
    getListEfectos()
    

  }, [])


  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row'>
          <div>
            <p className={cls('text-center')}>
              Oportunidades y Problemas de Crecimiento
            </p>
          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Causas de Causa</p>

              {list.map((v, k) => {

                return (
                  <div className={cls(styles.card, "card border-primary mb-3")} >
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
                {listEfectos.map((v, k) => {

                  return (
                    
                    <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
              </ol>
          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>No problemas</p>
              <ol className="list-group list-group-numbered">
                {listNP.map((v, k) => {

                  return (
                    
                      <li key={k} className="list-group-item">{ v.dolencia }</li>

                  )
                })}
              </ol>

          </div>
          
        </div>
        
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>
        </div>
    </div>
  )
}
