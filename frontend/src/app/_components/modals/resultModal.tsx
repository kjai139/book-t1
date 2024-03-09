import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button} from "@nextui-org/react";
import { useRouter } from "next/navigation";


interface resultModalProps {
    isOpen: boolean,
    message: string,
    title: string,
    redirectUrl: string,
    actionName: string,
    handleClose: () => void
}

export default function ResultModal({isOpen, message, title, handleClose, actionName, redirectUrl}:resultModalProps) {

    const router = useRouter()

    return (
        <>
        <Modal isOpen={isOpen} onOpenChange={handleClose}>
        <ModalContent>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => router.push(redirectUrl)}>
                  {actionName}
                </Button>
              </ModalFooter>
          
        </ModalContent>
      </Modal>
        </>
    )

}