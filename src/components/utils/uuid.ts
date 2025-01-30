export function uuid(): string {
    let datetime = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (i: string) => {
            let random = (datetime + Math.random() * 16) % 16 | 0
            datetime = Math.floor(datetime / 16)
            return (i == 'x' ? random: (random & 0x3) | 0x8).toString(16)
        },
    )
    return uuid
}