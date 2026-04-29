"use client";
import Grid from "@/src/components/Grid";
import Keyboard from "@/src/components/Keyboard";
import {useGame} from "@/src/hooks/useGame";
import {GAME_STATUS, GameLanguage, GameStatus} from "@/src/types/game";
import GameToast from "@/src/components/GameToast";
import SuccessModal from "@/src/components/ResultModal";
import {useEffect, useState, MouseEvent} from "react";
import {ProxyKeyboardInput} from "@/src/components/ProxyKeyboardInput";
import HowToPlayModal from "@/src/components/HowToPlayModal";
import {Header} from "@/src/components/Header";
import SplashScreen from "@/src/components/SplashScreen";
import {ResultAction} from "@/src/components/ResultAction";
import {TryOtherLanguageSection} from "@/src/components/TryOtherLanguageSection";
import {useTranslation} from "@/src/hooks/useTranslation";
import FeedbackFormModal from "@/src/components/FeedbackFormModal";


export default function GameView() {

    const [showHelp, setShowHelp] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

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
        toastMsg,
        isShaking,
        appNotice,
        showSuccessModal,
        showResultsView,
        usedKeys,
        isOnscreenKeyboardVisible,
        proxyInputRef,
        openProxyKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown,
        enableSurfaceKeyboard,
        onScreenKeyPress,
        closeSuccessModal,
        shareScore,
        handleGameRestart,
        showSystemNotice,
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
                            openFeedbackForm = {() => setShowFeedbackForm(true)}
                        />
                    </div>
                    {showHelp && <HowToPlayModal lang={currentLanguage} onClose={closeHelp}/>}
                    <div className="w-full">
                        <div className="px-2 md:px-4 pt-2 pb-8 md:pt-12 md:pb-20">
                            {solution && (
                                <div className="flex flex-col items-center justify-center">
                                    <div>
                                        <p className="text-slate-300 font-bold text-center mb-1 uppercase tracking-wide">
                                            <span className="inline-flex ms-2 text-[12px] text-slate-400 font-medium">Guess the word in 6 attempts</span>
                                        </p>
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
                                    <div className="result-summary-container max-w-3xl">
                                        {(isInPageNotificationVisible) && (
                                            <ResultSummary
                                                gameStatus={gameStatus}
                                                currentLanguage={currentLanguage}
                                                shareScore={shareScore}
                                                handleGameRestart={(newLanguage) => handleGameRestart(newLanguage)}
                                            />
                                        )}
                                    </div>
                                    <div className="toast-container relative w-full">
                                        {(toastMsg) && (<GameToast message={toastMsg}/>)}
                                    </div>
                                    {isOnscreenKeyboardVisible &&
                                        <div>
                                            <Keyboard usedKeys={usedKeys} onScreenKeyPress={onScreenKeyPress} />
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
                        gameStatus={gameStatus}
                        onShare={() => shareScore()}
                        onClose={() => closeSuccessModal()}
                        onRestart={(newLanguage) => handleGameRestart(newLanguage)}
                    />)
            )}

            { showFeedbackForm && (
                <FeedbackFormModal
                    lang={currentLanguage}
                    onClose={() => {
                        setShowFeedbackForm(false)
                    }}
                    showSystemNotice={showSystemNotice}

                />
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
    const {translation} = useTranslation(currentLanguage);
    return (
        <div className="px-8 md:px-24 text-slate-900">
            <div>
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-300 uppercase">
                    { gameStatus === GAME_STATUS.WON ? "🎉 "+translation("winAlt")
                        : gameStatus === GAME_STATUS.REVIEW ? "🥂 "+translation("alreadySolvedForToday")
                            : "😔 "+translation("betterLuckNextTime")
                    }
                </h2>
            </div>
            <ResultAction
                lang={currentLanguage}
                onShare={() => shareScore()}
                gameStatus={gameStatus}
            />
            <div className="mb-4"></div>
            <TryOtherLanguageSection currentLanguage={currentLanguage}
                                     onRestart={(newLanguage) => handleGameRestart(newLanguage)}/>
        </div>
    )
}