import {MouseEvent, useEffect, useRef} from 'react';

interface KeyboardOptions {
    onChar: (key: string) => void;
    onDelete: () => void;
    onEnter: () => void;
    disabled?: boolean;
}

export function useSurfaceKeyboard({ onChar, onDelete, onEnter, disabled }: KeyboardOptions) {
    useEffect(() => {
        if (disabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat || e.ctrlKey || e.metaKey) return;

            const key = e.key.toUpperCase();

            if (key === 'ENTER') {
                onEnter();
            } else if (key === 'BACKSPACE') {
                onDelete();
            } else if (/^[A-Z]$/.test(key)) {
                onChar(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onChar, onDelete, onEnter, disabled]); // Listens for logic changes
}

interface ProxyKeyboardProps {
    disableSurfaceKeyboard: () => void;
}
export function useProxyKeyboard({disableSurfaceKeyboard}:ProxyKeyboardProps ) {
    const inputRef = useRef<HTMLInputElement>(null);

    const openProxyKeyboard = (e:MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.focus({preventScroll: true});
            // setDefaultKeyboardListenerActive(false)
            disableSurfaceKeyboard()
        }
    };

    return {inputRef, openProxyKeyboard};
}