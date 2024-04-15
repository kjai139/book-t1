'use client'
import {Tabs, Tab, Card, CardBody, CardHeader, Input, Button, Textarea} from '@nextui-org/react'
import { useEffect, useState } from 'react'
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
    const [wtCover, setWtCover] = useState<any[]>([])
    const [tlGroup, setTlGroup] = useState('')


    //wtc states
    const [wtcTitle, setWtcTitle] = useState('')
    const [parentRef, setParentRef] = useState('')
    const [wtcNumber, setWtcNumber] = useState('')
    const [wtcImages, setWtcImages] = useState<File[]>([])

    const resetWtForm = () => {
        setWtTitle('')
        setWtGenre([])
        setWtAbout('')
        setWtAuthor('')
        setAltName('')
        setReleasedYr('')
        setArtist('')
        setWtStatus('')
        setWtCover([])
        setTlGroup('')
        
    }

    const resetWtcForm = () => {
        setWtcTitle('')
        setParentRef('')
        setWtcNumber('')
        setWtcImages([])
    }

    const uploadWT = async () => {
        
        try {
            const formData = new FormData()
            formData.append('image', wtCover[0].file)
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
            formData.append('tlGroup', tlGroup)
            
            const response = await fetch(`${apiUrl}/api/wt/create`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    'Directory-Name': 'covers'
                }
                

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
            wtcImages.forEach((file:any, idx) => {
                /* const idx = file.file.name.split('.')[0].toString() */
                formData.append('images', file.file)
                formData.append(`heights-${idx}`, file.height )
                formData.append(`widths-${idx}`, file.width)
                console.log(`appended hxw-${idx}`, file.height , 'x', file.width)
                
            })
            formData.append('name', wtcTitle)
            formData.append('chapterNumber', wtcNumber)
            formData.append('parentRef', parentRef)

            const response = await fetch(`${apiUrl}/api/wtc/create`, {
                credentials: 'include',
                method: 'POST',
                body: formData,
                headers: {
                    'Directory-Name': `${parentRef}-${wtcNumber}`
                }
            })

            if (response.ok) {
                const responseData = await response.json()
                console.log(responseData)
            }
            
        } catch (err) {
            console.error(err)
        }
    }

    const uploadNextWtc = () => {
        let parts = wtcTitle.split(' ')
        const number = Number(parts[parts.length - 1]) + 1
        const lastIndex = parts.length - 1
        const firstPart = parts.slice(0, lastIndex).join(" ")
        const newNumber = Number(wtcNumber) + 1
        setWtcTitle(`${firstPart} ${number}`)
        setWtcNumber(newNumber.toString())
        setWtcImages([])
    }

    useEffect(() => {
        console.log('WTC IMGS', wtcImages)
    }, [wtcImages])


    return (
        <div className='max-w-[1024px] p-8'>
        <Tabs fullWidth aria-label="Options" selectedKey={selectedTab} onSelectionChange={setSelectedTab} color="primary" variant="underlined">
            <Tab key={'WT'} title="WT">
                <div>
                    <div>
                        <div className='flex flex-col gap-4'>
                            <Button onPress={resetWtForm}>Reset</Button>
                            <Input
                            value={wtTitle}
                            onValueChange={setWtTitle}
                            type='text'
                            autoComplete='off'
                            label='WT Title'
                            description={`Enter the WT's title`}
                            ></Input>
                            <SelectGenres value={wtGenre}setValue={setWtGenre}></SelectGenres>
        
                            <Textarea label="About" placeholder='synopsis' value={wtAbout} onValueChange={setWtAbout}>

                            </Textarea>
                            <Input label='Author' type='text' value={wtAuthor} onValueChange={setWtAuthor}>
                            </Input>
                            <Input label='tlGroup' type='text' value={tlGroup} onValueChange={setTlGroup}></Input>
                                <SelectWtStatus value={wtStatus} setValue={setWtStatus}>

                                </SelectWtStatus>
                            
                            <Input label='Alt name' type='text' value={altName} onValueChange={setAltName}>
                            </Input>
                            <Input label='Released year' type='text' value={releasedYr} onValueChange={setReleasedYr}>
                            </Input>
                            <Input label='Artist' type='text' value={artist} onValueChange={setArtist}>
                            </Input>
                            <Button onPress={uploadWT}>Upload</Button>
                            <ImageUploader setImageArr={setWtCover} imageArr={wtCover}></ImageUploader>

                            
                        </div>
                    </div>
                </div>

            </Tab>
            <Tab key={'NV'} title="NV">
            <div>
                    <div>
                        UPLOAD NV UI HERE
                    </div>
            </div>
            </Tab>
            <Tab key={'WTC'} title="WTC">
                <div>
                    <div>
                        <div className='flex flex-col gap-4'>
                            <Button onPress={resetWtcForm}>RESET FIELDS</Button>
                            <Button onPress={uploadNextWtc}>ADD NEXT</Button>
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
                            <ImageUploader setImageArr={setWtcImages} imageArr={wtcImages}></ImageUploader>
                            
                        </div>
                    </div>
                </div>

            </Tab>

        </Tabs>
        </div>
    )
}