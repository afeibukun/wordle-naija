import {RefObject} from "react";

interface HiddenInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onChar: (char: string) => void,
    onEnter: () => void,
    onDelete: () => void,
    enableSurfaceKeyboard: () => void,
}

export const HiddenInput = ({inputRef, onChar, onEnter, onDelete, enableSurfaceKeyboard}: HiddenInputProps) => {
    return (
        <div className="hidden-input-component keyboard-trigger">
            <input
                type="text"
                ref={inputRef}
                className="fixed top-0 left-0 opacity-0 pointer-events-none -z-50"
                inputMode="text" // Ensures the text keyboard opens
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => {
                    const char = e.target.value.slice(-1).toUpperCase();
                    if (/^[A-Z]$/.test(char)) onChar(char);
                    e.target.value = ""; // Reset so next character can be detected
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onEnter();
                    if (e.key === 'Backspace') onDelete();
                }}
                onBlur={() => {enableSurfaceKeyboard()}}
            />
        </div>
    )
}