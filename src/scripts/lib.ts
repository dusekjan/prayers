// odebere diakritiku, prevede na mala pismena a nahradi interpunkci i bile znaky jednou mezerou
export function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

// odlozi volani fn, dokud neprestanou prichazet udalosti po dobu delay ms
type CallbackFn = (...args: any[]) => void;
export function debounce(callback: CallbackFn, delay: number) {
    let timeoutId: number;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}
