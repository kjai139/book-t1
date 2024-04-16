
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_PROD_URL : process.env.NEXT_PUBLIC_API_LOCAL_URL


export default apiUrl