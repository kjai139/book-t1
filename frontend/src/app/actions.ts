'use server'

import apiUrl from "./_utils/apiEndpoint"



export async function AddViews (wtName:string) {
    try {
        const data = {
            wtName: wtName
        }
        const response = await fetch(`${apiUrl}/api/wt/views/add`, {
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            console.log('Views incremented')
        }

    } catch (err) {
        console.error(err)
    }
}