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
        <div className="cards-cont p-2 grid-cols-2 gap-2">
      
      {updates && updates.updates.map((node, idx) => {
        console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters)
        let slug = node.book.name.replace(/ /g, "-")
        return (
          <div key={node.book._id} className="cg">
           
            <Link href={`/read/${slug}`}>
            <div className="relative w-[148px] h-[212px] overflow-hidden">
              
              {/* <Image radius="lg" alt={`Cover image of ${node.book.name}`} src={node.book.image} isZoomed className="h-full">

              </Image> */}
              <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} priority={idx <= 4 ? true : false} fill sizes="(max-width:600px) 50vw 25vw" className="home-c">

              </NextImage>
             
              {/* <NextImage width={160} height={160} src={node.book.image} alt={`Cover image of ${node.book.name}`}>

              </NextImage> */}
            </div>
            </Link>
            
              
            
            <span className="card-txt">
            <Link href={`/read/${slug}`} color="foreground">
            {node.book.name}
            </Link>
            
            </span>
            
              
              <div className="ch-btns gap-1">
              {node.chapters.map((node) => {
                return (
                  <div key={node._id}>
                  <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="flex gap-1 items-center">
                  <span className="text-sm">{`Chapter ${node.chapterNumber}`}</span>
                  
                  {formatDateDMY(node.releasedAt) === 'New' ?

                  <span className={`text-xs text-danger pulsate flex-1 text-center`}>{formatDateDMY(node.releasedAt)}</span>:
                  <span className={`text-xs text-danger text-default-500 flex-1 text-center`}>{formatDateDMY(node.releasedAt)}</span>
                  }
                  </Link>
                  
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
