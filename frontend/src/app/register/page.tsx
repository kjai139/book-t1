'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import styles from '../_styles/register.module.css'
import { useRouter } from 'next/navigation'

const schema = yup.object({
    username: yup.string().required('A username is required'),
    password: yup.string().required('A password is required').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(20, 'Password cannot have more than 20 characters'),
    confirmPassword: yup.string().required('Passwords must match').oneOf([yup.ref('password')], 'Passwords must match.'),
    email: yup.string().required('An email is required')
})


export default function RegisterPage () {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data) => console.log(data)


    return (
        <div className='h-screen items-center justify-center flex'>
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-1 rounded shadow ${styles.form}`}>
            <span className='text-center text-lg font-bold'>
                Sign up
            </span>
            <div>
            <label htmlFor='username'>Username</label>
            <input {...register('username')} autoComplete='off' maxLength={20}></input>
            <p>{errors.username?.message}</p>
            </div>
            <div>
            <label htmlFor='email'>Email</label>
            <input {...register('email')} autoComplete='off' type='email'></input>
            <p>{errors.email?.message}</p>
            </div>
            <div>
            <label htmlFor='password'>Password</label>
            <input {...register('password')} type='password' maxLength={20} autoComplete='off'></input>
            <p>{errors.password?.message}</p>
            </div>
            <div>
            <label htmlFor='confirmPassword'>Confirm password</label>
            <input {...register('confirmPassword')} autoComplete='off' maxLength={20} type='password'></input>
            <p>{errors.confirmPassword?.message}</p>
            </div>
            <div>
            <button type='submit' className={`${styles.submitBtn}`}>SIGN UP</button>
            </div>
            <span>
            <button onClick={() => router.push('/login')} className={`${styles.link} text-sm`}>Already registered?</button>
            </span>
            {/* For some reason, using link gets spam warnings for preload bs */}
        </form>
        </div>
    )
}