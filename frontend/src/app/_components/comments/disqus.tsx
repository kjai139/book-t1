'use client'
import { CommentCount, DiscussionEmbed } from "disqus-react";

interface DisqusCommentsProps {
    slug:string,
    identifier: string,
    title: string,
}

export default function DisqusComments ({slug, identifier, title}:DisqusCommentsProps) {
    return (
        <div className="p-4 bg-inherit text-default-500">
            <h3>Comments for {title}</h3>
        <CommentCount shortname={process.env.NEXT_PUBLIC_DISQUS_SN as string}
        config={
            {
                url:`${process.env.NEXT_PUBLIC_HOME_DOMAIN}/${slug}`,
                identifier: identifier,
                title: title,
            }

        }>

        </CommentCount>
        <DiscussionEmbed 
        shortname={process.env.NEXT_PUBLIC_DISQUS_SN as string}
        config={
            {
                url:`${process.env.NEXT_PUBLIC_HOME_DOMAIN}/${slug}`,
                identifier: identifier,
                title: title,
                language: 'en_EN'
            }

        }>

        </DiscussionEmbed>
        </div>
    )
}