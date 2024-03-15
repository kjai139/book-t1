import MainHeaderNav from "./_components/mainHeaderNav"
import type { InferGetStaticPropsType, GetStaticProps,  } from "next"
import apiUrl from "./_utils/apiEndpoint"

interface Updates {

}

export async function GetStaticProps() {

    const response = await fetch(`${apiUrl}/api/wt/updates/get`, {
        credentials: 'include',
        method: 'GET',
        cache: 'no-cache'
        
    })

    const updates = await response.json()

    return {
        props: {
            updates,
        },
        revalidate: 60
    }

}

export default function Home({updates}) {

  console.log('PROPS RECEIVED FROM SSG', updates)
  return (
    <>
    <MainHeaderNav></MainHeaderNav>
    <main>
      
      
    </main>
    </>
  );
}
