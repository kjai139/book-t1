'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResultModal from '../_components/modals/resultModal'
import { Link } from '@nextui-org/react'

const schema = yup.object({
    username: yup.string().required('A username is required').max(15, 'username cannot exceed 15 letters.'),
    password: yup.string().required('A password is required').matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter').matches(/^(?=.*[A-Z])/, 'must contain at least one uppercase letter').matches(/^(?=.*[!@#$%^&()_+-])/, 'must have at least one special character').max(20, 'Password cannot have more than 20 characters'),
    confirmPassword: yup.string().required('Passwords must match').oneOf([yup.ref('password')], 'Passwords must match.'),
    email: yup.string().required('An email is required')
})


export default function RegisterPage () {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [resultMsg, setResultMsg] = useState('')
    const [modalTitle, setModalTitle] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data:any) => {
        try {
            const response = await fetch(`/api/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    confirmPassword: data.confirmPassword

                }),
                cache: 'no-store'
            })

            if (response.ok) {
                const responseData = await response.json()
                setModalTitle('Account Created')
                setResultMsg('Registration successful.')
                console.log(responseData)
            } else {
                console.error('Error message:', response.statusText)
                console.error('Error status:', response.status )
                const responseData = await response.json()
                setModalTitle('Error')
                setResultMsg('An error has occured.')
                console.log('response data:', responseData)
            }

        } catch (err) {
            console.error(err)
            setModalTitle('Error')
            setResultMsg('An error has occured.')
        }
    }

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({
                username:'',
                email: '',
                password: '',
                confirmPassword: ''
            })
        }
    }, [formState, reset])


    return (
        <div className='h-screen items-center justify-center flex'>
       {/*  <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col p-2 gap-1 rounded shadow border-divider border-2 bg-background-500 ${styles.form}`}>
            <span className='text-center text-lg font-bold'>
                Sign up
            </span>
            <div>
            <label htmlFor='username'>Username</label>
            <input {...register('username')} id='username' autoComplete='off' maxLength={20}></input>
            <p className='text-warning'>{errors.username?.message}</p>
            </div>
            <div>
            <label htmlFor='email'>Email</label>
            <input {...register('email')} id='email' autoComplete='off' type='email'></input>
            <p className='text-warning'>{errors.email?.message}</p>
            </div>
            <div>
            <label htmlFor='password'>Password</label>
            <input {...register('password')} type='password' maxLength={20} autoComplete='off' id='password'></input>
            <p className='text-warning'>{errors.password?.message}</p>
            </div>
            <div>
            <label htmlFor='confirmPassword'>Confirm password</label>
            <input {...register('confirmPassword')} autoComplete='off' maxLength={20} id='confirmPassword' type='password'></input>
            <p className='text-warning'>{errors.confirmPassword?.message}</p>
            </div>
            <div>
            <button type='submit' className={`${styles.submitBtn} bg-primary rounded p-2`}>SIGN UP</button>
            </div>
            <span>
            <button onClick={(e) => {e.preventDefault(); router.push('/login')}} className={`${styles.link} text-sm text-primary`}>Already registered?</button>
            </span>
            
        </form>
        {resultMsg && <ResultModal isOpen={true} message={resultMsg} title={modalTitle} redirectUrl='/login' actionName='Log in' handleClose={() => setResultMsg('')} ></ResultModal>} */}
        <div className='flex flex-col p-4 gap-4'>
        <h1 className='text-lg'>Registration is not open at the moment...and you're not supposed to be here...</h1>
        <Link href="/">
                Go Home
        </Link>
        </div>
        </div>
    )
}