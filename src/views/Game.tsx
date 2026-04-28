"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGame} from "@/src/hooks/useGame";
import {GAME_STATUS, GameLanguage, GameStatus} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/ResultModal";
import {useEffect, useState, MouseEvent} from "react";
import {ShareButton} from "@/src/ui/ShareButton";
import {PrimaryButton} from "@/src/ui/PrimaryButton";
import {ProxyKeyboardInput} from "@/src/components/ProxyKeyboardInput";
import HowToPlayModal from "@/src/components/HowToPlayModal";
import {Header} from "@/src/components/Header";
import SplashScreen from "@/src/components/SplashScreen";
import {ResultAction} from "@/src/components/ResultAction";
import {TryOtherLanguageSection} from "@/src/components/TryOtherLanguageSection";


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
            }, 0);
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

    const isGameReady = !!solution && isLoaded;
    const isInPageNotificationVisible = ((gameStatus !== GAME_STATUS.PLAYING && showResultsView && !showSuccessModal) || (gameStatus === GAME_STATUS.REVIEW))

    return (
        <div className="game">
            <div className="min-h-dvh bg-slate-900">
                {(!isGameReady) && <SplashScreen/>}
                <main
                    className={`transition-opacity duration-750 ${(isGameReady) ? 'opacity-100' : 'opacity-0'} flex flex-col items-center justify-between h-full text-white gap-y-6 md:gap-y-12`}>
                    <div className="w-full">
                        <Header
                            currentLanguage={currentLanguage}
                            appNotice={appNotice}
                            onLanguageChange={(newLanguage) => handleGameRestart(newLanguage)}
                            onShowHelp={() => setShowHelp(true)}
                        />
                    </div>

                    {showHelp && <HowToPlayModal onClose={closeHelp}/>}
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
                                    <div className="toast-container relative w-full">
                                        {(isInPageNotificationVisible) && (
                                            <ResultSummary
                                                gameStatus={gameStatus}
                                                currentLanguage={currentLanguage}
                                                shareScore={shareScore}
                                                handleGameRestart={(newLanguage) => handleGameRestart(newLanguage)}
                                            />
                                        )}
                                        {(toastMsg) && (<GameToast message={toastMsg}/>)}
                                    </div>
                                    {isOnscreenKeyboardVisible &&
                                        <div>
                                            <Keyboard onChar={(char: string) => onChar(char)} onEnter={() => onEnter()}
                                                      onDelete={() => onDelete()} usedKeys={usedKeys}/>
                                        </div>
                                    }
                                </div>
                            )}
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

interface ResultSummaryProps {
    gameStatus: GameStatus;
    currentLanguage: GameLanguage;
    shareScore: () => void;
    handleGameRestart: (lang: GameLanguage) => void;
}

const ResultSummary = ({gameStatus, currentLanguage, shareScore, handleGameRestart}: ResultSummaryProps) => {
    return (
        <div className="px-8 md:px-24 text-slate-900">
            <div>
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-300">
                    { gameStatus === GAME_STATUS.WON ? "🎉 YOU Have Completed the game!"
                        : gameStatus === GAME_STATUS.REVIEW ? "🥂 You already solved the puzzle for today"
                            : "😔 Better Luck Next Time!"
                    }
                </h2>
            </div>
            <ResultAction onShare={() => shareScore()}/>
            <div className="mb-4"></div>
            <TryOtherLanguageSection currentLanguage={currentLanguage}
                                     onRestart={(newLanguage) => handleGameRestart(newLanguage)}/>
        </div>
    )
}