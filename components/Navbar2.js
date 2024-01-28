import React, { useState } from 'react'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image';
import logo from '../public/assets/cedemLogo.png'
import cls from 'classnames'
import { useAuth } from '../context/authContext'

export default function Navbar2({ opcion1, user, opcion2 }) {

    const { logout, currentUser } = useAuth()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //photoURL para imagen

    return (
        <>
            <nav className="navbar bg-body-primary bg-secondary">
                <div className="container-fluid text-start">
                    <a className="navbar-brand" href="/"> <Image src={logo} className={cls('img-fluid')} alt='Consultoría de Dueños' width={150} height={50} /> </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel"><Image src={logo} className={cls('img-fluid')} alt='Consultoría de Dueños' width={100} height={50} /></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            
                                <li className="nav-item mb-1">
                                    <button className='text-start btn' data-bs-dismiss="offcanvas" onClick={opcion1}>
                                        Problemas y Oportunidades de Crecimiento
                                    </button>
                                </li>
                                <li className="nav-item mb-1">
                                    {user == 'admin' ? (

                                        <button className='text-start btn' data-bs-dismiss="offcanvas" onClick={opcion2}>
                                            Admin. Dashboard
                                        </button>

                                    ) :
                                        (<div></div>)
                                    }
                                </li>
                                <li className="nav-item mb-1">
                                    <button className='text-start btn' onClick={logout}>
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    )
}
