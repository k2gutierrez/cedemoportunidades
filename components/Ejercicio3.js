import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio3.module.css'
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

export default function Ejercicio3({ action, action2 }) {

  const { currentUser } = useAuth()

  let [list, setList] = useState([])
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
    window.alert("Registros categorizados")
  }

  useEffect(() => {

    getList()

  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row'>
          <div>
            <p className={cls('text-start')}>
              Analiza cada opción por separado sin relacionarlas con las demás. Elige si la opción 
              es una Causa (C), Efecto (E) o No Problema (N).
            </p>
          </div>
          <div className={cls('row my-3 gap-3 px-4')}>

            {list.map((v, k) => {
              
              const getSelection = (e) => {
                let state = true
                let valor = e.target.value

                let a = {
                  dolencia: v,
                  opcion: valor
                }

                if (arr.length == 0) {
                  arr.push(a)
                }

                for (let i = 0; i < arr.length; i++) {
                  if (arr[i].dolencia == a.dolencia) {
                    arr[i].opcion = valor
                    state = true
                    break
                    
                  } else {
                    state = false
                  }
                }

                if (state == false) {
                  arr = [...arr, a]
                  state = true
                }

              }

              return (
                <div className="" key={k}>
                  <p>{ v }</p>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" onChange={getSelection} type="radio" name={k} id="inlineRadio1" value="C" />
                    <label className="form-check-label" htmlFor="inlineRadio1">C</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" onChange={getSelection} type="radio" name={k} id="inlineRadio2" value="E" />
                    <label className="form-check-label" htmlFor="inlineRadio2">E</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" onChange={getSelection} type="radio" name={k} id="inlineRadio3" value="N" />
                    <label className="form-check-label" htmlFor="inlineRadio3">N</label>
                  </div>
                </div>

              )
            })}

          </div>
        </div>
        <div className={cls('my-2 d-flex justify-content-center gap-5')}>

            <button type="button" onClick={add} className="btn btn-info">Guardar</button>

        </div>
        <div className={cls('my-3 d-flex justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>

            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
