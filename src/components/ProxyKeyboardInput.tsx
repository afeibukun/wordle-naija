import {ChangeEvent, RefObject, KeyboardEvent} from "react";

interface HiddenInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onChar: (char: string) => void,
    onEnter: () => void,
    onDelete: () => void,
    onChange: (e: ChangeEvent) => void,
    onKeyDown: (e: KeyboardEvent) => void,
    enableSurfaceKeyboard: () => void,
    surfaceKeyboardActive: boolean,
}

export const HiddenInput = ({inputRef, onChar, onEnter, onDelete, onChange, onKeyDown, enableSurfaceKeyboard, surfaceKeyboardActive}: HiddenInputProps) => {
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
                onChange={(e) => onChange(e)}
                onKeyDown={(e) => onKeyDown(e) }
                onBlur={() => enableSurfaceKeyboard()}
            />
        </div>
    )
}