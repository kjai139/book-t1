'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '../_styles/register.module.css'
import apiUrl from '../_utils/apiEndpoint'
import { useState } from 'react'
import ResultModal from '../_components/modals/resultModal'
import { Button } from '@nextui-org/react'

const schema = yup.object({
    username: yup.string().required('A username is required'),
    password: yup.string().required('A password is required'),
    
    
})


export default function LoginPage () {

    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const response = await fetch(`${apiUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,

                }),
                cache: 'no-store',
                credentials: 'include'
            })

            if (response.ok) {
                setIsLoading(false)
                const responseData = await response.json()
                console.log(responseData)
                console.log('ROUTING TO DASHBOARD...')
                router.push('/dashboard')
                /* router.back() */
                
            } else {
                setIsLoading(false)
                console.error('Error message:', response.statusText)
                console.error('Error status:', response.status )
                
                const responseData = await response.json()
                setErrorMsg(responseData.message)
                console.log(responseData)
            }

        } catch (err) {
            setIsLoading(false)
            console.error(err)
            setErrorMsg('An error has occured')
        }
    }


    return (
        <div className='h-screen items-center justify-center flex'>
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-1 rounded shadow relative border-divider border-2 ${styles.form}`}>
            {/* {isLoading &&
            <span className='overlay-t'></span>
            } */}
            <span className='text-center text-lg font-bold'>
                SIGN IN
            </span>
            <div>
            <label htmlFor='username'>Username</label>
            <input {...register('username')} id='username' autoComplete='off' maxLength={20}></input>
            <p className='text-warning'>{errors.username?.message}</p>
            </div>
            
            <div>
            <label htmlFor='password'>Password</label>
            <input {...register('password')} type='password' maxLength={20} autoComplete='off' id='password'></input>
            <p className='text-warning'>{errors.password?.message}</p>
            </div>
            
            
            {/* <button type='submit' className={`${styles.submitBtn} p-1 bg-primary rounded`}>LOG IN</button> */}
            <div>
            <Button color='primary' isLoading={isLoading} radius='md' type='submit'>
                {isLoading ? 'Loading' : 'Log in'}
            </Button>
            </div>
            
           
        </form>
        {errorMsg && 
        <ResultModal isOpen={true} message={errorMsg} title='Error' handleClose={() => setErrorMsg('')} ></ResultModal>
        }
        </div>
    )
}