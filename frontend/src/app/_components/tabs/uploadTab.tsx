'use client'
import {Tabs, Tab, Card, CardBody, CardHeader, Input, Button, Textarea} from '@nextui-org/react'
import { useState } from 'react'
import SelectWtcTitle from '../autocomplete/selectTitle'
import ImageUploader from '../dropzones/imageUploader'
import apiUrl from '@/app/_utils/apiEndpoint'
import SelectGenres from '../checkboxes/selectGenres'
import SelectWtStatus from '../autocomplete/selectStatus'



export default function UploadTabs () {

    const [selectedTab, setSelectedTab] = useState<React.Key | any>('WT')

    //wt states
    const [wtTitle, setWtTitle] = useState('')
    const [wtGenre, setWtGenre] = useState<String[]>([])
    const [wtAbout, setWtAbout] = useState('')
    const [wtAuthor, setWtAuthor] = useState('')
    const [altName, setAltName] = useState('')
    const [releasedYr, setReleasedYr] = useState('')
    const [artist, setArtist] = useState('')
    const [wtStatus, setWtStatus] = useState('')
    const [wtCover, setWtCover] = useState<File[]>([])


    //wtc states
    const [wtcTitle, setWtcTitle] = useState('')
    const [parentRef, setParentRef] = useState('')
    const [wtcNumber, setWtcNumber] = useState('')
    const [wtcImages, setWtcImages] = useState<File[]>([])

    const uploadWT = async () => {
        
        try {
            const formData = new FormData()
            formData.append('image', wtCover[0])
            formData.append('name', wtTitle)
            const genres = {
                genres: wtGenre
            }
            const genreString = JSON.stringify(genres)
            formData.append('genres', genreString)
            formData.append('about', wtAbout)
            formData.append('author', wtAuthor)
            formData.append('status', wtStatus)
            formData.append('altName', altName)
            formData.append('releasedYr', releasedYr)
            formData.append('artist', artist)
            const response = await fetch(`${apiUrl}/api/wt/create`, {
                method: 'POST',
                credentials: 'include',
                body: formData
                

            })

            if (response.ok) {
                const responseData = await response.json()
                console.log(responseData)
            }

        } catch (err) {
            console.error(err)
        }
    }

    const uploadWtc = async () => {
        try {
            const formData = new FormData()
            wtcImages.forEach((file) => {
                formData.append('images', file)
            })
            formData.append('name', wtcTitle)
            formData.append('chapterNumber', wtcNumber)
            formData.append('parentRef', parentRef)

            const response = await fetch(`${apiUrl}/api/wtc/create`, {
                credentials: 'include',
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const responseData = await response.json()
                console.log(responseData)
            }
            
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <Tabs aria-label="Options" selectedKey={selectedTab} onSelectionChange={setSelectedTab} color="primary" variant="underlined">
            <Tab key={'WT'} title="WT">
                <Card className='max-w-[1000px]'>
                    <CardBody>
                        <div className='flex flex-col gap-4'>
                            <Input
                            value={wtTitle}
                            onValueChange={setWtTitle}
                            type='text'
                            label='WT Title'
                            description={`Enter the WT's title`}
                            ></Input>
                            <SelectGenres value={wtGenre}setValue={setWtGenre}></SelectGenres>
        
                            <Textarea label="About" placeholder='synopsis' value={wtAbout} onValueChange={setWtAbout}>

                            </Textarea>
                            <Input label='Author' type='text' value={wtAuthor} onValueChange={setWtAuthor}>
                            </Input>
                            {/* <Input label='Status' type='text' value={wtStatus} onValueChange={setWtStatus}> */}
                                <SelectWtStatus value={wtStatus} setValue={setWtStatus}>

                                </SelectWtStatus>
                            
                            <Input label='Alt name' type='text' value={altName} onValueChange={setAltName}>
                            </Input>
                            <Input label='Released year' type='text' value={releasedYr} onValueChange={setReleasedYr}>
                            </Input>
                            <Input label='Artist' type='text' value={artist} onValueChange={setArtist}>
                            </Input>
                            <Button onPress={uploadWT}>Upload</Button>
                            <ImageUploader setImageArr={setWtCover}></ImageUploader>

                            
                        </div>
                    </CardBody>
                </Card>

            </Tab>
            <Tab key={'NV'} title="NV">
            <Card>
                    <CardBody>
                        UPLOAD NV UI HERE
                    </CardBody>
                </Card>
            </Tab>
            <Tab key={'WTC'} title="WTC">
                <Card>
                    <CardBody>
                        <div className='flex flex-col gap-4'>
                            <Input
                            value={wtcTitle}
                            onValueChange={setWtcTitle}
                            type='text'
                            label='Post Title'
                            description={`Enter the post's title`}
                            ></Input>
                            <SelectWtcTitle value={parentRef} setValue={setParentRef}></SelectWtcTitle>
                            <Input type='number' label="Chapter number" onValueChange={setWtcNumber} value={wtcNumber} description={`Enter the chapter number`}>
                            </Input>
                            <Button onPress={uploadWtc}>Upload</Button>
                            <ImageUploader setImageArr={setWtcImages}></ImageUploader>
                            
                        </div>
                    </CardBody>
                </Card>

            </Tab>

        </Tabs>
    )
}