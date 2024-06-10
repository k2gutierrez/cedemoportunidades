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
})

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

  const [loader, setLoader] = useState(true)
  let [listSeleccion, setListSeleccion] = useState([])
  let [listP, setListP] = useState([])
  let arr = []

  async function getList() {
    let newArray1 = []
    let newArray2 = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray1.push(getDolenciasP.val()[x])
      }
      setListSeleccion(newArray1)
    }
    const getDolenciasS = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolenciasS.exists()) {
      for (let y in getDolenciasS.val()) {
        newArray2.push(getDolenciasS.val()[y])
      }
      setListP(newArray2)
    }
    setLoader(false)
  }

  async function add1(key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/listaP/${key}/`), {
      categoria: val
    })
  }

  async function add2(key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      categoria: val
    })
  }

  useEffect(() => {

    getList()

  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'pt-3 pb-5')}>
      { loader ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      
      ) : (
        <div className='row justify-content-center align-items-center'>
        <div className={cls(styles.main, '')}>
          <div>
            <p className={cls(styles.text, 'text-start')}>
              Analiza cada opción por separado sin relacionarlas con las demás. Elige si la opción
              es una Causa (C), Efecto (E) o No Problema (N).
            </p>
          </div>
          <div className={cls('row')}>
            <ul className="list-group">
              {listP.map((v, k) => {

                const getSelection1 = async (e) => {

                  let valor = await e.target.value

                  await add1(k, valor)

                }

                return (
                  <li className={cls(styles.subtext, "list-group-item py-3 px-2")} key={k}>
                    <p>{v.dolencia}</p>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" onChange={getSelection1} type="radio" defaultChecked={v.categoria != 'C' ? false : true} name={k} id="inlineRadio1" value="C" />
                      <label className="form-check-label" htmlFor="inlineRadio1">C</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" onChange={getSelection1} type="radio" defaultChecked={v.categoria != 'E' ? false : true} name={k} id="inlineRadio2" value="E" />
                      <label className="form-check-label" htmlFor="inlineRadio2">E</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" onChange={getSelection1} type="radio" defaultChecked={v.categoria != 'N' ? false : true} name={k} id="inlineRadio3" value="N" />
                      <label className="form-check-label" htmlFor="inlineRadio3">N</label>
                    </div>
                  </li>

                )
              })}


            </ul>
          </div>
          <div className={cls('row')}>

            <ul className="list-group">


              {listSeleccion.map((v, k) => {

                let llave = v.key + 's'

                const getSelection2 = async (e) => {

                  let valor = await e.target.value

                  await add2(v.key, valor)

                }

                return (
                  <>
                    {v.check == true ?
                      (
                        <li className={cls(styles.subtext, "list-group-item py-3 px-2")} key={llave}>
                          <p>{v.dolencia}</p>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" onChange={getSelection2} type="radio" defaultChecked={v.categoria != 'C' ? false : true} name={llave} id="inlineRadio1" value="C" />
                            <label className="form-check-label" htmlFor="inlineRadio1">C</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" onChange={getSelection2} type="radio" defaultChecked={v.categoria != 'E' ? false : true} name={llave} id="inlineRadio2" value="E" />
                            <label className="form-check-label" htmlFor="inlineRadio2">E</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" onChange={getSelection2} type="radio" defaultChecked={v.categoria != 'N' ? false : true} name={llave} id="inlineRadio3" value="N" />
                            <label className="form-check-label" htmlFor="inlineRadio3">N</label>
                          </div>
                        </li>
                      ) : (<></>)
                    }
                  </>


                )
              })}
            </ul>
          </div>
        </div>
      </div>
      )
      }

      <div className={cls('mt-3 mb-4 d-flex justify-content-center gap-3 px-2')}>
        <button type="button" onClick={action} className="btn btn-info">Regresar</button>

        <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
      </div>
    </div>
  )
}


