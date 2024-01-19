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
  let [listCausas, setListCausas] = useState([])
  let [listEfectos, setListEfectos] = useState([])
  let [listNoProblema, setListNoProblema] = useState([])
  let arr = []

  async function getList () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/Categorizado'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
      }
    }
    setList(newArray)
  }

  async function add () {
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      Categorizado: arr
    })
    window.alert("Registros categorizados")
  }

  useEffect(() => {
    if (list.length < 1) {
      getList()
    }
    let list1 = list.filter((word) => word.opcion == "C")
    let list2 = list.filter((word) => word.opcion == "E")
    let list3 = list.filter((word) => word.opcion == "N")
    
    setListCausas(list1)
    setListEfectos(list2)
    setListNoProblema(list3)

  }, [list])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row'>
          <div>
            <p className={cls('text-center')}>
              Lista por Categoría
            </p>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Causas</p>
            <ul className="list-group-numbered">
              { listCausas.map((v, k) => {
                return (
                  
                  <li key={k} className="list-group-item"> {v.dolencia} </li>

                )
              })}
            </ul>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Efectos</p>
            <ul className="list-group-numbered">
              { listEfectos.map((v, k) => {
                return (
                  
                  <li key={k} className="list-group-item"> {v.dolencia} </li>

                )
              })}
            </ul>
          </div>
          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>No Problemas</p>
            <ul className="list-group-numbered">
              { listNoProblema.map((v, k) => {
                return (
                  
                  <a key={k} className="list-group-item"> {v.dolencia}  </a>

                )
              })}
            </ul>
          </div>
        </div>
        <div className={cls('my-3 d-flex justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>
            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
