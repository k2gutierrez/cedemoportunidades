'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/OwnerDashboard.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
    const [usuario, setUsuario] =useState({})
    let currentDate = new Date().toJSON().slice (0, 10)

    async function getList () {
        let arr1 = []
        let arr2 = []
        const dbRef = ref(db)

        const usuario = await get(child(dbRef, idUser))
        if (usuario.exists()) {
            
            setUsuario(usuario.val())
        }

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

    const createPDF = async () => {
        /*const pdf = new jsPDF('p','mm',[297, 210]);*/
        const pdf = new jsPDF("portrait", "mm", "letter");
        const data = document.getElementById('pdf');
        const d = await html2canvas(data);
        const img = d.toDataURL("image/png");
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        await pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        await pdf.save(`${usuario.NAME}_Oportunidades_de_Crecimiento_${currentDate}.pdf`);
      };

    return (
        <div className={cls(MontserratSemiBold.className, styles.cont, 'p-3')}>

            <div className='row justify-content-center align-items-center'>
                <div className={cls(styles.box, 'row justify-content-center align-items-center')}>
                    <div className={cls(styles.main, styles.text, '')}>
                        <p className={cls(styles.title, MontserratExtraBold.className)}>Oportunidades y Problemas de Crecimiento</p>
                    </div>
                    <div className={cls(styles.subtitle, styles.select, 'mb-3')}>
                        <select className="form-select" onChange={(e) => setId(e.target.value)} aria-label="Default select example">
                            <option value={''} >Selecciona al Usuario</option>
                            {users.filter((word) => word.NIVEL == "user").map((v, k) => {
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

                    <div id='pdf'>
                        <p className={cls(MontserratExtraBold.className, 'my-3')}>{usuario.NAME == null ? '' : usuario.NAME}</p>
                        <div className='text-start mb-3'>
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={MontserratExtraBold.className}>Problemas y oportunidades personales</th>
                                    </tr>
                                </thead>
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

                        <div className='text-start mb-3'>
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={MontserratExtraBold.className}>Problemas y oportunidades seleccionados</th>
                                    </tr>
                                </thead>
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


                        <div className='text-start mb-3'>
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={MontserratExtraBold.className}>Causas</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {listP.filter((word) => word.categoria == "C").map((v, k) => {

                                        return (
                                            <tr>
                                                <td scope="row" key={k}>
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "C").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start mb-3'>
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={MontserratExtraBold.className}>Efectos</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {listP.filter((word) => word.categoria == "E").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Efecto personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "E").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} className="list-group-item text-start">
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Efecto personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start mb-3'>
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={MontserratExtraBold.className}>No Problemas</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {listP.filter((word) => word.categoria == "N").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'NP personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    {listS.filter((word) => word.categoria == "N").map((v, k) => {

                                        return (
                                            <tr>
                                                <td key={k} >
                                                    <p>Dolencia: {v.dolencia}</p>
                                                    <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'NP personal' : v.dimension}</p>
                                                    <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                                </td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <p className={MontserratExtraBold.className}>Causas de Causas</p>
                            {listP.filter((word) => word.causaDeCausas == true).map((v, k) => {
                                return (
                                    <div key={k} className={cls(styles.card, "card border-primary mb-3 text-start")} >
                                        <div className="card-header">{v.dolencia}</div>
                                        <div className="card-body text-primary">
                                            <p className="card-text">{'Descripción: ' + v.descripcion}</p>
                                            <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>
                                            <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {listS.filter((word) => word.causaDeCausas == true).map((v, k) => {
                                return (
                                    <div key={k} className={cls(styles.card, "card border-primary mb-3 text-start")} >
                                        <div className="card-header">{v.dolencia}</div>
                                        <div className="card-body text-primary">
                                            <p className="card-text">{'Descripción' + v.descripcion}</p>
                                            <p>Dimensión: {v.dimension == undefined || v.dimension == null ? 'Causa personal' : v.dimension}</p>
                                            <p>Lastre: {v.lastre == undefined || v.lastre == null ? 'N/A' : v.lastre}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>

                </div>
            </div>
            <div className={cls('my-3 justify-content-center px-2')}>
                <button type="button" onClick={createPDF} className="btn btn-info" >Imprimir PDF</button>
            </div>
        </div>
    )
}
