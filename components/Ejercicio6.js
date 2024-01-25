import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio6.module.css'
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

export default function Ejercicio6({ action, action2 }) {

  const { currentUser } = useAuth()

  let [listP, setListP] = useState([])
  let [listS, setListS] = useState([])

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

  async function addP (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/listaP/${key}/`), {
      descripcion: val
    })
  }

  async function addS (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      descripcion: val
    })
  }

  useEffect(() => {

    getList()
    

  }, [])


  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'text-center p-3')}>
        <div className='row'>
        <div className={cls(styles.main, 'align-items-center justify-content-center self-align-center')}>
          <div className={cls('justify-content-center')}>
            <div>
              <p className={cls('text-center')}>
                Identificando Causas de Causas
              </p>
            </div>
            <div>
              <p className={cls('text-start')}>
                Profundiza por qué es prioritaria cada causa seleccionada:
              </p>
            </div>

            <div className={cls('my-3 gap-3 px-4')}>
              <p className={cls('text-center')}>Causas de Causa</p>

                {listP.map((v, k) => {

                  const ans1 = async (e) => {
                    let valor = await e.target.value
                    setTimeout(addP(k, valor), 5000)

                  }

                  return (
                    <>
                    
                      { v.causaDeCausas == true &&
                        (
                          <div key={k} className={cls(styles.list, "align-items-center justify-content-center text-center")}>
                            <div className="p-2 text-center align-items-center justify-content-center">
                                <p>{ v.dolencia }</p>
                                <textarea type="text" className={cls(styles.inputs, "form-control")} onChange={ans1} defaultValue={v.descripcion}  />
                              
                            </div>
                          </div>
                        )
                      }

                    </>
                  )
                })}

                {listS.map((v, k) => {

                  const ans2 = async (e) => {
                    let valor = await e.target.value
                    setTimeout(addS(k, valor), 5000)

                  }

                  return (
                    <>
                    
                      { v.causaDeCausas == true &&
                        (
                          <div key={k} className={cls(styles.list, "align-items-center justify-content-center text-center")}>
                            <div className="p-2 text-center align-items-center justify-content-center">
                                <p>{ v.dolencia }</p>
                                <textarea type="text" className={cls(styles.inputs, "form-control")} onChange={ans2} defaultValue={v.descripcion}  />
                              
                            </div>
                          </div>
                        )
                      }

                    </>
                  )
                })}

            </div>
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
