'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/OwnerDashboard.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";
import logo from '../public/assets/cedemLogo.png'
import Image from 'next/image'
import { Span } from 'next/dist/trace'

const MichromaReg = localFont({
    src: '../public/fonts/Michroma-Regular.ttf'
})

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
    const [usuario, setUsuario] = useState({})
    let currentDate = new Date().toJSON().slice(0, 10)
    let [proy, setProy] = useState('')
    let [cond, setCond] = useState('')
    let [dur, setDur] = useState('')
    const [dol, setDol] = useState([])

    async function getList() {
        let arr1 = []
        let arr2 = []
        let array3 = []
        const dbRef = ref(db)

        const usuario = await get(child(dbRef, idUser))
        if (usuario.exists()) {

            setUsuario(usuario.val())
        }

        const getProy = await get(child(dbRef, idUser + '/dolencias/proyecto'))
        if (getProy.exists()) {
            
            setProy(getProy.val())
        }

        const getCond = await get(child(dbRef, idUser + '/dolencias/condicion_economica'))
        if (getCond.exists()) {
            
            setCond(getCond.val())
        }

        const getDur = await get(child(dbRef, idUser + '/dolencias/duracion'))
        if (getDur.exists()) {
            
            setCond(getDur.val())
        }

        const getDolenciasP = await get(child(dbRef, idUser + '/dolencias/listaP'))
        if (getDolenciasP.exists()) {
            for (let x in getDolenciasP.val()) {
                arr1.push(getDolenciasP.val()[x])
            }
            setListP(arr1)
        }


        const getPreg = await get(child(dbRef, '/dolencias'))
        if (getPreg.exists()) {
            for (let x in getPreg.val()) {
                array3.push(getPreg.val()[x])
            }
            setDol(array3)
        }

        const getDolenciasS = await get(child(dbRef, idUser + '/dolencias/Seleccion'))
        if (getDolenciasS.exists()) {
            for (let x in getDolenciasS.val()) {
                arr2.push(getDolenciasS.val()[x])
            }
            setListS(arr2)
        }

        

    }

    async function getUsers() {
        let newArray = []
        let array2 = []
        const dbRef = ref(db)

        

        const getUser = await get(child(dbRef, '/'))
        if (getUser.exists()) {
            for (let x in getUser.val()) {
                
                newArray.push(getUser.val()[x])
                
            }

        }
        let users = newArray.filter((word) => word.NIVEL == "5")
        setUsers(users)
    }

    const reload = async () => {
        getList()
        getUsers()
    }

    async function addProyecto (e) {
        let value = e.target.value
        const adding = await update(ref(db, idUser + '/dolencias/'), {
          proyecto: value
        })
        setProy(value)
    }

    async function addCond (e) {
        let value = e.target.value
        const adding = await update(ref(db, idUser + '/dolencias/'), {
            condicion_economica: value
        })
        setCond(value)
    }

    async function addDur (e) {
        let value = e.target.value
        const adding = await update(ref(db, idUser + '/dolencias/'), {
            duracion: value
        })
        setDur(value)
    }

    useEffect(() => {
        if (idUser != '') {
            getList()
        }

        getUsers()

    }, [idUser])


    return (
        <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>

            <div className='row justify-content-center align-items-center'>
                <div className={cls(styles.box, 'row justify-content-center align-items-center')}>
                    <div className={cls(styles.main, styles.text, '')}>
                        <Image src={logo} alt='CEDEM' width={350} height={150} />
                        <p className={cls(styles.title, MontserratExtraBold.className)}>Problemas y Oportunidades de Crecimiento</p>
                    </div>
                    <div className={cls(styles.subtitle, styles.select, 'mb-3')}>
                        <select className="form-select" onChange={(e) => setId(e.target.value)} aria-label="Default select example">
                            <option value={''} >Selecciona al Usuario</option>
                            {users.filter((word) => word.dolencias != undefined).map((v, k) => { {/*filter((word) => word.NIVEL == "user").*/}
                                return (
                                    <option key={k} value={v.ID}>{v.NAME}</option>
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

                    <div className={cls(styles.textos)} id='pdf'>
                        <div className='row'>
                            <div className='col-sm-6 col-12 text-start'>
                                <p className={cls(MontserratExtraBold.className, 'my-sm-3')}>NOMBRE: <span className={MontserratSemiBold.className}>{usuario.NAME == null || usuario.NAME == undefined ? '' : usuario.NAME}</span></p>
                            </div>
                            <div className='col-sm-6 col-12 text-sm-end text-start'>
                                <p className={cls(MontserratExtraBold.className, 'my-sm-3')}>FECHA: <span className={MontserratSemiBold.className}>{currentDate}</span></p>
                            </div>
                        </div>

                        <div className='text-start my-5'>
                            <p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS Y OPORTUNIDADES – EJERCICIO INICIAL</p>
                            <table className={cls(styles.tables, "table table-striped")}>

                                <tbody>

                                    {listP.map((v, k) => {

                                        return (
                                            <tr>
                                                <td scope="row" key={k}>
                                                    <p>{v.dolencia}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>

                        <div className='text-start my-5'>
                            <p className={cls(MontserratExtraBold.className, '')}>SELECCIÓN CUESTIONARIO PROBLEMAS Y OPORTUNIDADES</p>
                            <table className={cls(styles.tables, "table table-striped")}>

                                <tbody>
                                    {listS.filter((word) => word.check == true).map((v, k) => {

                                        return (
                                            <tr>
                                                <td scope="row" key={k}>
                                                    <p>{v.dolencia}</p>
                                                </td>
                                            </tr>


                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>


                        <div className='text-start my-5'>
                            <p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS CAUSA</p>
                            <table className={cls(styles.tables, "table table-striped")}>

                                <tbody>

                                    {listP.filter((word) => word.categoria == "C").map((v, k) => {

                                        return (
                                            <tr>
                                                <td scope="row" key={k}>
                                                    <p>{v.dolencia}</p>

                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "C").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>{v.dolencia}</p>

                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start my-5'>
                            <p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS EFECTO</p>
                            <table className={cls(styles.tables, "table table-striped")}>

                                <tbody>

                                    {listP.filter((word) => word.categoria == "E").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>{v.dolencia}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "E").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} className="list-group-item text-start">
                                                    <p>{v.dolencia}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start my-4'>
                            <p className={cls(MontserratExtraBold.className, '')}>NO PROBLEMA</p>
                            <table className={cls(styles.tables, "table table-striped")}>

                                <tbody>

                                    {listP.filter((word) => word.categoria == "N").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>{v.dolencia}</p>

                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "N").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>{v.dolencia}</p>

                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className='text-start my-5'>
                            <p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS CAUSA MÁS RELEVANTES</p>
                            {listP.filter((word) => word.causaDeCausas == true).map((v, k) => {
                                return (
                                    <div key={k} className={cls(styles.card, "card border-secondary mb-3 text-start")} >
                                        <div className="card-header bg-light"><b>{v.dolencia}</b></div>
                                        <div className={cls(styles.c1, "card-body text-primary")}>
                                            <p className="card-text"><span className='text-dark'>Descripción: </span>{v.descripcion}</p>

                                        </div>
                                        <div className={cls(styles.c2, "card-body text-primary")}>

                                            <p><span className='text-dark'>Dimensión: </span>{v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>

                                        </div>
                                        <div className={cls(styles.c1, "card-body text-primary")}>

                                            <p><span className='text-dark'>Lastre: </span>{v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {listS.filter((word) => word.causaDeCausas == true).map((v, k) => {
                                let arr = []
                                if (v.preguntas == undefined) {
                                    for (let x in dol[v.key].preguntas) {
                                        arr.push(dol[v.key].preguntas[x])
                                    }
                                } else if (v.preguntas != undefined) {
                                    arr = v.preguntas
                                }
                                
                                return (
                                    <div key={k} className={cls(styles.card, "card border-secondary mb-3 text-start")} >
                                        <div className="card-header"><b>{v.dolencia}</b></div>
                                        <div className={cls(styles.c1, "card-body text-primary")}>
                                            <p className="card-text"><span className='text-dark'>Descripción: </span>{v.descripcion}</p>

                                        </div>
                                        <div className={cls(styles.c2, "card-body text-primary")}>

                                            <p><span className='text-dark'>Dimensión: </span>{v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>

                                        </div>
                                        <div className={cls(styles.c1, "card-body text-primary")}>

                                            <p><span className='text-dark'>Lastre: </span>{v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                        </div>
                                        
                                            
                                            <table className={cls(styles.tables, "table table-striped")}>
                                            <p className="card-text"><span className='text-dark'>Preguntas poderosas: </span></p>
                                                <tbody>
                                                    { 
                                                        arr.map((a, b) => {
                                                            return (
                                                                <tr>
                                                                    <td scope="row" key={b}>
                                                                        <p>{ a }</p>

                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>

                                        

                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <div className={cls(styles.textos, 'my-5')} id='pdf'>
                        <Image src={logo} alt='CEDEM' width={350} height={150} />
                        <div className='row justify-content-center align-items-center'>
                            
                            <p className={cls(styles.title, MontserratExtraBold.className)}>PROPUESTA <br />CONSULTORÍA EN DUEÑEZ Y CRECIMIENTO DE VALOR</p>
                            
                            <p className='mt-5'><b>PROYECTO:</b></p>
                            <div className={styles.select}>
                                <select className={cls("form-select")} onChange={addProyecto} aria-label="Default select example">
                                    <option value='' >Selecciona el proyecto</option>
                                    <option value='Fortalecimiento Competitivo'>1. Fortalecimiento Competitivo</option>
                                    <option value='Sinergia Organizacional'>2. Sinergia Organizacional</option>
                                    <option value='Rediseño de Fórmula de Negocio'>3. Rediseño de Fórmula de Negocio</option>
                                    <option value='Rediseño de Fórmula de Gobierno'>4. Rediseño de Fórmula de Gobierno</option>
                                    <option value='Alineación de Querencias'>5. Alineación de Querencias</option>
                                    <option value='Formación en Dueñez'>6. Formación en Dueñez</option>
                                </select>
                                <p className='text-start'>Proyecto: { proy }</p>

                            </div>

                            <p className='mt-5'><b>CONDICIONES ECONÓMICAS:</b></p>
                            <div className={styles.select}>
                                <select className={cls("form-select")} onChange={addCond} aria-label="Default select example">
                                    <option value='' >Selecciona la condición económica</option>
                                    <option value='USD$ 5,000 mensuales'>1. USD$ 5,000 mensuales</option>
                                    <option value='USD$ 5,500 mensuales'>2. USD$ 5,500 mensuales</option>
                                    <option value='USD$ 6,000 mensuales'>3. USD$ 6,000 mensuales</option>
                                    <option value='USD$ 6,500 mensuales'>4. USD$ 6,500 mensuales</option>
                                    <option value='USD$ 7,000 mensuales'>5. USD$ 7,000 mensuales</option>
                                    <option value='USD$ 7,500 mensuales'>6. USD$ 7,500 mensuales</option>
                                    <option value='USD$ 8,000 mensuales'>7. USD$ 8,000 mensuales</option>
                                </select>
                                <p className='text-start'>Condiciones económicas: { cond }</p>
                            </div>

                            <p className='mt-5'><b>DURACIÓN:</b></p>
                            <div className={styles.select}>
                                <select className={cls("form-select")} onChange={addDur} aria-label="Default select example">
                                    <option value='' >Selecciona la duración</option>
                                    <option value='12 Meses'>1. 12 Meses</option>
                                    <option value='15 Meses'>2. 15 Meses</option>
                                    <option value='18 Meses'>3. 18 Meses</option>
                                    <option value='24 Meses'>4. 24 Meses</option>
                                </select>
                                <p className='text-start'>Duración: { dur }</p>
                            </div>
                            
                            
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
