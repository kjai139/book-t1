'use client'
import { useState } from "react"
import MainHeaderNav from "../_components/mainHeaderNav"
import {Tabs, Tab, Card, CardBody, CardHeader} from '@nextui-org/react'

export default function Dashboard () {

    const [selectedTab, setSelectedTab] = useState<React.Key | any>('WT')
    

    return (
        <>
        <MainHeaderNav></MainHeaderNav>
        <main>
        <Tabs aria-label="Options" selectedKey={selectedTab} onSelectionChange={setSelectedTab} color="primary" variant="underlined">
            <Tab key={'WT'} title="WT">
                <Card>
                    <CardBody>
                        UPLOAD UI HERE
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

        </Tabs>
        
        
        </main>
        </>
    )
}