'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Login from '../../components/Login'
import { useAuth } from '../../context/authContext'
import React, { useEffect, useState } from 'react'
import Navbars from '../../components/Navbar'
import Navbar2 from '../../components/Navbar2'
import Dashboard from '../../components/Dashboard'
import Ejercicio1 from '../../components/Ejercicio1'
import Ejercicio2 from '../../components/Ejercicio2'

import Ejercicio3a from '../../components/Ejercicio3a'

import Ejercicio3 from '../../components/Ejercicio3'
import Ejercicio4 from '../../components/Ejercicio4'
import Ejercicio5 from '../../components/Ejercicio5'
import Ejercicio6 from '../../components/Ejercicio6'
import Resumen from '../../components/Resumen'
import OwnerDashboard from '../../components/OwnerDashboard'
import { db } from '../../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";
import Preguntas from '../../components/Preguntas'

export default function Home() {

  const [menu, setMenu] = useState(0)
  const [data, setData] = useState({})
  const { logout, currentUser } = useAuth()

  async function getList () {
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid))
    if (getDolenciasP.exists()) {
      setData(getDolenciasP.val())
    }
  }

  const logingOut = async () => {
    logout()
    setMenu(0)
  }

  useEffect(() => {
    if (currentUser){
      getList()
      
    }

  }, [currentUser])

  return (
    <React.Fragment>
      {currentUser &&<Navbar2 opcion1={() => setMenu(0)} opcion3={() => setMenu('preguntas')} user={data.NIVEL} opcion2={() => setMenu('owner')} Logout={logingOut} />}
      {!currentUser &&<Login />}
      {currentUser && menu == 'owner' &&<OwnerDashboard action={() => setMenu(1)} />}
      {currentUser && menu == 'preguntas' &&<Preguntas />}
      {currentUser && menu == 0 &&<Dashboard action={() => setMenu(1)} />}
      {currentUser && menu == 1 && <Ejercicio1 action={() => setMenu(0)} action2={() => setMenu(2)}/>}
      {currentUser && menu == 2 && <Ejercicio2 action={() => setMenu(1)} action2={() => setMenu(3.5)}/>}
      
      {currentUser && menu == 3.5 && <Ejercicio3a action={() => setMenu(2)} action2={() => setMenu(3)}/>}
      
      {currentUser && menu == 3 && <Ejercicio3 action={() => setMenu(2)} action2={() => setMenu(4)}/>}
      {currentUser && menu == 4 && <Ejercicio4 action={() => setMenu(3)} action2={() => setMenu(5)}/>}
      {currentUser && menu == 5 && <Ejercicio5 action={() => setMenu(4)} action2={() => setMenu(6)}/>}
      {currentUser && menu == 6 && <Ejercicio6 action={() => setMenu(5)} action2={() => setMenu(7)}/>}
      {currentUser && menu == 7 && <Resumen action1={() => setMenu(0)}  />}
    </React.Fragment>
  )
}
