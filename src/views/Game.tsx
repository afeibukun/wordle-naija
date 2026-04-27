"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGame} from "@/src/hooks/useGame";
import {GAME_STATUS, GameLanguage,} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/Modal";
import {useEffect, useState, MouseEvent} from "react";
import {ShareButton} from "@/src/ui/ShareButton";
import {PrimaryButton} from "@/src/ui/PrimaryButton";
import {ProxyKeyboardInput} from "@/src/components/ProxyKeyboardInput";
import HowToPlay from "@/src/components/HowToPlay";
import {Header} from "@/src/components/Header";
import SplashScreen from "@/src/components/SplashScreen";
import {getDailySolution} from "@/src/lib/gameUtils";


export default function GameView() {

    const [showHelp, setShowHelp] = useState(false);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading game assets and dictionary
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const hasSeenHelp = localStorage.getItem('hasSeenHelp');
        if (!hasSeenHelp) {
            setTimeout(() => {
                setShowHelp(true);
            },0);
        }
    }, []);

    const closeHelp = () => {
        setShowHelp(false);
        localStorage.setItem('hasSeenHelp', 'true');
    };

    const {
        currentLanguage,
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
        isOnscreenKeyboardVisible,
        proxyInputRef,
        openProxyKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown,
        enableSurfaceKeyboard,
        showResultsView,
        shareScore,
        handleGameRestart
    } = useGame();

    return (
        <div className="game">
            <div className="min-h-dvh bg-slate-900">
                {(!solution || !isLoaded) && <SplashScreen/>}
                <main
                    className={`transition-opacity duration-750 ${(isLoaded && solution) ? 'opacity-100' : 'opacity-0'} flex flex-col items-center justify-between h-full text-white gap-y-6 md:gap-y-12`}>
                    <div className="w-full">
                    <Header
                        currentLanguage={currentLanguage}
                        appNotice={appNotice}
                        onLanguageChange={(newLanguage) => handleGameRestart(newLanguage)}
                        onShowHelp={() => setShowHelp(true)}
                    />
                    </div>

                    {showHelp && <HowToPlay onClose={closeHelp}/>}
                    <div className="w-full">
                    <div className="px-2 md:px-4 pt-2 pb-8 md:pt-12 md:pb-20">
                        {solution && (
                        <div className="flex flex-col items-center justify-center">
                            <div>
                                <div className="pb-10">
                                    <div onClick={(e: MouseEvent<HTMLDivElement>) => openProxyKeyboard(e)}>
                                        <Grid
                                            guesses={guesses}
                                            currentGuess={currentGuess}
                                            solution={solution}
                                            currentGuessIsShaking={isShaking}
                                            gameStatus={gameStatus}
                                        />
                                    </div>
                                </div>
                                <ProxyKeyboardInput
                                    inputRef={proxyInputRef}
                                    onChange={onProxyInputChange}
                                    onKeyDown={onProxyInputKeyDown}
                                    enableSurfaceKeyboard={enableSurfaceKeyboard}
                                />
                            </div>
                            {(gameStatus !== GAME_STATUS.PLAYING && showResultsView && !showSuccessModal) &&
                                <div className="px-4 md:px-24">
                                    <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-100">
                                        {gameStatus === GAME_STATUS.WON ? "🎉 YOU Have Completed the game!" : "😔 Better Luck Next Time!"}
                                    </h2>
                                    <div className="space-y-3 md:space-y-4 text-slate-900">
                                        <ShareButton label="SHARE YOUR SCORE" onShare={() => shareScore()}/>
                                        <div>
                                            <PrimaryButton label="PLAY AGAIN" onClick={() => window.location.reload()}/>
                                            <p className="text-[10px] md:text-sm text-slate-400 mt-2">Wordle Solution
                                                Refreshes daily</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="toast-container relative w-full">
                                {(toastMsg) && (<GameToast message={toastMsg}/>)}
                            </div>
                            {isOnscreenKeyboardVisible &&
                                <div>
                                    <Keyboard onChar={(char: string) => onChar(char)} onEnter={() => onEnter()}
                                              onDelete={() => onDelete()} usedKeys={usedKeys}/>
                                </div>
                            }
                        </div>
                            ) }
                    </div>
                    </div>
                </main>
            </div>

            {((showResultsView && showSuccessModal) && (
                    <SuccessModal
                        isWon={gameStatus === GAME_STATUS.WON}
                        attempts={guesses.length.toString()}
                        currentLanguage={currentLanguage}
                        onShare={() => shareScore()}
                        onClose={() => closeSuccessModal()}
                        onRestart={(newLanguage) => handleGameRestart(newLanguage)}
                    />)
            )}
        </div>
    );
}
