import {CELL_STATUS, Guess, Tile, TileStatus} from "@/src/types/game";
import {useRef} from "react";

export const STATUS_COLORS = {
    [CELL_STATUS.CORRECT]: 'bg-green-600 border-green-600',
    [CELL_STATUS.PRESENT]: 'bg-orange-500 border-orange-500',
    [CELL_STATUS.ABSENT]: 'bg-slate-700 border-slate-700',
    [CELL_STATUS.EMPTY]: 'bg-transparent border-slate-700',
} as const;

export const STATUS_STYLE = {
    [CELL_STATUS.CORRECT]: 'animate-flip-correct',
    [CELL_STATUS.PRESENT]: 'animate-flip-present',
    [CELL_STATUS.ABSENT]: 'animate-flip-absent'
} as const;

interface RowProps {
    guess: Guess;
    solution?: string;
    isSubmitted?: boolean;
    isAnimationEnabled?: boolean;
    isGameWon?: boolean;
    isLastGuess?: boolean;
}

export default function GameRow({
                                    guess,
                                    solution,
                                    isSubmitted = false,
                                    isAnimationEnabled = true,
                                    isGameWon = false,
                                    isLastGuess = false
                                }: RowProps) {

    return (
        <div className="game-row flex gap-1 md:gap-2">
            {guess.map((tile: Tile, i: number) => (
                    <TileView key={i} char={tile.char} status={tile.status} index={i}
                              isAnimationEnabled={isAnimationEnabled} isTileOnWinningRow={isGameWon && isLastGuess}/>
                )
            )}
        </div>
    );
}

interface TileProps {
    char: string;
    status: TileStatus;
    index: number;
    isAnimationEnabled?: boolean;
    isTileOnWinningRow?: boolean;
}

const TileView = ({char, status, index, isAnimationEnabled = true, isTileOnWinningRow = false}: TileProps) => {
    const isSubmitted = status !== CELL_STATUS.EMPTY;
    const isOnCurrentRow = status === CELL_STATUS.EMPTY && char !== "" && char !== " ";
    return (
        <div
            style={{
                // Each tile waits 100ms longer than the one before it
                animationDelay: isTileOnWinningRow ? `${50 + (index * 100)}ms`
                    : isSubmitted ? `${index * 150}ms` : '0ms',
            }}
            className={`game-tile w-12 md:w-14 h-12 md:h-14 border md:border-2 flex items-center justify-center text-lg md:text-2xl font-bold uppercase transition-colors duration-0
            ${(isTileOnWinningRow && isAnimationEnabled) ? 'animate-bounce-win ' + STATUS_COLORS[status] 
                : (isSubmitted && isAnimationEnabled) ? STATUS_STYLE[status]
                    : (isOnCurrentRow && isAnimationEnabled) ? 'animate-pop'
                        : STATUS_COLORS[status]} 
            `}
        >
            <span>{char}</span>
        </div>
    );
}