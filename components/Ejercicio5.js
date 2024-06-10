import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio5.module.css'
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

export default function Ejercicio5({ action, action2 }) {

  const { currentUser } = useAuth()

  let [listSeleccion, setListSeleccion] = useState([])
  let [listP, setListP] = useState([])

  async function getList () {
    let newArray1 = []
    let newArray2 = []
    const dbRef = ref(db)
    const getDolenciasS = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion'))
    if (getDolenciasS.exists()) {
      for (let x in getDolenciasS.val()) {
        newArray1.push(getDolenciasS.val()[x])
      }
    }
    setListSeleccion(newArray1)

    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray2.push(getDolenciasP.val()[x])
      }
    }
    setListP(newArray2)
  }

  async function addSele (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      causaDeCausas: val
    })
    
  }

  async function addP (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/listaP/${key}/`), {
      causaDeCausas: val
    })
    
  }

  useEffect(() => {

    getList()

  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'pt-3 px-2')}>
        <div className='row justify-content-center'>
        <div className={cls(styles.main, 'row')}>
          <div>
            <p className={cls('text-center')}>
              Causas más Relevantes
            </p>
          </div>
          <div>
            <p className={cls('text-start')}>
              Selecciona las 3 causas que consideres más importantes a atender en este momento:
            </p>
          </div>

          <div className={cls('text-start')}>
            <p className={cls('text-center')}>Causas</p>
              <ul className="list-group">

              {listP.map((v, k) => {
                let check = v.causaDeCausas
            
                async function toggleAction () {
                  check = !check
                  v.causaDeCausas = check
                   
                  await addP(k, check)
                }

                return (
                  <>
                    { v.categoria == "C" && (
                      <li className="list-group-item py-3" key={k}>
                      <div className="form-check">
                        <input className="form-check-input" onChange={toggleAction} defaultChecked={check} type="checkbox" value={v.dolencia} id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          { v.dolencia }
                        </label>
                      </div>
                      </li>
                    )

                    }
                  </>
                )
              })}
                </ul>
                <ul className="list-group">
              {listSeleccion.map((v) => {
                let llave = v.key + 's'
                let check = v.causaDeCausas
            
                async function toggleAction () {
                  check = !check
                  v.causaDeCausas = check
                   
                  await addSele(v.key, check)
                }

                return (
                  <>
                    { v.categoria == "C" && (
                      <li className="list-group-item py-3" key={llave}>
                      <div className="form-check"> 
                        <input className="form-check-input" onChange={toggleAction} defaultChecked={check} type="checkbox" value={v.dolencia} id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          { v.dolencia }
                        </label>
                      </div>
                      </li>
                    )

                    }
                  </>
                )
              })}
              </ul>

          </div>
          
        </div>
        </div>
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>

            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
