import { useRouter } from 'next/navigation'
import styles from '../../_styles/mainHeaderModal.module.css'

export default function MainHeaderModal () {

    const router = useRouter()

    return (
        
        <ul className={`${styles.container} gap-2`}>
            <li>
                <button className={`${styles.button} p-2`}>
                    <span>Sign in</span>
                </button>
            </li>
            <li>
                <button className={`${styles.button} p-2`} onClick={() => router.push('/register')}>
                    <span>Sign up</span>
                </button>
            </li>

        </ul>
        
    )
}