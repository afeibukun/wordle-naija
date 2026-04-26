import {ChangeEvent, RefObject, KeyboardEvent} from "react";

interface ProxyKeyboardInputProps {
    inputRef: RefObject<HTMLInputElement | null>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: (e: KeyboardEvent) => void,
    enableSurfaceKeyboard: () => void,
}

export const ProxyKeyboardInput = ({inputRef, onChange, onKeyDown, enableSurfaceKeyboard}: ProxyKeyboardInputProps) => {
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