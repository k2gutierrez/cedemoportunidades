'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function Recover() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function recover () {
        const auth = getAuth()
        if (email == ""){
            setMessage("No registraste ningun email")
            return
        } else {
            try {
                let recover = await sendPasswordResetEmail(auth, email)

                setMessage("Se ha enviado un email para reestabler la contraseña!")

            } catch (error){
                setMessage(error)
            }
        }
        
    }


  return (
    <>
      <a  onClick={handleShow}>
        ¿Olvidaste tu contraseña? Click aquí
      </a>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Ingresa el correo para recuperar la contraseña:
            <input type="email" class="form-control" id="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)}/>
            <div className='mt-2'>
                <p>{message}</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={recover}>
            Recuperar
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Recover;