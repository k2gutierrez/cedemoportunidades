import React, { useEffect, useState } from 'react'
import styles from '../styles/Ejercicio1.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCanArrowUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons'


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


export default function Ejercicio1({ action, action2 }) {

  const { currentUser } = useAuth()

  const [answer, setAnswer] = useState('')
  let [ListP, setListP] = useState([])
  const [change, setChange] = useState(false)

  async function getListP () {
    const dbRef = ref(db)
    const getDolencias = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolencias.exists()) {

      setListP(getDolencias.val())
    }
  }

  async function addNew () {
    let arr = ListP
    arr.push({
      dolencia: answer,
      descripcion: "", 
      categoria: "", 
      causaDeCausas: false,
      personal: true
    })
    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      listaP: arr
    })
    setAnswer('')
    setListP(arr)
    setChange(!change)

  }

  async function add (value) {

    const adding = await update(ref(db, currentUser.uid + '/dolencias/'), {
      listaP: value
    })
    setChange(!change)
    setListP(value)

  }

  useEffect(() => {
    
    getListP()

  }, [change]) 

  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
      <div className='row align-items-center justify-content-center text-center'>
      <div className={cls(styles.main, 'align-items-center justify-content-center text-center')}>
          <div className=''>
            <p className={cls(styles.title, 'text-start')}>Identifica las oportunidades y los problemas de crecimiento que 
              prevalecen en tu empresa y anótalos.
            </p>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className={cls(styles.subtitle, "form-label")}>Agregar oportunidad o problema de crecimieno:</label>
              <input type="text" onChange={(e) => setAnswer(e.target.value)} value={answer} className={cls(styles.inputs, "form-control")} id="exampleFormControlInput1" placeholder="Oportunidad o Problema de Crecimiento" />
            </div>
            <div>
              <button type="button" onClick={addNew} className="btn btn-info">Add</button>
            </div>
          </div>
          <div className={cls('text-start my-3')}>

            {ListP.map((v, k) => {
              let edit = false
              let newVal

              const newEdit = () => {

                document.getElementById(k+'inp').disabled = false
                edit = true
                
              }

              const AddEdit = async () => {
                const inpu = document.getElementById(k+'inp')
                const val = inpu.value
                let cambioDeValor = ListP[k].dolencia = val
                
                await add(ListP)
                inpu.disabled = true
                
              }

              const DeleteEdit = async () => {
                let arr1 = ListP
                let removeOp = await _.remove(arr1, (n) => {
                  return n.dolencia == v.dolencia
                })
                
                await add(arr1)
                await setListP([])
                
              }

              return (

                <div key={k} className={cls(styles.list, "d-flex flex-row align-items-center justify-content-center text-center gap-1")}>
      
                  <div className="p-2 d-flex w-100">

                      <textarea type="text" className={cls(styles.inputs, "form-control")} rows='3' disabled={true} id={k+'inp'} defaultValue={v.dolencia} value={newVal}  />

                  </div>
                  
                  <div className="d-flex flex-shrink-1 justify-content-end">
                    <button type="button btn-sm" onClick={newEdit} id={k+'Editbtn'} className={cls(styles.botonIcon,"btn btn-transparent")}>
                      <FontAwesomeIcon className='' icon={faPencil} />
                    </button>
                    
                  </div>
                  <div className="d-flex flex-shrink-1 justify-content-end">
                    <button type="button btn-sm" onClick={AddEdit} id={k+'Addbtn'} className={cls(styles.botonIcon,"btn btn-transparent")}>
                      <FontAwesomeIcon className='' icon={faCircleCheck} />
                    </button>
                  </div>
                  <div className="d-flex flex-shrink-1 justify-content-end">
                    <button type="button btn-sm" onClick={DeleteEdit} className={cls(styles.botonIcon,"btn btn-transparent")}>
                      <FontAwesomeIcon icon={faTrashCanArrowUp} />
                    </button>
                  </div>
                </div>

              )
            })}

          </div>
        </div>
      </div>
        
        <div className={cls('my-5 gap-3 justify-content-center d-flex px-4')}>
            <button type="button" onClick={action} className="btn btn-info">Regresar</button>
            <button type="button" onClick={action2} className="btn btn-info">Continuar</button>
        </div>
    </div>
  )
}
