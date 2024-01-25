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

  let [listSeleccion, setListSeleccion] = useState([])
  let [listP, setListP] = useState([])
  let arr = []

  async function getList () {
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
  }

  async function add1  (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/listaP/${key}/`), {
      categoria: val
    })
  }

  async function add2  (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      categoria: val
    })
  }

  useEffect(() => {

    getList()

  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row justify-content-center'>
        <div className={cls(styles.main, 'row')}>
          <div>
            <p className={cls('text-start')}>
              Analiza cada opción por separado sin relacionarlas con las demás. Elige si la opción 
              es una Causa (C), Efecto (E) o No Problema (N).
            </p>
          </div>
          <div className={cls('row my-3 gap-5 px-4')}>
            
            {listP.map((v, k) => {
              
              const getSelection1 = async (e) => {
                
                let valor = await e.target.value

                await add1(k, valor)

              }

              return (
                <div className="" key={k}>
                  <p>{ v.dolencia }</p>
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
                </div>

              )
            })}

            

          </div>
          <div className={cls('row my-3 gap-5 px-4')}>
            
            

            {listSeleccion.map((v) => {

              let llave = v.key + 's'
              
              const getSelection2 = async (e) => {
                
                let valor = await e.target.value

                await add2(v.key, valor)

              }

              return (
                <>
                  { v.check == true ?
                    (
                      <div className="" key={llave}>
                        <p>{ v.dolencia }</p>
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
                      </div>
                    ) : (<></>)
                  }
                </>
                

              )
            })}

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


