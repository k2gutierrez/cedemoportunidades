'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/Dashboard.module.css'
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

    setEfectos(listEfectos)
    setNP(listNP)
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
            <div className={cls('row justify-content-center align-items-center gap-3')}>
                <div className={cls(styles.main, styles.text, '')}>
                    <p className={cls(styles.title)}>Oportunidades y Problemas de Crecimiento</p>
                </div>
                <div className={cls(styles.subtitle)}>
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
                {causas.length == 0 ? (<></>) :
                (
                    <div>
                        <p>Causas de Causas</p>
                        {causas.map((v, k) => {
                            return(
                                <div className={cls(styles.card, "card border-primary mb-3")} >
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
                {efectos.length == 0 ? (<></>) :
                (
                    <div>
                        <p>Efectos</p>
                        <ol className="list-group list-group-numbered">
                        {efectos.map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item">{ v.dolencia }</li>

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
                            
                            <li key={k} className="list-group-item">{ v.dolencia }</li>

                        )
                        })}
                        </ol>
                    </div>
                )
                }
                
            </div>
        </div>
    )
}
