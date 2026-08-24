export function normalize(value: string) {
    return value
        .normalize("NFD")                  // rozlozi pismena na zakladni znak a diakriticke znamenko
        .replace(/[\u0300-\u036f]/g, "")   // odstrani oddelena diakriticka znamenka
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")  // vse krome pismen a cislic nahradi jednou mezerou
        .trim();
}

type CallbackFn = (...args: any[]) => void;
export function debounce(callback: CallbackFn, delay: number) {
    let timeoutId: number;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}
