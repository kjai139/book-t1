
interface ServerErrorProps {
    message?: string
}

export default function ServerError({message}:ServerErrorProps) {
    return (
        <div className="min-h-[100vh] p-4 text-center">
            <span className="font-semibold text-lg">
                {message ? message :
                "A server error has occured. Please try refreshing the page, and if that doesn't work, please try again later. Sorry for the inconvenience."
                }
            </span>
            
        </div>
    )
}