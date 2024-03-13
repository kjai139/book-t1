'use client'
import {Tabs, Tab, Card, CardBody, CardHeader, Input, Button} from '@nextui-org/react'
import { useState } from 'react'
import SelectWtcTitle from '../autocomplete/selectTitle'
import ImageUploader from '../dropzones/imageUploader'
import apiUrl from '@/app/_utils/apiEndpoint'
import SelectGenres from '../checkboxes/selectGenres'



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

    const uploadWT = async () => {
        try {
            const formData = new FormData()
            formData.append('image', wtCover[0])
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
                            <Input label='About' type='text' value={wtAbout} onValueChange={setWtAbout}>
                            </Input>
                            <Input label='Author' type='text' value={wtAuthor} onValueChange={setWtAuthor}>
                            </Input>
                            <Input label='Status' type='text' value={wtStatus} onValueChange={setWtStatus}>
                            </Input>
                            <Input label='Alt name' type='text' value={altName} onValueChange={setAltName}>
                            </Input>
                            <Input label='Released year' type='text' value={releasedYr} onValueChange={setReleasedYr}>
                            </Input>
                            <Input label='Artist' type='text' value={artist} onValueChange={setArtist}>
                            </Input>
                            <Button>Upload</Button>
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
                        <form>
                            <Input
                            value={wtcTitle}
                            onValueChange={setWtcTitle}
                            type='text'
                            label='Post Title'
                            description={`Enter the post's title`}
                            ></Input>
                            <SelectWtcTitle value={wtcTitle} setValue={setWtcTitle}></SelectWtcTitle>
                            
                        </form>
                    </CardBody>
                </Card>

            </Tab>

        </Tabs>
    )
}