import {useCallback, useState} from "react";
import {app} from "../stores/appStore";
import {browserStore} from "../stores/browserStore";
import {loadImageFromBase64, loadImageFromImageUrl} from "../utils/image";
import {showToast} from "../components/ui/Toast";
import {validURL} from "../utils/url";

export const ACCEPTED_IMAGES = ['.png', '.jpg', '.jpeg', '.webp'];

export const useImageInput = () => {
    const [capturing, setCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openFiles = useCallback((files: File[]) => {
        const file = files && files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener('load', event => {
            const dataUrl = event.target.result as string;
            // Check the browser can decode it before replacing the current screenshot and its markup.
            loadImageFromBase64(dataUrl)
                .then(() => app.setImageData(dataUrl))
                .catch(() => showToast('Couldn’t open that file. Use a PNG, JPEG or WebP image.', 'error'));
        });
        reader.readAsDataURL(file);
    }, []);

    const capture = useCallback((address: string, mobile: boolean) => {
        const trimmed = (address || '').trim();
        if (!validURL(trimmed)) {
            setError('Enter a website address, like example.com.');
            return;
        }
        const url = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
        setError(null);
        setCapturing(true);
        const startedWith = app.imageData;
        fetch(`${process.env.REACT_APP_SCREENSHOT_API}?url=${encodeURIComponent(url)}${mobile ? '&mobile=1' : ''}`)
            .then(response => {
                if (!response.ok) throw new Error('Capture failed');
                return response.json();
            })
            .then(data => {
                if (!data.imageBase64) throw new Error('No screenshot returned');
                if (app.imageData !== startedWith) return; // the user opened something else meanwhile
                browserStore.settings.addressBarUrl = url.replace(/https?:\/\//, '');
                app.setImageData(`data:image/png;base64,${data.imageBase64}`);
            })
            .catch(() => setError('Couldn’t capture that page. Check the address and try again.'))
            .finally(() => setCapturing(false));
    }, []);

    const openDemo = useCallback((mobile: boolean) => {
        loadImageFromImageUrl(mobile ? '/images/demo-mobile.svg' : '/images/demo-image.png')
            .then(image => app.setImageData(image as string));
    }, []);

    return {openFiles, capture, capturing, error, clearError: () => setError(null), openDemo};
};
