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

  const [answer1, setAnswer1] = useState('')

  let [list, setList] = useState([])

  async function getList () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/CausasDeCausas'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
      }
    }
    setList(newArray)
  }

  async function add () {
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      CausasDeCausas: list
    })
    window.alert("Quedó registrado el registro")
  }

  useEffect(() => {

    getList()
    

  }, [])


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
              Profundiza por qué es prioritaria cada causa seleccionada:
            </p>
          </div>

          <div className={cls('row my-3 gap-3 px-4 text-start')}>
            <p className={cls('text-center')}>Causas de Causa</p>

              {list.map((v, k) => {

                const ans1 = async () => {
                  let arr = list
                  arr[k].descripcion = answer1
                  await setList(arr)
                  setAnswer1('')
                  await add()
                  console.log(list)
                }

                return (
                  <div key={k} className={cls(styles.list, "d-flex flex-row align-items-center justify-content-center text-center")}>
                    <div className="p-2 text-center align-items-center justify-content-center">
                        <p>{ v.dolencia }</p>
                        <textarea type="text" className={cls(styles.inputs, "form-control")} onChange={(e) => setAnswer1(e.target.value)} defaultValue={v.descripcion}  />
                        <div className="d-flex flex-shrink-1 justify-content-center">
                          <button type="button btn-sm" onClick={ans1} id={k+'Addbtn'} className={cls("btn btn-transparent")}>
                            <FontAwesomeIcon className={cls(styles.botonIcon,'img-fluid')} icon={faCircleCheck} />
                          </button>
                        </div>
                      
                    </div>
                    
                  </div>

                )
              })}

          </div>
          
        </div>
        
        <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>

            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
