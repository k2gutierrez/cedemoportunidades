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
    const [completeList, setCompleteList] = useState([])
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
        let arrComplete = []
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
                arrComplete.push(getDolenciasP.val()[x])
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
                arrComplete.push(getDolenciasS.val()[x])
                console.log(arrComplete)
            }
            setListS(arr2)
            setCompleteList(arrComplete)
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
                            {/*<p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS Y OPORTUNIDADES – EJERCICIO INICIAL</p>*/}
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">PROBLEMAS Y OPORTUNIDADES – EJERCICIO INICIAL</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>

                                    {listP.map((v, k) => {

                                        return (
                                            <tr>
                                                <th scope="row" key={k}>
                                                    {k+1}
                                                </th>
                                                <td>{v.dolencia}</td>
                                            </tr>

                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>

                        <div className='text-start my-5'>
                            {/*<p className={cls(MontserratExtraBold.className, '')}>SELECCIÓN CUESTIONARIO PROBLEMAS Y OPORTUNIDADES</p>*/}
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">SELECCIÓN CUESTIONARIO PROBLEMAS Y OPORTUNIDADES</th>
                                    </tr>
                                </thead>
                                <tbody  className='table-group-divider'>
                                    {listS.filter((word) => word.check == true).map((v, k) => {

                                        return (
                                            <tr>
                                                <th scope="row" key={k}>
                                                    {k+1}
                                                </th>
                                                <td>
                                                    {v.dolencia}
                                                </td>
                                            </tr>


                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>


                        <div className='text-start my-5'>
                            {/*<p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS CAUSA</p>*/}
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">PROBLEMAS CAUSA</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>

                                    {completeList.filter((word) => word.categoria == "C").map((v, k) => {

                                        return (
                                            <tr>
                                                <th scope="row" key={k}>
                                                    {k+1}
                                                </th>
                                                <td>
                                                    {v.dolencia}
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start my-5'>
                            {/*<p className={cls(MontserratExtraBold.className, '')}>PROBLEMAS EFECTO</p>*/}
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">PROBLEMAS EFECTO</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>

                                    {completeList.filter((word) => word.categoria == "E").map((v, k) => {

                                        return (
                                            <tr>
                                                <th scope="row" key={k}>
                                                    {k+1}
                                                </th>
                                                <td>
                                                    {v.dolencia}
                                                </td>
                                            </tr>

                                        )
                                    })}
                                    
                                </tbody>
                            </table>

                        </div>

                        <div className='text-start my-4'>
                        {/*<p className={cls(MontserratExtraBold.className, '')}>NO PROBLEMA</p>*/}
                            <table className={cls(styles.tables, "table table-striped")}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">NO PROBLEMA</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>

                                    {completeList.filter((word) => word.categoria == "N").map((v, k) => {

                                        return (
                                            <tr>
                                                <th scope="row" key={k}>
                                                    {k+1}
                                                </th>
                                                <td key={k} >
                                                    {v.dolencia}
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

                                            { v.lastre == undefined || v.lastre == null ? ('N/A') : 
                                            
                                            (
                                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                            <p className='text-dark'>Lastre: { v.lastre }</p>
                                                        </button>
                                                        </h2>
                                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                                            <div className="accordion-body">
                                                                {v.lastre == 'Desenfoque' ? (
                                                                <>
                                                                    <p>En nuestro afán por crecer, acumulamos recursos y aprovechamos oportunidades que nos llevan a diversificar negocios, productos y mercados sin fin. El empresario ambicioso pronto se enfrenta a la realidad de querer abarcar más de lo que puede manejar.</p>
                                                                    <p>Al consolidar globalmente nuestros negocios, productos y mercados, perdemos de vista las condiciones únicas de cada uno. Esto impide abordar a cada negocio como si fuera el único, atender a cada mercado de forma original y diferenciada, ya que los procesos se aglutinan y las prácticas comerciales se contaminan, debilitándonos frente a los especialistas.</p>
                                                                    <p>Una atención desenfocada al mercado no genera valor y empobrece la competitividad de nuestra oferta. Nada puede sustituir el liderazgo competitivo en la creación de valor.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Soledad' ? (
                                                                <>
                                                                    <p>El crecimiento empresarial dificulta desarrollar el equipo humano necesario en cada etapa. Tener personas capacitadas y comprometidas es esencial para crecer, pero muchos empresarios carecen de un equipo bien integrado, lo cual frena su avance.</p>
                                                                    <p>A pesar de usar herramientas de Recursos Humanos como selección, capacitación, sistemas de remuneración, etc., muchos empresarios terminan dirigiendo solos durante años. Esta soledad persiste mientras no se aprende a compartir y delegar el poder, formando un equipo directivo complementario y compatible que sustente el crecimiento con efectividad.</p>
                                                                    <p>El mayor costo de este aprendizaje es que, al crecer la organización, se exige un mejor desempeño en la gestión de la creación de valor, un rol que a menudo se descuida por centrarse en tareas operativas.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Tolerancia' ? (
                                                                <>
                                                                    <p>Este reto del crecimiento está estrechamente ligado al éxito. Muchas compañías que han alcanzado el triunfo rápidamente adquieren el "cáncer de la tolerancia", manifestado en actitudes y comportamientos organizacionales relacionados con el manejo de recursos, procesos, oportunidades y resultados.</p>
                                                                    <p>En su gloria, la empresa exitosa se duerme en sus laureles, se ciega y cae en vicios y omisiones no evaluadas debido a los logros obtenidos. La tolerancia propicia escondites de improductividad por falta de austeridad, alineación y exigencia, permitiendo que el valor generado se pierda en lugar de capturarlo.</p>
                                                                    <p>La organización tolerante se aburguesa, despilfarra y pierde su espíritu de lucha, dejando pasar oportunidades y desestimando el valor de la exigencia. Nadie se preocupa por esto.</p>
                                                                    <p>Solo cuando nos exigimos un desempeño creciente podemos vencer la tolerancia. Esto requiere una estructura con alto compromiso, una cultura de optimización incansable y un liderazgo enfocado en el alto rendimiento.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Inercia' ? (
                                                                <>
                                                                    <p>Crecer ya no consiste en multiplicar más de lo mismo; en cada etapa debemos identificar las oportunidades actuales. Al expandir nuestras operaciones, es fundamental asegurar que estamos construyendo sobre bases sólidas.</p>
                                                                    <p>Hoy, la solidez se define por nuevos paradigmas. Antes significaba terrenos propios, instalaciones grandes, muchos clientes, diversidad de productos e integración de procesos. Ahora, implica flexibilidad, rapidez de cambio, capacidad de aprendizaje, velocidad en el desarrollo de productos y facilidad para desinvertir.</p>
                                                                    <p>La inercia nos ata a recursos y oportunidades del pasado, limitando nuestra evolución, mermando nuestra proactividad y aumentando los costos de oportunidad.</p>
                                                                    <p>El lastre de la inercia describe la resistencia al cambio dentro de las organizaciones. Esta resistencia, que puede ser tanto consciente como inconsciente, se manifiesta en la preferencia por mantener el statu quo, una burocracia excesiva y una falta de agilidad para responder a nuevas oportunidades y desafíos del mercado.</p>
                                                                </>
                                                                ): ('')}
                                                            </div>
                                                        </div>
                                                    </div>    
                                                </div>
                                            )       
                                            }

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

                                            { v.lastre == undefined || v.lastre == null ? ('N/A') : 
                                            
                                            (
                                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                            <p className='text-dark'>Lastre: { v.lastre }</p>
                                                        </button>
                                                        </h2>
                                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                                            <div className="accordion-body">
                                                                {v.lastre == 'Desenfoque' ? (
                                                                <>
                                                                    <p>En nuestro afán por crecer, acumulamos recursos y aprovechamos oportunidades que nos llevan a diversificar negocios, productos y mercados sin fin. El empresario ambicioso pronto se enfrenta a la realidad de querer abarcar más de lo que puede manejar.</p>
                                                                    <p>Al consolidar globalmente nuestros negocios, productos y mercados, perdemos de vista las condiciones únicas de cada uno. Esto impide abordar a cada negocio como si fuera el único, atender a cada mercado de forma original y diferenciada, ya que los procesos se aglutinan y las prácticas comerciales se contaminan, debilitándonos frente a los especialistas.</p>
                                                                    <p>Una atención desenfocada al mercado no genera valor y empobrece la competitividad de nuestra oferta. Nada puede sustituir el liderazgo competitivo en la creación de valor.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Soledad' ? (
                                                                <>
                                                                    <p>El crecimiento empresarial dificulta desarrollar el equipo humano necesario en cada etapa. Tener personas capacitadas y comprometidas es esencial para crecer, pero muchos empresarios carecen de un equipo bien integrado, lo cual frena su avance.</p>
                                                                    <p>A pesar de usar herramientas de Recursos Humanos como selección, capacitación, sistemas de remuneración, etc., muchos empresarios terminan dirigiendo solos durante años. Esta soledad persiste mientras no se aprende a compartir y delegar el poder, formando un equipo directivo complementario y compatible que sustente el crecimiento con efectividad.</p>
                                                                    <p>El mayor costo de este aprendizaje es que, al crecer la organización, se exige un mejor desempeño en la gestión de la creación de valor, un rol que a menudo se descuida por centrarse en tareas operativas.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Tolerancia' ? (
                                                                <>
                                                                    <p>Este reto del crecimiento está estrechamente ligado al éxito. Muchas compañías que han alcanzado el triunfo rápidamente adquieren el "cáncer de la tolerancia", manifestado en actitudes y comportamientos organizacionales relacionados con el manejo de recursos, procesos, oportunidades y resultados.</p>
                                                                    <p>En su gloria, la empresa exitosa se duerme en sus laureles, se ciega y cae en vicios y omisiones no evaluadas debido a los logros obtenidos. La tolerancia propicia escondites de improductividad por falta de austeridad, alineación y exigencia, permitiendo que el valor generado se pierda en lugar de capturarlo.</p>
                                                                    <p>La organización tolerante se aburguesa, despilfarra y pierde su espíritu de lucha, dejando pasar oportunidades y desestimando el valor de la exigencia. Nadie se preocupa por esto.</p>
                                                                    <p>Solo cuando nos exigimos un desempeño creciente podemos vencer la tolerancia. Esto requiere una estructura con alto compromiso, una cultura de optimización incansable y un liderazgo enfocado en el alto rendimiento.</p>
                                                                </>
                                                                ): ('')}
                                                                {v.lastre == 'Inercia' ? (
                                                                <>
                                                                    <p>Crecer ya no consiste en multiplicar más de lo mismo; en cada etapa debemos identificar las oportunidades actuales. Al expandir nuestras operaciones, es fundamental asegurar que estamos construyendo sobre bases sólidas.</p>
                                                                    <p>Hoy, la solidez se define por nuevos paradigmas. Antes significaba terrenos propios, instalaciones grandes, muchos clientes, diversidad de productos e integración de procesos. Ahora, implica flexibilidad, rapidez de cambio, capacidad de aprendizaje, velocidad en el desarrollo de productos y facilidad para desinvertir.</p>
                                                                    <p>La inercia nos ata a recursos y oportunidades del pasado, limitando nuestra evolución, mermando nuestra proactividad y aumentando los costos de oportunidad.</p>
                                                                    <p>El lastre de la inercia describe la resistencia al cambio dentro de las organizaciones. Esta resistencia, que puede ser tanto consciente como inconsciente, se manifiesta en la preferencia por mantener el statu quo, una burocracia excesiva y una falta de agilidad para responder a nuevas oportunidades y desafíos del mercado.</p>
                                                                </>
                                                                ): ('')}
                                                            </div>
                                                        </div>
                                                    </div>    
                                                </div>
                                            )       
                                            }

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
                    {/*<div className={cls(styles.textos, 'my-5')} id='pdf'>
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

                    </div>*/}

                </div>
            </div>
        </div>
    )
}
