import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image, Link } from "@nextui-org/react"
import MainHeaderNav from "./_components/mainHeaderNav"
import NextImage from "next/image"
import { formatDateDMY } from './_utils/dates'
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
    <main>
      <Card className="max-w-[1024px]">
        <CardHeader>
          <h4>Latest Update</h4>
        </CardHeader>
        <Divider className="my-4"></Divider>
        <div className="cards-cont p-2">
      
      {updates && updates.updates.map((node, idx) => {
        console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters)
        let slug = node.book.name.replace(/ /g, "-")
        return (
          <div key={node.book._id} className="cg">
           
              
            <div className="relative">
              <Link href={`/read/${slug}`}>
              <Image radius="lg" alt={`Cover image of ${node.book.name}`} src={node.book.image} isZoomed>

              </Image>
              </Link>
              {/* <NextImage width={160} height={160} src={node.book.image} alt={`Cover image of ${node.book.name}`}>

              </NextImage> */}
            </div>
            
              

            <span className="card-txt">
            <h4>{node.book.name}</h4>
            </span>
              
              <div className="ch-btns gap-1">
              {node.chapters.map((node) => {
                return (
                  <div key={node._id} className="flex gap-1 items-center">
                  <Button color="primary" radius="lg" size="sm">
                    <span>{`Chapter ${node.chapterNumber}`}</span>
                   
                  </Button>
                  <span className="text-sm text-danger pulsate flex-1 text-center">{formatDateDMY(node.releasedAt)}</span>
                  </div>
                )
              })}
              </div>
              
          </div>
        )
      })}
      </div>
      </Card>
      
      
      
    </main>
    </>
  );
}
