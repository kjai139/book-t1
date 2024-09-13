'use client'

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface BreadcrumbsProps {
    wtUrl?: string,
    wtcUrl?: string
}


export default function BreadCrumbs ({wtUrl, wtcUrl}:BreadcrumbsProps) {
    const slug = wtUrl?.split('-527')[0]

    return (
        <Breadcrumbs size="md" className="bc px-4" itemClasses={{
            item: 'bcStr'
        }}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/read">read</BreadcrumbItem>
        {
            wtUrl && 
            <BreadcrumbItem href={`/read/${wtUrl}`}>{slug}</BreadcrumbItem> 
        }
        {
            wtcUrl &&
            <BreadcrumbItem href={`/read/${wtUrl}/${wtcUrl}`}>{wtcUrl}</BreadcrumbItem>
        }
        </Breadcrumbs>
        
    )
}