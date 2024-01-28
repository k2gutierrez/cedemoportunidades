import React, { useState } from 'react'
import styles from '../styles/Navbar.module.css'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'next/image';
import logo from '../public/assets/cedemLogo.png'
import cls from 'classnames'
import { useAuth } from '../context/authContext'

export default function Navbars({ opcion1, user, opcion2 }) {

    const { logout, currentUser } = useAuth()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //photoURL para imagen

    return (
    <>

        <Navbar collapseOnSelect expand="lg" bg='secondary' className="bg-body-primary" data-bs-theme="dark" >
            <Container fluid>
            <Navbar.Brand href="/"><Image src={logo} className={cls(styles.logo,'img-fluid')} alt='Consultoría de Dueños' width={150} height={50} /> </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto align-items-center">
                    {user == 'admin' ? (
                        <Button className='text-start' variant="transparent" onClick={opcion2}>
                            Admin. Dashboard
                        </Button>
                    ) :
                        (<div></div>)
                    }
                    
                    <Button className='text-start' variant="transparent" onClick={opcion1}>
                        Problemas y Oportunidades de Crecimiento
                    </Button>
                </Nav>
                <Nav>
                    <Button variant="transparent" onClick={logout}>
                        Log Out
                    </Button>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
    )
}
