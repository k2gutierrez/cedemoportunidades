import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio2.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import _ from 'lodash'
import Pagination from 'react-bootstrap/Pagination';


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
  const [sel, setSel] = useState([])
  const [ListP, setListP] = useState([])

  async function getList () {
    const dbRef = ref(db)
    const getDolencias = await get(child(dbRef, 'dolencias'))
    if (getDolencias.exists()) {

      setListP(getDolencias.val())
    }
  }

  async function getSeleccion () {
    const dbRef = ref(db)
    const getSel = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion/'))
    if (getSel.exists()) {

      setSel(getSel.val())
      setAnswer(getSel.val())
    }
  }

  async function add () {
    
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      Seleccion: answer
    })
    
    
  }

  useEffect(() => {

    getList()
    getSeleccion()

  }, [])
  console.log(sel)

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
      <div className='row justify-content-center'>
      <div className={cls(styles.main, 'row')}>
        <div className=''>
          <p className={cls('text-start')}>
            Favor de seleccionar en las casillas de la parte izquierda 
            aquellas oportunidades o problemas (Áreas Críticas de Mejora) que consideres que están 
            ocurriendo en tu organización. Analiza cada uno por separado sin relacionarlo con los 
            demás. Selecciona tantas como tú creas que se dan en tu empresa. Sé sincero y aprovecha esta 
            ocasión para buscar caminos de mejora.
          </p>
        </div>
        <div className={cls('row text-start my-3 gap-3 px-4')}>

          {ListP.slice(0, 26).map((v, k) => {
            let check
            if (sel.length == 0) {
              check = false  
            }
            for (let i=0; i < sel.length; i++) {
              
              if (sel[i].dolencia == v.dolencia) {
                check = true
              } else {
                check = false
              }
            }
            async function toggleAction () {
              check = !check
              if (check == false) {
                let removeOp = _.remove(answer, (n) => {
                  return n.dolencia == v.dolencia
                })

              } else if (check == true) {
                answer.push({...v, check: true})

              }
             console.log(answer) 
             //add()
            }

            return (
              <div className="form-check" key={k}>
                <input className="form-check-input" onChange={toggleAction} type="checkbox" checked={check} value={v.dolencia} id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  { v.dolencia }
                </label>
              </div>

            )
          })}

        </div>
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
