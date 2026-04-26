import GameRow from "@/src/components/GameRow";
import {CELL_STATUS, Guess} from "@/src/types/game";

interface GridProps {
    guesses: Array<Guess>;
    currentGuess: string;
    solution: string;
    currentGuessIsShaking: boolean;
}

export default function Grid({guesses, currentGuess, solution, currentGuessIsShaking}: GridProps) {
    const empties = guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : [];

    const currentGuessObject: Guess = currentGuess.padEnd(5, " ").split('').map(char => ({
        char,
        status: CELL_STATUS.EMPTY,
    }));

    const defaultGuess: Guess = Array(5).fill({char: '', status: CELL_STATUS.EMPTY})
    return (
        <div className="flex gap-3 items-start">
            <div
                className="numbers-column grid grid-rows-6 gap-1 md:gap-2"> {/* pt-4 to align with Row padding if needed */}
                {[1, 2, 3, 4, 5, 6].map((num, index) => (
                    <NumbersColumn key={num} guesses={guesses} num={num} index={index}/>
                ))}
            </div>
            <div className="grid-container grid grid-rows-6 gap-1 md:gap-2 mb-6 md:mb-8">
                {/* 1. Past Guesses */}
                {guesses.map((guess: Guess, i: number) => (
                    <GameRow key={i} guess={guess} solution={solution} isSubmitted/>
                ))}

                {/* 2. Current Active Row */}
                {guesses.length < 6 && (
                    <div className={currentGuessIsShaking ? "animate-shake" : ""}>
                        <GameRow guess={currentGuessObject}/>
                    </div>
                )}

                {/* 3. Empty Future Rows */}
                {empties.map((_, i) => (
                    <GameRow key={i} guess={defaultGuess}/>
                ))}
            </div>
        </div>
    );
}

interface NumbersColumnProps {
    num: number,
    index: number,
    guesses: Array<Guess>,
}

const NumbersColumn = ({num, index, guesses}: NumbersColumnProps) => {
    const isCurrent = index === guesses.length;
    return (
        <div
            key={num}
            className={`h-12 md:h-14 w-4 flex items-center justify-center text-xs font-semibold md:font-black transition-colors duration-500 
                    ${isCurrent ? 'text-green-500 scale-115 md:scale-125' : 'text-slate-600'}`}
        >
            {num}
        </div>
    )
}