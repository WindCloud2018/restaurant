import React from 'react';
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import InventoryForm from './InventoryForm';
import '../css/ModalForm.css';

const ModalForm = props => {
  return (
    <div>
      <Modal
        isOpen={props.modal}
        toggle={() => {
          props.toggle()
        }}
        className={props.className}
      >
        <ModalHeader>
          Add Inventory
        </ModalHeader>

        <ModalBody>
          <InventoryForm {...props} />
        </ModalBody>

      </Modal>
    </div>
  );
}


export default ModalForm;
