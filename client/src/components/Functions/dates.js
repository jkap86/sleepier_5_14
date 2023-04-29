

export const getLocalDate = (date) => {

    return new Date(new Date(date).getTime()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export const getUTCTimestamp = (date) => {

    return new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60 * 1000)
}