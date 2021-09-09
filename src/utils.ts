export function delay(period: number) {
    return new Promise((resolve, reject) => {
        window.setTimeout(resolve, period);
    })
}