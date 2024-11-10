import { Modal, Button } from "react-bootstrap";

export const SuccessModal = ({ show, message, onClose }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Success</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="btn btn-outline-primary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);
