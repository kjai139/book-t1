import { Link } from "@nextui-org/react";



export default async function NotFound() {

    return (
        <div className="flex flex-col gap-2">
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for does not exist.</p>

            <Link href="/">
                Take me back Home
            </Link>
        </div>
    )
}