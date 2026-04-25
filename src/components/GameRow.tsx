import {CELL_STATUS, Guess, Tile, TileStatus} from "@/src/types/game";
import {useRef} from "react";

export const STATUS_COLORS = {
    [CELL_STATUS.CORRECT]: 'bg-green-600 border-green-600',
    [CELL_STATUS.PRESENT]: 'bg-orange-500 border-orange-500',
    [CELL_STATUS.ABSENT]: 'bg-slate-700 border-slate-700',
    [CELL_STATUS.EMPTY]: 'border-slate-700',
} as const;

interface RowProps {
    guess: Guess;
    solution?: string;
    isSubmitted?: boolean;
}

export default function GameRow({guess, solution, isSubmitted = false}: RowProps) {

    return (
        <div className="game-row flex gap-2">
            {guess.map((tile: Tile, i: number) => (
                    <TileView key={i} char={tile.char} status={tile.status}/>
                )
            )}
        </div>
    );
}

interface TileProps {
    char: string;
    status: TileStatus;
}

const TileView = ({char, status}: TileProps) => {
    const isSubmitted = status !== CELL_STATUS.EMPTY;
    return (
        <div
            className={`game-tile w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase 
            ${isSubmitted ? 'not-animate-flip' : ''} 
            ${!isSubmitted && char !== "" ? 'animate-pop' : ''} 
            ${STATUS_COLORS[status]}`}>
            <span>{char}</span>
        </div>
    );
}