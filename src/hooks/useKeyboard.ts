import {ChangeEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent, RefObject, useEffect, useRef, useState} from 'react';
import {CELL_STATUS, Guess, TileStatus} from "@/src/types/game";

interface KeyboardOptions {
    keyboardActive?: boolean; // if the game itself requires keyboard to not be active
    onChar: (char:string)=>void;
    onDelete:() =>void;
    onEnter:() => void;
}

export function useKeyboard({keyboardActive = true, onChar, onDelete, onEnter}: KeyboardOptions) {
    const [surfaceKeyboardActive, setSurfaceKeyboardActive] = useState<boolean>(true);

    const enableSurfaceKeyboard = () => {
        setSurfaceKeyboardActive(true);
    }

    const disableSurfaceKeyboard = () => {
        setSurfaceKeyboardActive(false);
    }

    const {
        proxyInputRef, openProxyKeyboard, onProxyInputChange, onProxyInputKeyDown
    } = useProxyKeyboard({isActive: (keyboardActive && !surfaceKeyboardActive),  disableSurfaceKeyboard, onChar, onDelete, onEnter});

    useSurfaceKeyboard({isActive: (surfaceKeyboardActive && keyboardActive), proxyInputRef, onChar, onDelete, onEnter});

    const {onScreenKeyPress} = useOnscreenKeyboard({onChar, onDelete, onEnter});

    return {
        proxyInputRef,
        surfaceKeyboardActive,
        onScreenKeyPress,
        openProxyKeyboard,
        enableSurfaceKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown,
    }
}
interface SurfaceKeyboardOptions {
    isActive?: boolean;
    proxyInputRef: RefObject<HTMLInputElement | null>;
    onChar: (char:string)=>void;
    onDelete:() =>void;
    onEnter:() => void;
}
export function useSurfaceKeyboard({ isActive = true, proxyInputRef, onChar, onDelete, onEnter }: SurfaceKeyboardOptions) {
    useEffect(() => {
        if (!isActive) return;

        if (proxyInputRef && document.activeElement === proxyInputRef.current) return;
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
    }, [isActive, onChar, onDelete, onEnter, proxyInputRef]); // Listens for logic changes
}

interface ProxyKeyboardProps {
    isActive: boolean;
    disableSurfaceKeyboard: () => void;
    onChar: (char:string)=>void;
    onDelete:() =>void;
    onEnter:() => void;
}
export function useProxyKeyboard({isActive,disableSurfaceKeyboard, onChar, onDelete, onEnter}:ProxyKeyboardProps ) {
    const proxyInputRef = useRef<HTMLInputElement>(null);

    const openProxyKeyboard = (e:MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (proxyInputRef.current) {
            proxyInputRef.current.focus({preventScroll: true});
            // setDefaultKeyboardListenerActive(false)
            disableSurfaceKeyboard()
        }
    };

    const onProxyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!isActive) return;
        const char = e.target.value.slice(-1).toUpperCase();
        if (/^[A-Z]$/.test(char)) onChar(char);
        e.target.value = ""; // Reset so next character can be detected
    }

    const onProxyInputKeyDown = (e: ReactKeyboardEvent) => {
        {
            if(!isActive) return;
            if (e.key === 'Enter') onEnter();
            if (e.key === 'Backspace') onDelete();
        }
    }

    return {proxyInputRef, openProxyKeyboard, onProxyInputChange, onProxyInputKeyDown};
}

interface OnScreenKeyboardProps{
    onEnter:() => void;
    onDelete:() => void;
    onChar: (char:string)=>void;
}
export const useOnscreenKeyboard = ({onEnter, onDelete, onChar}:OnScreenKeyboardProps) =>{

    const onScreenKeyPress = (key: string) => {
        if (key === "ENTER") {
            onEnter(); // Submit the guess
        } else if (key === "⌫") {
            onDelete(); // Remove last character
        } else {
            onChar(key); // Add new character
        }
    };

    return{
        onScreenKeyPress
    }
}


export const useKeyboardHelper = () =>{
    const [usedKeys, setUsedKeys] = useState<Record<string, TileStatus>>({});

    const updateUsedKeys = (formattedGuess: Guess) => {
        setUsedKeys((prev) => {
            const newKeys = {...prev};
            formattedGuess.forEach(({char, status}) => {
                const currentStatus = newKeys[char];
                // Logic: Only update if the new status is "better" than the old one
                if (status === CELL_STATUS.CORRECT) {
                    newKeys[char] = CELL_STATUS.CORRECT;
                } else if (status === CELL_STATUS.PRESENT && currentStatus !== CELL_STATUS.CORRECT) {
                    newKeys[char] = CELL_STATUS.PRESENT;
                } else if (status === CELL_STATUS.ABSENT && !currentStatus) {
                    newKeys[char] = CELL_STATUS.ABSENT;
                }
            });

            return newKeys;
        });
    };

    const resetUsedKeys = () => {
        setUsedKeys({});
    }

    return{
        usedKeys, updateUsedKeys, resetUsedKeys
    }
}