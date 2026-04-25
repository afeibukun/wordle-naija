import {CELL_STATUS, TileStatus} from "@/src/types/game";
import {MouseEvent} from "react";

const ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

interface KeyboardProps {
    usedKeys: Record<string, TileStatus>;
    onChar: (key: string) => void;
    onEnter: () => void;
    onDelete: () => void;
}

export default function Keyboard({usedKeys, onChar, onEnter, onDelete}: KeyboardProps) {
    const handleKeyPress = (key: string) => {
        if (key === "ENTER") {
            onEnter(); // Submit the guess
        } else if (key === "⌫") {
            onDelete(); // Remove last character
        } else {
            onChar(key); // Add new character
        }
    };

    return (
        <div className="keyboard-container overflow-hidden">
            <div className="w-full max-w-lg px-2 space-y-2">
                {ROWS.map((row, i) => (
                    <div key={i} className="keyboard-row flex justify-center gap-1">
                        {row.map((key) => (
                            <KeyboardButton
                                key={key}
                                keyLabel={key}
                                onClick={() => handleKeyPress(key)}
                                usedKeys={usedKeys}>
                            </KeyboardButton>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface KeyboardButtonProps {
    keyLabel: string;
    onClick: (key: string) => void;
    usedKeys: Record<string, TileStatus>;
}

const KeyboardButton = ({keyLabel, onClick, usedKeys}: KeyboardButtonProps) => {
    const keyStatus = usedKeys[keyLabel.toLowerCase()]
    const isEnterKey = keyLabel === "ENTER"
    const isDeleteKey = keyLabel === "⌫"
    const isSpecialKey = isEnterKey || isDeleteKey

    const handleKeyPress = (e: MouseEvent<HTMLButtonElement>, keyLabel: string) => {
        e.preventDefault();
        onClick(keyLabel);
    }
    return (
        <button
            className={`keyboard-button hover:bg-slate-400 rounded font-bold uppercase
                            ${keyStatus === CELL_STATUS.CORRECT ? "bg-green-600" : keyStatus === CELL_STATUS.PRESENT ? "bg-orange-500" : keyStatus === CELL_STATUS.ABSENT ? "bg-slate-800 text-slate-500" : "bg-slate-500"} 
                            ${isSpecialKey ? "md:px-4 py-4 bg-slate-600 min-w-10 md:min-w-16" : "px-2 md:px-3 py-4 w-8 md:w-10"}
                            ${isDeleteKey ? 'relative px-1' : isEnterKey ? 'px-2 text-sm md:text-base' : ''}`}
            onMouseDown={
                (e: MouseEvent<HTMLButtonElement>) => handleKeyPress(e, keyLabel)
            }
        >
            <span className={`${isDeleteKey ? 'absolute text-2xl inset-0 flex items-center justify-center' : ''}`}>{keyLabel}</span>
        </button>
    )
}