

export default function PrivacyPage() {

    return (
        <main>
            <div className="flex flex-col p-4 gap-4">
            <h1 className="text-lg font-bold">Privacy Outline</h1>
            <span>
                <h2 className="font-semibold underline">Summary</h2>
                <p>We respect your privacy and do not collect any of your information on our end without your consent. Your bookmarks are purely saved on your browser's local storage right now. Any future updates will be listed in details here.</p>
            </span>
            <span>
                <h2 className="font-semibold underline">Comments</h2>
                <p>Comments are through DISQUS only at the moment and we do not collect anything on our end.</p>
            </span>
            <span>
                <h2 className="font-semibold underline">Cookies</h2>
                <p>No cookies are from us but may be subject to change in the future for your convenience. All updated usage will be stated clearly here.</p>
            </span>
           </div>
        </main>
    )
}