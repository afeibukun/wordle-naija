"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGameLogic} from "@/src/hooks/useGameLogic";
import {GAME_STATUS, GameLanguage,} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/Modal";
import SystemToast from "@/src/components/SystemToast";
import {useEffect, useState} from "react";
import {getDailySolution, getRandomSolution} from "@/src/lib/gameUtils";


export default function GameView() {
    const defaultSolution = "pikin"
    const [solution, setSolution] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<GameLanguage>("pid");

    useEffect(() => {
        // Pick the word only once on the client
        // const word = getRandomSolution(currentLanguage);
        const word = getDailySolution(currentLanguage);
        setSolution(word);
    }, []); // Empty array ensures this only runs on mount

    const {
        guesses,
        currentGuess,
        gameStatus,
        usedKeys,
        toastMsg,
        isShaking,
        onChar,
        onDelete,
        onEnter,
        appNotice,
        shareScore
    } = useGameLogic({solution: solution, language: "pid"});

    if (!solution) return <div className="flex h-screen items-center justify-center">Loading...</div>

    return (
        <div className="game">
            <div className="min-h-dvh bg-slate-900">
                <main className="flex flex-col items-center justify-between h-full text-white gap-y-12 p-4 py-20">
                    <header className="py-4">
                        <h1 className="text-4xl font-black tracking-widest uppercase">Wordle Naija</h1>
                        {appNotice && (<SystemToast message={appNotice}/>)}
                    </header>
                        <div className="flex flex-col items-center justify-center">
                            <div className="pb-10">
                                <Grid
                                    guesses={guesses}
                                    currentGuess={currentGuess}
                                    solution={solution}
                                    currentGuessIsShaking={isShaking}
                                />
                            </div>
                            <div className="toast-container relative w-full">
                                {toastMsg && (<GameToast message={toastMsg}/>)}
                            </div>
                            <Keyboard onChar={(char: string) => onChar(char)} onEnter={() => onEnter()}
                                      onDelete={() => onDelete()} usedKeys={usedKeys}/>
                        </div>
                </main>
            </div>

            {gameStatus !== GAME_STATUS.PLAYING && (
                <SuccessModal
                    solution={solution}
                    isWon={gameStatus === GAME_STATUS.WON}
                    attempts={guesses.length.toString()}
                    shareScore={() => shareScore()}
                />
            )}
        </div>
    );
}
