import {useState} from 'react'

function useCopyToClipboard() {
    const [result, setResult] = useState<null | {state: 'success'} | {state: 'error'; message: string}>(null);

    const copy = async(text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setResult({state: 'success'});
        } catch (error) {
            let message = 'unknown Error'
            if (error instanceof Error) message = error.message
            setResult({state: 'error', message});
            throw error
        } finally {
            setTimeout(() => {
                setResult(null)
            }, 1000)
        }
    }
    return [copy, result] as const;
}

export default useCopyToClipboard
