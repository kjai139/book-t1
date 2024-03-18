import { parseISO, format, differenceInDays } from 'date-fns'

const formatDateDMY = (date) => {
    const parsedDate = parseISO(date)

    const todayDate = new Date()


    const result = differenceInDays(todayDate, parsedDate)
    const day = format(parsedDate, 'd')
    const month = format(parsedDate, 'M')
    const year = format(parsedDate, 'yyyy')

    if (result <= 2) {
        return 'New'
    } else {
        return `${month} ${day}, ${year}`
    }

    



}

export { formatDateDMY }