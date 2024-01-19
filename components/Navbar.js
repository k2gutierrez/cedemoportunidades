import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Image from 'next/image';
import logo from '../public/assets/cdD.png'
import cls from 'classnames'
import { useAuth } from '../context/authContext'

export default function Navbars() {

    const { logout, currentUser } = useAuth()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //photoURL para imagen

    return (
    <>
        <Navbar expand={false} className="bg-light">
            <Container fluid>
                <Button variant="transparent" onClick={handleShow}>
                    <Image src={logo} className={cls('img-fluid')} alt='Consultoría de Dueños' width={50} height={50} /> Consultoría de Dueños
                </Button>
            </Container>
        </Navbar>
        

        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title><Image src={logo} className={cls('img-fluid')} alt='Consultoría de Dueños' width={50} height={50} /></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Button variant="transparent" onClick={logout}>
                    Log Out
                </Button>
            </Offcanvas.Body>
        </Offcanvas>
    </>
    )
}
