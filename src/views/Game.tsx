"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGameLogic} from "@/src/hooks/useGameLogic";
import {GAME_STATUS, GameLanguage,} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/Modal";
import SystemToast from "@/src/components/SystemToast";
import {useEffect, useRef, useState, MouseEvent} from "react";
import {getDailySolution} from "@/src/lib/gameUtils";
import LanguageIndicator from "@/src/components/LanguageIndicator";
import {ShareButton} from "@/src/ui/ShareButton";
import {PrimaryButton} from "@/src/ui/PrimaryButton";
import {HiddenInput} from "@/src/components/HiddenInput";


export default function GameView() {
    const [currentLanguage] = useState<GameLanguage>("pid");

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
        showModal,
        closeModal,
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
                    className="flex flex-col items-center justify-between h-full text-white gap-y-6 md:gap-y-12 p-2 md:p-4 py-8 md:py-20">
                    <header className="py-2 md:py-4">
                        <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase">Wordle <span
                            className="text-green-500">Naija</span></h1>
                        {appNotice && (<SystemToast message={appNotice}/>)}
                        <div>
                            <LanguageIndicator current={currentLanguage}/>
                        </div>
                    </header>
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
                        {(gameStatus !== GAME_STATUS.PLAYING && !showModal) &&
                            <div className="px-4">
                                <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-100">
                                    {gameStatus === GAME_STATUS.WON ? "🎉 YOU Have Completed the game!" : "😔 Better Luck Next time!"}
                                </h2>
                                <div className="space-y-3 md:space-y-4 text-slate-900">
                                    <ShareButton label="SHARE YOUR SCORE" onShare={() => shareScore()}/>
                                    <PrimaryButton label="PLAY AGAIN" onClick={() => window.location.reload()}/>
                                </div>
                            </div>
                        }
                        <div className="toast-container relative w-full">
                            {(toastMsg) && (<GameToast message={toastMsg}/>)}
                        </div>
                        {(gameStatus === GAME_STATUS.PLAYING || showModal) &&
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
                    onClose={() => closeModal()}
                />
            )}
        </div>
    );
}
