export function formateNumber(num: number): string {
    let result = num + ''
    if (num >= 100000000)
        result = (num / 100000).toFixed(2) + "B"
    else if (num >= 10000000)
        result = (num / 10000).toFixed(2) + "M"
    else if (num >= 1000000)
        result = (num / 10000).toFixed(2) + "W"
    else if (num >= 10000)
        result = (num / 1000).toFixed(2) + "K"
    return result
}