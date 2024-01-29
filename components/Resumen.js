import React, { useEffect, useState } from 'react'
import styles from '../styles/Resumen.module.css'
import cls from 'classnames'
import localFont from 'next/font/local'
import { db } from '../firebase/firebase'
import { useAuth } from '../context/authContext'
import { ref, child, get, set, update } from "firebase/database";
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Image from 'next/image'
import logo from '../public/assets/cedemLogo.png'


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

export default function Resumen({ action1 }) {

  const { currentUser } = useAuth()

  let [listS, setListS] = useState([])
  let [listP, setListP] = useState([])
  let [user, setUser] = useState({})

  let currentDate = new Date().toJSON().slice (0, 10)

  async function getList() {
    let newArray1 = []
    let newArray2 = []
    const dbRef = ref(db)

    const getName = await get(child(dbRef, currentUser.uid))
    if (getName.exists()) {
      setUser(getName.val())
    }

    const getDolenciasP = await get(child(dbRef, currentUser.uid + '/dolencias/listaP'))
    if (getDolenciasP.exists()) {
      for (let x in getDolenciasP.val()) {
        newArray1.push(getDolenciasP.val()[x])
      }
    }
    setListP(newArray1)

    const getDolenciasS = await get(child(dbRef, currentUser.uid + '/dolencias/Seleccion'))
    if (getDolenciasS.exists()) {
      for (let x in getDolenciasS.val()) {
        newArray2.push(getDolenciasS.val()[x])
      }
    }
    setListS(newArray2)
  }

  useEffect(() => {

    getList()

  }, [])

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
    await pdf.save(`${user.NAME}_Oportunidades_de_Crecimiento_${currentDate}.pdf`);
  };


  return (
    <div className={cls(MontserratSemiBold.className, styles.cont, 'py-3')} >
      <div className='row ' id='pdf'>
        <div className={cls(styles.main, '')}>
          <div>
            <Image src={logo} alt='CEDEM' className={cls(styles.logo, 'img-fluid')} width={150} height={80} />
          </div>
          <div>
            <p className={cls(MontserratExtraBold.className, 'text-center')}>
              Oportunidades y Problemas de Crecimiento
            </p>
          </div>

          <div className={cls('mb-4 text-start px-3')}>
            

            <table className={cls(styles.tables, "table table-striped")}>
            <thead>
              <tr>
                <th scope="col">Causas más Relevantes</th>
              </tr>
            </thead>
            <tbody>

            {listP.filter((word) => word.causaDeCausas == true).map((v, k) => {

              return (
                <tr>
                  <td scope="row" key={k}>
                    <p>{'Causa: ' + v.dolencia}</p>
                    <p>{'Descripción: ' + v.descripcion }</p>
                  </td>
                </tr>
                


              )
            })}
            

            {listS.filter((word) => word.causaDeCausas == true).map((v, k) => {

              return (
                <tr>
                  <td scope="row" key={k}>
                    <p>{'Causa: ' + v.dolencia}</p>
                    <p>{'Descripción: ' + v.descripcion }</p>
                </td>
                </tr>

              )
            })}
            </tbody>
            </table>

          </div>

          <div className={cls('mb-4 px-3 text-start')}>
            
            <table className={cls(styles.tables, "table table-striped")}>
            <thead>
              <tr>
                <th scope="col">Efectos</th>
              </tr>
            </thead>
            <tbody>
              {listP.filter((word) => word.categoria == "E").map((v, k) => {

                return (
                  <tr>
                    <td scope="row" key={k}>
                      <p>{v.dolencia}</p>
                    </td>
                  </tr>

                )
              })}
              {listS.filter((word) => word.categoria == "E").map((v, k) => {

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

          <div className={cls('mb-4 px-3 text-start')}>

            <table className={cls(styles.tables, "table table-striped")}>
            <thead>
              <tr>
                <th scope="col">No Problemas</th>
              </tr>
            </thead>
            <tbody>

              {listP.filter((word) => word.categoria == "N").map((v, k) => {

                return (
                  <tr>
                    <td scope="row" key={k}>
                      <p>{v.dolencia}</p>
                    </td>
                  </tr>

                )
              })}
              {listS.filter((word) => word.categoria == "N").map((v, k) => {

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

        </div>
      </div>

      <div className={cls('my-3 d-flex d-flex-column justify-content-center gap-3 px-2')}>
        <button type="button" onClick={action1} className="btn btn-info">Volver al inicio</button>
        <button type="button" onClick={createPDF} className="btn btn-info" >Imprimir PDF</button>
      </div>
    </div>
  )
}
