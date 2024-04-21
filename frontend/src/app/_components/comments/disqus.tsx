'use client'
import { Divider } from "@nextui-org/react";
import { CommentCount, DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";

interface DisqusCommentsProps {
    slug:string,
    identifier: string,
    title: string,
}

export default function DisqusComments ({slug, identifier, title}:DisqusCommentsProps) {

    const { theme } = useTheme()
    return (
        <div className="disqus-cont font-semibold flex flex-col">
            <span className="font-semibold p-4">
            <h3>Comments for {title}</h3>
            </span>
            <Divider className="mb-4"></Divider>
        {/* <CommentCount shortname={process.env.NEXT_PUBLIC_DISQUS_SN as string}
        config={
            {
                url:`${process.env.NEXT_PUBLIC_HOME_DOMAIN}/${slug}`,
                identifier: identifier,
                title: title,
            }

        }>

        </CommentCount> */}
        <DiscussionEmbed key={theme} 
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