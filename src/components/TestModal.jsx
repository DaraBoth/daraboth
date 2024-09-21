// src/components/TestModal.jsx

import React, { useState } from "react";
import Modal from "./Modal";

const TestModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const confirmAction = () => {
    console.log("Confirmed!");
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title="Test Modal"
        message="This is a test modal."
      />
    </div>
  );
};

export default TestModal;
