'use client'
import React, { use, useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import styles from '../styles/Preguntas.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";
import logo from '../public/assets/cedemLogo.png'
import Image from 'next/image'
import { Span } from 'next/dist/trace'

export default function Preguntas() {

    const [dol, setDol] = useState([])
    const [llave, setLlave] = useState(null)
    const [pregunta, setPregunta] = useState('')
    let [arrP, setArrP] = useState([])

    async function getDol () {
        let newArray = []
        const dbRef = ref(db)
    
        const getDolencias = await get(child(dbRef, 'dolencias'))
        if (getDolencias.exists()) {
        for (let x in getDolencias.val()) {
            newArray.push(getDolencias.val()[x])
        }
        setDol(newArray)
        }
        
    }

    async function getP () {
        let newArray = []
        const dbRef = ref(db)
    
        const getDolencias = await get(child(dbRef, `dolencias/${llave}/preguntas`))
        if (getDolencias.exists()) {
        for (let x in getDolencias.val()) {
            newArray.push(getDolencias.val()[x])
        }
        setArrP(newArray)
        }
        
    }

    async function addQ () {
        if (pregunta != ''){
            await arrP.push(pregunta)
            const adding = await update(ref(db, `dolencias/${llave}`), {
                preguntas: arrP
            })
            setPregunta('')
        }
        
    }

    useEffect(() => {

        getDol()

        if (llave != null){
            setArrP([])
            getP()
        }

    }, [llave])

    return (

        <div>
            <div className={cls(styles.subtitle, styles.select, 'row align-items-center text-center  my-5')}>
            <div className='justify-content-center align-self-center ms-5'>

            <select className="form-select" onChange={(e) => setLlave(e.target.value)} aria-label="Default select example">
                <option value={''} >Selecciona la dolencia</option>
                {dol.map((v, k) => {
                    return (
                        <option key={k} value={k}>{v.dolencia}</option>
                    )
                })
                }

            </select>
            {llave != null &&
                <div className="p-1 my-5">

                    <ul class="list-group">
                        {arrP.map((v, k) => {
                            return (
                                <li key={k} class="list-group-item">{v}</li>
                            )
                        })

                        }
                        
                    
                    </ul>

                    <textarea type="text" className={cls(styles.inputs, "form-control my-5")} rows='5' onChange={(e) => setPregunta(e.target.value)} value={pregunta}  />

                    <button type="button" onClick={addQ} className="btn btn-primary">Guardar</button>

                </div>
            }

            </div>
        </div>
        </div>

  )
}
