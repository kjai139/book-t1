'use client'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";


interface ErrorMsgModalProps {
    message: string,
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>
}

export default function ErrorMsgModal ({message, setErrorMsg}:ErrorMsgModalProps) {


    const closeModal = () => {
        setErrorMsg('')
    }

    return (
        <>
            <Modal isOpen={true} hideCloseButton>
                <ModalContent>
                    {
                        (onClose) => (
                            <>
                            <ModalHeader>
                                Notification
                            </ModalHeader>
                            <ModalBody>
                                <span>
                                {message}
                                </span>
                            </ModalBody>
                            <ModalFooter>
                                <Button aria-label="Close Error Notification" onPress={closeModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </>
       /*  <div className="overlay-t">
            <div>
                <span>
                    {message}
                </span>
                <Button onPress={closeModal}>
                    Close
                </Button>

            </div>

        </div> */
    )
}