"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGameLogic} from "@/src/hooks/useGameLogic";
import {GAME_STATUS, GameLanguage,} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/Modal";
import {useEffect, useRef, useState, MouseEvent} from "react";
import {getDailySolution} from "@/src/lib/gameUtils";
import {ShareButton} from "@/src/ui/ShareButton";
import {PrimaryButton} from "@/src/ui/PrimaryButton";
import {HiddenInput} from "@/src/components/HiddenInput";
import HowToPlay from "@/src/components/HowToPlay";
import {Header} from "@/src/components/Header";


export default function GameView() {
    const [currentLanguage] = useState<GameLanguage>("pid");

    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const hasSeenHelp = localStorage.getItem('hasSeenHelp');
        if (!hasSeenHelp) {
            setShowHelp(true);
        }
    }, []);

    const closeHelp = () => {
        setShowHelp(false);
        localStorage.setItem('hasSeenHelp', 'true');
    };

    const {
        solution,
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
        showSuccessModal,
        closeSuccessModal,
        inputRef,
        openProxyKeyboard,
        enableSurfaceKeyboard,
        shareScore
    } = useGameLogic({language: currentLanguage});

    if (!solution) return <div className="flex h-screen items-center justify-center">Loading...</div>

    return (
        <div className="game">
            <div className="min-h-dvh bg-slate-900">
                <main
                    className="flex flex-col items-center justify-between h-full text-white gap-y-6 md:gap-y-12">
                    <Header currentLanguage={currentLanguage} appNotice={appNotice} onShowHelp={() => setShowHelp(true)} />
                    {showHelp && <HowToPlay onClose={closeHelp}/>}
                    <div className="px-2 md:px-4 pt-2 pb-8 md:pt-12 md:pb-20">
                        <div className="flex flex-col items-center justify-center">
                            <div>
                                <div className="pb-10">
                                    <div onClick={(e: MouseEvent<HTMLDivElement>) => openProxyKeyboard(e)}>
                                        <Grid
                                            guesses={guesses}
                                            currentGuess={currentGuess}
                                            solution={solution}
                                            currentGuessIsShaking={isShaking}
                                        />
                                    </div>
                                </div>
                                <HiddenInput
                                    inputRef={inputRef}
                                    onChar={(char: string) => onChar(char)}
                                    onEnter={onEnter}
                                    onDelete={onDelete}
                                    enableSurfaceKeyboard={enableSurfaceKeyboard}
                                />
                            </div>
                            {(gameStatus !== GAME_STATUS.PLAYING && !showSuccessModal) &&
                                <div className="px-4">
                                    <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-100">
                                        {gameStatus === GAME_STATUS.WON ? "🎉 YOU Have Completed the game!" : "😔 Better Luck Next time!"}
                                    </h2>
                                    <div className="space-y-3 md:space-y-4 text-slate-900">
                                        <ShareButton label="SHARE YOUR SCORE" onShare={() => shareScore()}/>
                                        <div>
                                        <PrimaryButton label="PLAY AGAIN" onClick={() => window.location.reload()}/>
                                            <p className="text-[10px] md:text-sm text-slate-400 mt-2">Wordle Solution Refreshes daily</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="toast-container relative w-full">
                                {(toastMsg) && (<GameToast message={toastMsg}/>)}
                            </div>
                            {(gameStatus === GAME_STATUS.PLAYING || showSuccessModal) &&
                                <div>
                                    <Keyboard onChar={(char: string) => onChar(char)} onEnter={() => onEnter()}
                                              onDelete={() => onDelete()} usedKeys={usedKeys}/>
                                </div>
                            }
                        </div>
                    </div>
                </main>
            </div>

            {(showSuccessModal && (
                <SuccessModal
                    solution={solution}
                    isWon={gameStatus === GAME_STATUS.WON}
                    attempts={guesses.length.toString()}
                    onShare={() => shareScore()}
                    onClose={() => closeSuccessModal()}
                /> )
            )}
        </div>
    );
}
