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

  const [answer, setAnswer] = useState([])
  let [list, setList] = useState([])
  let [listCausas, setListCausas] = useState([])
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
      CausasDeCausas: answer
    })
    window.alert("Qudaron registradas las Causas de Causas")
  }

  useEffect(() => {
    if (list.length < 1) {
      getList()
    }
    let list1 = list.filter((word) => word.opcion == "C")
    
    setListCausas(list1)

  }, [list])

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
        <div className='row'>
          <div>
            <p className={cls('text-center')}>
              Identificando Causas de Causas
            </p>
          </div>
          <div>
            <p className={cls('text-start')}>
              Selecciona las 3 causas que consideres más importantes a atacar
            </p>
          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Causas</p>

              {listCausas.map((v, k) => {
                let check = false
                async function toggleAction () {
                  check = !check
                  if (check == false) {
                    let removeOp = _.remove(answer, (n) => {
                      return n == v.dolencia
                    })

                  } else if (check == true) {
                    answer.push({
                      dolencia: v.dolencia,
                      descripcion: ''
                    })

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
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-5')}>

            <button type="button" onClick={add} className="btn btn-info">Guardar</button>

        </div>
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>

            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
