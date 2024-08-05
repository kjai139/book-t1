

export default function PrivacyPage() {

    return (
        <main>
            <div className="flex flex-col p-4 gap-4 mw">
            <h1 className="text-lg font-bold">Privacy Outline</h1>
            <span>
                <h2 className="font-semibold underline">Summary</h2>
                <p>We respect your privacy and we are committed to protecting your personal information. This outline explains how we collect, use, and protect your data when you use this website.</p>
            </span>
            <span className="flex flex-col gap-4">
                <h2 className="font-semibold underline">Authentication</h2>
                <p>
                    OAuth is an authorization framework that allows this website to access your resources with your consent and this is the only form of authentication method we allow at the moment.
                </p>
                <span>
                    <p>
                    When you authenticate via OAuth, we collect the following data: Your name, email address, and profile picture.
                    </p>
                    <ol className="flex flex-col gap-2">
                        <li>
                            We use your data for Authentication and Authorization purposes only.
                        </li>
                        <li>
                            We may share your data with: Service Providers to process authentication requests and Analytics Services to improve our services.
                        </li>
                        <li>
                            Your data is encrypted during transmission and storage and we ensure access and refresh tokens are securely stored.
                        </li>
                    </ol>
                </span>

            </span>
            <span>
                <h2 className="font-semibold underline">Comments</h2>
                <p>Comments are handled through DISQUS only at the moment and we do not collect anything on our end.</p>
            </span>
            <span>
                <h2 className="font-semibold underline">Cookies</h2>
                <p>We only use cookies for Authentication purposes if you choose to log in via OAuth at the moment.</p>
            </span>
            <span>
                <h2 className="font-semibold underline">Changes to our Privacy Policy</h2>
                <p>
                    We will update this outline immediately upon any changes made in the future.
                </p>
            </span>
           </div>
        </main>
    )
}