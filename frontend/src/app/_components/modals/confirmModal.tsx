import { Modal, ModalBody, ModalFooter, ModalHeader, Button, ModalContent, useDisclosure } from "@nextui-org/react"
import { SetStateAction, useEffect } from "react"

interface ConfirmModalProps {
    msg:string,
    setMsg: React.Dispatch<SetStateAction<string>>,
    func: () => void
}

export default function ConfirmModal({msg, setMsg, func}:ConfirmModalProps) {
    const { isOpen, onOpen, onOpenChange, onClose} = useDisclosure()

    const closeModal = () => {
        setMsg('')
    }

    useEffect(() => {
        if (msg) {
            onOpen()
        }
    }, [])

    const handleOpenChange = () => {

        if (isOpen) {
            onClose()
            setMsg('')
        }
    }

    const handleFunc = () => {
        func()
        onClose()
        setMsg('')
    }

    
    return (
        <Modal disableAnimation isOpen={isOpen} onOpenChange={handleOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                        <ModalBody>
                            <span className="p-4">
                                {msg}
                            </span>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={handleFunc}>
                                Yes
                            </Button>
                            <Button onPress={closeModal}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </>
                    )
                }
            
            </ModalContent>

        </Modal>
    )

}