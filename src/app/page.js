'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Login from '../../components/Login'
import { useAuth } from '../../context/authContext'
import { useEffect, useState } from 'react'
import Navbars from '../../components/Navbar'
import Dashboard from '../../components/Dashboard'
import Ejercicio1 from '../../components/Ejercicio1'
import Ejercicio2 from '../../components/Ejercicio2'
import Ejercicio3 from '../../components/Ejercicio3'
import Ejercicio4 from '../../components/Ejercicio4'
import Ejercicio5 from '../../components/Ejercicio5'
import Ejercicio6 from '../../components/Ejercicio6'
import Resumen from '../../components/Resumen'
import { db } from '../firebase/firebase'
import { ref, child, get, set, update } from "firebase/database";

export default function Home() {

  const [menu, setMenu] = useState(0)
  const [data, setData] = useState({})
  const { currentUser } = useAuth()

  async function getList () {
    let newArray = []
    const dbRef = ref(db)
    const getDolenciasP = await get(child(dbRef, currentUser.uid))
    if (getDolenciasP.exists()) {
      setData(getDolenciasP)
    }
  }

  useEffect(() => {

    getList()

    if (data.NIVEL == 'user' || data.NIVEL == undefined || data.NIVEL == null){
      return
    } else if (data.NIVEL == 'admin') {
      setMenu('owner')
    }

  }, [data])

  return (
    <main>
      {currentUser &&<Navbars opcion1={() => setMenu(0)} user={data.NIVEL} />}
      {!currentUser &&<Login />}
      {currentUser && menu == 'owner' &&<OwnerDashboard action={() => setMenu(1)} />}
      {currentUser && menu == 0 &&<Dashboard action={() => setMenu(1)} />}
      {currentUser && menu == 1 && <Ejercicio1 action={() => setMenu(0)} action2={() => setMenu(2)}/>}
      {currentUser && menu == 2 && <Ejercicio2 action={() => setMenu(1)} action2={() => setMenu(3)}/>}
      {currentUser && menu == 3 && <Ejercicio3 action={() => setMenu(2)} action2={() => setMenu(4)}/>}
      {currentUser && menu == 4 && <Ejercicio4 action={() => setMenu(3)} action2={() => setMenu(5)}/>}
      {currentUser && menu == 5 && <Ejercicio5 action={() => setMenu(4)} action2={() => setMenu(6)}/>}
      {currentUser && menu == 6 && <Ejercicio6 action={() => setMenu(5)} action2={() => setMenu(7)}/>}
      {currentUser && menu == 7 && <Resumen action={() => setMenu(6)} />}
    </main>
  )
}
