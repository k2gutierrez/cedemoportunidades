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
    const [listS, setListS] = useState([])
    const [listP, setListP] = useState([])
    const [idUser, setId] = useState('')
    const [users, setUsers] = useState([])

    async function getList () {
        let arr1 = []
        let arr2 = []
        const dbRef = ref(db)
        const getDolenciasP = await get(child(dbRef, idUser + '/dolencias/listaP'))
        if (getDolenciasP.exists()) {
            for (let x in getDolenciasP.val()){
                arr1.push(getDolenciasP.val()[x])
            }
            setListP(arr1)
        }
        
    
        const getDolenciasS = await get(child(dbRef, idUser + '/dolencias/Seleccion'))
        if (getDolenciasS.exists()) {
            for (let x in getDolenciasS.val()){
                arr2.push(getDolenciasS.val()[x])
            }
            setListS(arr2)
        }
        
    }

    async function getUsers () {
        let newArray = []
        const dbRef = ref(db)
        const getUser = await get(child(dbRef, '/'))
        if (getUser.exists()) {
            for (let x in getUser.val()) {
                newArray.push(getUser.val()[x])
            }

        }
        let users = newArray.filter((word) => word.NIVEL == "user")
        setUsers(users)
    }

    const reload = async () => {
        getList()
        getUsers()
    }

    useEffect(() => {
        if (idUser != ''){
            getList()
        }
        
        getUsers()

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
                        <option value={''} >Selecciona al Usuario</option>
                        {users.filter((word) => word.NIVEL == "user").map((v, k) => {
                            return (
                                <option key={k} value={ v.ID }>{ v.NAME }</option>
                            )
                        })
                        } 

                    </select>
                </div>
                {idUser != '' && 
                    (
                        <div className='text-center my-3'>
                            <button type="button" onClick={reload} className="btn btn-secondary">Recargar información</button>
                        </div>
                    )
                }

                <div>
                    <p>Problemas y oportunidades personales:</p>
                    <ol className="list-group list-group-numbered">
                    {listP.map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                Dolencia: { v.dolencia }
                            </li>

                        )
                    })}
                    
                    </ol>
                </div>

                <div>
                    <p>Problemas y oportunidades seleccionados:</p>
                    <ol className="list-group list-group-numbered">
                    {listS.filter((word) => word.check == true).map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                Dolencia: { v.dolencia }
                            </li>

                        )
                    })}
                    
                    </ol>
                </div>
                

                <div>
                    <p>Causas</p>
                    <ol className="list-group list-group-numbered">
                    {listP.filter((word) => word.categoria == "C").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    {listS.filter((word) => word.categoria == "C").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    </ol>
                </div>

                <div>
                    <p>Efectos</p>
                    <ol className="list-group list-group-numbered">
                    {listP.filter((word) => word.categoria == "E").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Efecto personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    {listS.filter((word) => word.categoria == "E").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Efecto personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    </ol>
                </div>

                <div>
                    <p>No Problemas</p>
                    <ol className="list-group list-group-numbered">
                    {listP.filter((word) => word.categoria == "N").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'NP personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    {listS.filter((word) => word.categoria == "N").map((v, k) => {

                        return (
                            
                            <li key={k} className="list-group-item text-start">
                                <p>Dolencia: { v.dolencia }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'NP personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                            </li>

                        )
                    })}
                    </ol>
                </div>

                <div>
                    <p>Causas de Causas</p>
                    {listP.filter((word) => word.causaDeCausas == true).map((v, k) => {
                        return(
                            <div key={k} className={cls(styles.card, "card border-primary mb-3 text-start")} >
                                <div className="card-header">{ v.dolencia }</div>
                                <div className="card-body text-primary">
                                <p className="card-text">{ v.descripcion }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                                </div>
                            </div>
                        )
                    })}
                    {listS.filter((word) => word.causaDeCausas == true).map((v, k) => {
                        return(
                            <div key={k} className={cls(styles.card, "card border-primary mb-3 text-start")} >
                                <div className="card-header">{ v.dolencia }</div>
                                <div className="card-body text-primary">
                                <p className="card-text">{ v.descripcion }</p>
                                <p>Dimensión: { v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension }</p>
                                <p>Lastre: { v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre }</p>
                                </div>
                            </div>
                        )
                    })}
                </div>


                
            </div>
            </div>
        </div>
    )
}
