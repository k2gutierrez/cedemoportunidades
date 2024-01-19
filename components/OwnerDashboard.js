'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/OwnerDashboard.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";

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

export default function OwnerDashboard() {

    const { logout, currentUser } = useAuth()
    const [list, setList] = useState([])
    const [idUser, setId] = useState('')
    const [causas, setCausas] = useState([])
    const [efectos, setEfectos] = useState([])
    const [np, setNP] = useState([])
    const [causasS, setCausasS] = useState([])

    async function getList () {
        let newArray = []
        const dbRef = ref(db)
        const getUsers = await get(child(dbRef, '/'))
        if (getUsers.exists()) {
            for (let x in getUsers.val()) {
                newArray.push(getUsers.val()[x])
            }
        }
        let users = newArray.filter((word) => word.NIVEL == "user")
        await setList(users)

    }

    async function getListCausas () {
        let newArray = []
        const dbRef = ref(db)
        const getDolenciasP = await get(child(dbRef, idUser + '/dolencias/CausasDeCausas'))
        if (getDolenciasP.exists()) {
          for (let x in getDolenciasP.val()) {
            newArray.push(getDolenciasP.val()[x])
          }
        }
        setCausas(newArray)
      }
    
    async function getListEfectos () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, idUser + '/dolencias/Categorizado'))
    if (getDolenciasP.exists()) {
        for (let x in getDolenciasP.val()) {
        newArray.push(getDolenciasP.val()[x])
        }
    }

    let listEfectos = newArray.filter((word) => word.opcion == "E")
    let listNP = newArray.filter((word) => word.opcion == "N")
    let listCausas = newArray.filter((word) => word.opcion == "C")

    setEfectos(listEfectos)
    setNP(listNP)
    setCausasS(listCausas)
    }

    const reload = async () => {
        await getListCausas()
        await getListEfectos()
    }

    useEffect(() => {

        getList()

        if (idUser != '') {
            getListCausas()
            getListEfectos()
        }

    }, [idUser])

    return (
        <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>
            <div className='row justify-content-center align-items-center'>
            <div className={cls(styles.box, 'row justify-content-center align-items-center')}>
                <div className={cls(styles.main, styles.text, '')}>
                    <p className={cls(styles.title)}>Oportunidades y Problemas de Crecimiento</p>
                </div>
                <div className={cls(styles.subtitle, styles.select, 'mb-3')}>
                    <select className="form-select" onChange={(e) => setId(e.target.value)} aria-label="Default select example">
                        <option selected value={''} >Selecciona al Usuario</option>
                        {list.map((v, k) => {
                            return (
                                <option key={k} value={ v.ID }>{ v.NAME }</option>
                            )
                        })
                        } 

                    </select>
                </div>
                {idUser == '' ? (<></>) :
                    (
                        <div className='text-center my-3'>
                            <button type="button" onClick={reload} className="btn btn-secondary">Recargar</button>
                        </div>
                    )
                }
                {causas.length == 0 ? (<></>) :
                (
                    <div>
                        <p>Causas de Causas</p>
                        {causas.map((v, k) => {
                            return(
                                <div key={k} className={cls(styles.card, "card border-primary mb-3 text-start")} >
                                    <div className="card-header">{ v.dolencia }</div>
                                    <div className="card-body text-primary">
                                    <p className="card-text">{ v.descripcion }</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                )
                }

                {causasS.length == 0 ? (<></>) :
                (
                    <div>
                        <p>Causas</p>
                        <ol className="list-group list-group-numbered">
                        {causasS.map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">{ v.dolencia }</li>

                        )
                        })}
                        </ol>
                    </div>
                )
                }

                {efectos.length == 0 ? (<></>) :
                (
                    <div>
                        <p>Efectos</p>
                        <ol className="list-group list-group-numbered">
                        {efectos.map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">{ v.dolencia }</li>

                        )
                        })}
                        </ol>
                    </div>
                )
                }
                {np.length == 0 ? (<></>) :
                (
                    <div>
                        <p>No Problemas</p>
                        <ol className="list-group list-group-numbered">
                        {np.map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">{ v.dolencia }</li>

                        )
                        })}
                        </ol>
                    </div>
                )
                }
                
            </div>
            </div>
        </div>
    )
}
