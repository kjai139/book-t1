import { Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react"
import MainHeaderNav from "./_components/mainHeaderNav"
import NextImage from "next/image"
import apiUrl from "./_utils/apiEndpoint"

interface Updates {

}

async function GetHomeUpdates() {

  try {
    const response = await fetch(`${apiUrl}/api/wt/updates/get?page=1`, {
      credentials: 'include',
      method: 'GET',
      cache: 'no-cache'
      
  })

  if (response.ok) {
    const updates = await response.json()
    console.log('updates:', updates)

    return updates
  } else {
    throw new Error('Failed to fetch updates')
  }


  

  } catch (err) {
    console.error('Error fetching updates')
    return {
      props: {
          updates: null
      },
    }
  }

    

}

export default async function Home() {
  const updates = await GetHomeUpdates()
  console.log('PROPS RECEIVED FROM SSG', updates)
  
  
  return (
    <>
    <MainHeaderNav></MainHeaderNav>
    <main>
      <Card className="max-w-[1024px]">
        <CardHeader>
          <h4>Latest Update</h4>
        </CardHeader>
        <Divider className="my-4"></Divider>
        <div className="grid sm:grid-cols-4 gap-2 grid-cols-2">
      
      {updates && updates.updates.map((node, idx) => {
        console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters)
        return (
          <div key={node.book._id} className="cg">
           
              
            
              <Image radius="lg" alt={`Cover image of ${node.book.name}`} src={node.book.image} isZoomed>

              </Image>
            
              

        
            <span>
              <h4>{node.book.name}</h4>
              </span>
          </div>
        )
      })}
      </div>
      </Card>
      
      
      
    </main>
    </>
  );
}
