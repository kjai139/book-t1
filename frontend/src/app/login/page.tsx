'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '../_styles/register.module.css'
import apiUrl from '../_utils/apiEndpoint'
import { useState } from 'react'

const schema = yup.object({
    username: yup.string().required('A username is required'),
    password: yup.string().required('A password is required').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(20, 'Password cannot have more than 20 characters'),
    
    
})


export default function LoginPage () {

    const router = useRouter()
    const [resultMSg, setResultMsg] = useState('')
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${apiUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,

                }),
                cache: 'no-store'
            })

            if (response.ok) {
                const responseData = await response.json()
                console.log(responseData)
                
            } else {
                console.error('Error message:', response.statusText)
                console.error('Error status:', response.status )
            }

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div className='h-screen items-center justify-center flex'>
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-1 rounded shadow border-divider border-2 ${styles.form}`}>
            <span className='text-center text-lg font-bold'>
                SIGN IN
            </span>
            <div>
            <label htmlFor='username'>Username</label>
            <input {...register('username')} id='username' autoComplete='off' maxLength={20}></input>
            <p>{errors.username?.message}</p>
            </div>
            
            <div>
            <label htmlFor='password'>Password</label>
            <input {...register('password')} type='password' maxLength={20} autoComplete='off' id='password'></input>
            <p>{errors.password?.message}</p>
            </div>
            
            <div>
            <button type='submit' className={`${styles.submitBtn} p-1 bg-primary rounded`}>LOG IN</button>
            </div>
           
        </form>
        </div>
    )
}