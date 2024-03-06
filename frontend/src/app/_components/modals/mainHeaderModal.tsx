import styles from '../../_styles/mainHeaderModal.module.css'

export default function MainHeaderModal () {

    return (
        
        <ul className={styles.container}>
            <li>
                <button>
                    Sign in
                </button>
            </li>
            <li>
                Sign up
            </li>

        </ul>
        
    )
}