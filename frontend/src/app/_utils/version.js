

export const randomHash = `-553v1`

export const hashV = '5'


export function getHref (url) {
    let linkHref
    const urlParts = url.split('-')
    const urlLastPart = urlParts.pop()
    console.log('[getHref] url - ', url)
    console.log('[getHref] urlParts', urlParts)
    console.log('[getHref] lasturlpart', urlLastPart)
    if (urlLastPart.startsWith(hashV)) {
        const hashlessHref = url.slice(0, url.length - urlLastPart.length - 1)
        linkHref = `${hashlessHref}${randomHash}`
        console.log('[getHref] new hRef:', linkHref)
    } else {
        linkHref = `${url}${randomHash}`
    }

    return linkHref
}