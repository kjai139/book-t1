import { Link } from "@nextui-org/react";



export default async function NotFound() {

    return (
        <main>
        <div className="flex flex-col gap-2 p-2 py-4">
            <h2 className="font-bold text-danger sm:text-3xl">404 - Page Not Found</h2>
            <p className="sm:text-lg">The page you're looking for does not exist.</p>

            <Link href="/">
                Take me back Home
            </Link>
        </div>
        </main>
    )
}