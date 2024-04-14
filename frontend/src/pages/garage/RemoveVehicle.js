import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {Alert} from "react-bootstrap";
import {useEffect, useState} from "react";

function RemoveVehicle(props) {
    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = (e) => {
        e.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "config_id": props.configId
        });

        const reqOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("/api/delete-user-vehicle", reqOptions)
            .then((response) => response.text())
            .then((result) => {
                window.location.reload();
            })
            .catch((error) => console.error(error));

        handleClose();
    };

    return (
        <>
            <Button variant="outline-danger" onClick={handleShow}>Remove</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={'text-justify-center'}>
                        <Alert key={'danger'} variant={'danger'} className={'text-justify'}>Deletion is irreversible.</Alert>
                    </Modal.Body>
                    <Modal.Footer className={'mx-auto'}>
                        <Button variant="secondary" onClick={handleClose}>No, take me back.</Button>
                        <Button variant={"danger"} onClick={handleDelete}>Remove Vehicle.</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </>
    )
}

    export default RemoveVehicle;