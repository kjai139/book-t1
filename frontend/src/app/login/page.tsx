'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '../_styles/register.module.css'

const schema = yup.object({
    username: yup.string().required('A username is required'),
    password: yup.string().required('A password is required').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(20, 'Password cannot have more than 20 characters'),
    
    
})


export default function LoginPage () {
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
                SIGN IN
            </span>
            <div>
            <label htmlFor='username'>Username</label>
            <input {...register('username')} autoComplete='off' maxLength={20}></input>
            <p>{errors.username?.message}</p>
            </div>
            
            <div>
            <label htmlFor='password'>Password</label>
            <input {...register('password')} type='password' maxLength={20} autoComplete='off'></input>
            <p>{errors.password?.message}</p>
            </div>
            
            <div>
            <button type='submit' className={`${styles.submitBtn}`}>LOG IN</button>
            </div>
           
        </form>
        </div>
    )
}