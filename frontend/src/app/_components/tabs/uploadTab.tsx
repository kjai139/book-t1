'use client'
import {Tabs, Tab, Card, CardBody, CardHeader, Input} from '@nextui-org/react'
import { useState } from 'react'
import SelectWtcTitle from '../autocomplete/selectTitle'



export default function UploadTabs () {

    const [selectedTab, setSelectedTab] = useState<React.Key | any>('WT')
    const [wtTitle, setWtTitle] = useState('')
    const [wtcTitle, setWtcTitle] = useState('')


    return (
        <Tabs aria-label="Options" selectedKey={selectedTab} onSelectionChange={setSelectedTab} color="primary" variant="underlined">
            <Tab key={'WT'} title="WT">
                <Card>
                    <CardBody>
                        <form>
                            <Input
                            value={wtTitle}
                            onValueChange={setWtTitle}
                            type='text'
                            label='WT Title'
                            description={`Enter the WT's title`}
                            ></Input>
                            
                            
                        </form>
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