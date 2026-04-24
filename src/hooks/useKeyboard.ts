import { useEffect } from 'react';

interface KeyboardOptions {
    onChar: (key: string) => void;
    onDelete: () => void;
    onEnter: () => void;
    disabled?: boolean;
}

export function useKeyboard({ onChar, onDelete, onEnter, disabled }: KeyboardOptions) {
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
