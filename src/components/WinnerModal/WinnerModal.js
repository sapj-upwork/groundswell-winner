import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./WinnerModal.css";

function WinnerModal(props) {
  const [show, setShow] = React.useState(true);
  const handleClose = () => setShow(false);

  return (
    <Modal
      {...props}
      size="lg"
      show={show}
      backdrop={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="ps-5 pe-5 pb-5">
        <h4 className="wm-win-text mb-0">Congratulations</h4>
        <div className="text-center ps-4 pe-4 mb-2">
          {props.name}
          <span>!</span>
        </div>
        <h4 className="text-center wm-win-text">You'll receive</h4>
        <div className="text-center mb-2">
          <span>{props.amount}</span>
        </div>
        <h4 className="text-center wm-win-text">
          As a gift in your Groundswell account
        </h4>
      </Modal.Body>
    </Modal>
  );
}

export default WinnerModal;
