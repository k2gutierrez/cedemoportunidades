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

  const [ListP, setListP] = useState([])
  const [newArr, setNewArr] = useState([])

  {/*async function getList () {
    const dbRef = ref(db)
    const getDolencias = await get(child(dbRef, 'dolencias'))
    if (getDolencias.exists()) {

      setListP(getDolencias.val())
    }                                       slice(0, 26).
  }*/}

  async function getSeleccion () {
    let newArray = []
    const dbRef = ref(db)
    const getSel = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion/'))
    if (getSel.exists()) {
      
      setListP(getSel.val())
      
    } else {

      const getDolencias = await get(child(dbRef, 'dolencias'))
      if (getDolencias.exists()) {
        for (let x in getDolencias.val()) {
          newArray.push({...getDolencias.val()[x], check: false, descripcion: "", categoria: "", causaDeCausas: false, key: x})
        }
        setListP(newArray)
      }

      const adding = await update(ref(db, currentUser.uid + `/dolencias/`), {
        Seleccion: newArray
      })
    }
    
  }

  async function addT (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      check: val
    })
    
  }

  async function addF (key, val) {
    const adding = await update(ref(db, currentUser.uid + `/dolencias/Seleccion/${key}/`), {
      check: val,
      categoria: ""
    })
    
  }

  useEffect(() => {

    getSeleccion()

  }, [])



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

          {ListP.map((v, k) => { 
            let check = v.check
            
            async function toggleAction () {
              check = !check
              v.check = check
              
              if (check == true){
                await addT(k, check)
              } else if (check == false){
                await addF(k, check)
              }

              
            }

            return (
              <div className="form-check" key={k}>
                <input className="form-check-input" defaultChecked={check} onChange={toggleAction} type="checkbox" value={v.dolencia} id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  { v.dolencia }
                </label>
              </div>

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
// al quitar el check, cambiar categorìa a ""   ya
// en impresiòn poner nombre y fecha actual
// mandar a correo con pdf