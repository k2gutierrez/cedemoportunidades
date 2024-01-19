import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio2.module.css'
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

export default function Ejercicio2({ action, action2 }) {

  const { currentUser } = useAuth()

  const [answer, setAnswer] = useState([])
  const [ListP, setListP] = useState([])

  async function getList () {
    const dbRef = ref(db)
    const getDolencias = await get(child(dbRef, 'dolencias'))
    if (getDolencias.exists()) {

      setListP(getDolencias.val())
    }
  }

  async function add () {
    ListP.push(answer)
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      Seleccion: answer
    })
    setAnswer([])
    window.alert("Registro Guardado!")
  }

  useEffect(() => {

    getList()

  }, [])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row'>
          <div>
            <p className={cls('text-start')}>
              Favor de seleccionar la casilla en la parte izquierda 
              aquellas oportunidades o problemas (Áreas Críticas de Mejora) que consideres que están 
              ocurriendo en tu organización. Analiza cada uno por separado sin relacionarlo con los 
              demás. Anota tantos como tú creas que se dan en tu empresa. Sé sincero y aprovecha esta 
              ocasión para buscar caminos de mejora.
            </p>
          </div>
          <div className={cls('row text-start my-3 gap-3 px-4')}>

            {ListP.slice(0, 26).map((v, k) => {
              let check = false
              async function toggleAction () {
                check = !check
                if (check == false) {
                  let removeOp = _.remove(answer, (n) => {
                    return n == v.dolencia
                  })

                } else if (check == true) {
                  answer.push(v.dolencia)

                }
                
              }

              return (
                <div className="form-check" key={k}>
                  <input className="form-check-input" onChange={toggleAction} type="checkbox" value={v.dolencia} id="flexCheckDefault" />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    { v.dolencia }
                  </label>
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
