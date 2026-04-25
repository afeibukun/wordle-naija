import GameRow from "@/src/components/GameRow";
import {CELL_STATUS, Guess} from "@/src/types/game";

interface GridProps {
    guesses: Array<Guess>;
    currentGuess: string;
    solution: string;
    currentGuessIsShaking:boolean;
}

export default function Grid({guesses, currentGuess, solution, currentGuessIsShaking}: GridProps) {
    const empties = guesses.length < 5 ? Array.from(Array(5 - guesses.length)) : [];

    const currentGuessObject: Guess = currentGuess.padEnd(5, " ").split('').map(char => ({
        char,
        status: CELL_STATUS.EMPTY,
    }));

    const defaultGuess: Guess = Array(5).fill({char: '', status: CELL_STATUS.EMPTY})
    return (
        <div className="grid-container grid grid-rows-6 gap-2 mb-8">
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
    );
}

