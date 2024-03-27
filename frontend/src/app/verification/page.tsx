import { Button, Link } from "@nextui-org/react"


export default function VerificationPage({searchParams}) {
    const success = searchParams.success


    return (
        <main className="flex flex-col">
            <div className="flex max-w-[1024px] w-full p-8 justify-center items-center">
            { success == 'true' ?
            <div className="flex flex-col gap-4">
            <h2 className="text-xl text-success">Your account has been verified.</h2>
            <Button as={Link} href="/dashboard" variant="flat" color="primary" aria-label="Back to dashboard">Back to dashboard</Button>
            </div>
            :
            <div className="flex flex-col gap-4">
            <h2 className="text-danger text-xl">Email verification failed.</h2>
            <Button variant="flat" color="primary" aria-label="Resend verification email">Resend verification email</Button>
            </div>
            }
            </div>
        </main>
    )
}