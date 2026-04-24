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
import LanguageIndicator from "@/src/components/LanguageIndicator";
import {Share2} from "lucide-react";


export default function GameView() {
    const defaultSolution = "pikin"
    const [solution, setSolution] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<GameLanguage>("pid");
    const [showModal, setShowModal] = useState<boolean>(false);

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

    useEffect(() => {
        if (gameStatus !== GAME_STATUS.PLAYING) {
            setShowModal(true);
        }
    }, [gameStatus]);

    if (!solution) return <div className="flex h-screen items-center justify-center">Loading...</div>

    return (
        <div className="game">
            <div className="min-h-dvh bg-slate-900">
                <main className="flex flex-col items-center justify-between h-full text-white gap-y-12 p-4 py-20">
                    <header className="py-4">
                        <h1 className="text-4xl font-black tracking-widest uppercase">Wordle Naija</h1>
                        {appNotice && (<SystemToast message={appNotice}/>)}
                        <div>
                            <LanguageIndicator current={currentLanguage}/>
                        </div>
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
                        {gameStatus !== GAME_STATUS.PLAYING &&
                            <div>
                                <h2 className="text-3xl font-black mb-4 text-slate-100">
                                    {gameStatus === GAME_STATUS.WON ? "🎉 YOU Have Completed the game!" : "😔 Better Luck Next time!"}
                                </h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => shareScore()}
                                        className="w-full py-4 bg-slate-300 text-slate-800 hover:bg-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>SHARE YOUR SCORE</span>
                                        <Share2 className="w-5 h-5"/> {/* Use a small icon here */}
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full py-4 bg-green-600 hover:bg-green-500 font-bold rounded-xl transition-all cursor-pointer"
                                    >
                                        PLAY AGAIN
                                    </button>
                                </div>
                            </div>
                        }
                        <div className="toast-container relative w-full">
                            {toastMsg && (<GameToast message={toastMsg}/>)}
                        </div>
                        {gameStatus === GAME_STATUS.PLAYING &&
                            <div>
                                <Keyboard onChar={(char: string) => onChar(char)} onEnter={() => onEnter()}
                                          onDelete={() => onDelete()} usedKeys={usedKeys}/>
                            </div>
                        }
                    </div>
                </main>
            </div>

            {showModal && (
                <SuccessModal
                    solution={solution}
                    isWon={gameStatus === GAME_STATUS.WON}
                    attempts={guesses.length.toString()}
                    onShare={() => shareScore()}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
