import { Spinner } from '@nextui-org/react'


export default function DefaultSpinner () {
    return (
        <span className='overlay'>
        <Spinner color='primary' size='lg'></Spinner>
        </span>
    )
}