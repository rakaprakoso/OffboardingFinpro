import React, { useState } from 'react'
import Modal from 'react-modal';
import { AiOutlineLoading3Quarters, AiOutlineCloseCircle, AiOutlineCheck } from "react-icons/ai";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const SubmitResignModal = ({ openModal, submitted, stateChanger }) => {
    function closeModal() {
        stateChanger(false)
        window.location.reload();
    }
    return (
        <>
            <Modal
                isOpen={openModal}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
            >
                {!submitted ?
                    <LoadingResignSubmit /> : <ResignSubmitted closeModal={closeModal} />
                }
            </Modal>
        </>
    )
}

const LoadingResignSubmit = () => {
    return (
        <>
            <div className="flex flex-col items-center p-8">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-4" />
                Loading
            </div>
        </>
    )
}
const ResignSubmitted = ({ closeModal }) => {
    return (
        <>
            <button className="flex ml-auto text-2xl text-red-700" onClick={closeModal}><AiOutlineCloseCircle /></button>
            <div className="flex flex-col items-center p-8">
                <AiOutlineCheck className="text-4xl mb-4 text-green-700" />
                Submitted
            </div>
        </>
    )
}

export default SubmitResignModal
