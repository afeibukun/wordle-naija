import {
    CELL_STATUS,
    GAME_STATUS,
    GameLanguage,
    GameStatus,
    Guess,
    GUESS_STATUS,
    GuessStatus, LANGUAGES,
    RESULT_VIEW,
    ResultView
} from "@/src/types/game";
import {useCallback, useEffect, useMemo, useState} from "react";
import dictionary from "@/src/data/dictionary.json";
import {useKeyboard, useOnscreenKeyboard} from "@/src/hooks/useKeyboard";
import {getDailySolution, getStorageKey} from "@/src/lib/gameUtils";
import {LANG_NAMES} from "@/src/data/constant";

export const formatGuess = (guess: string, solution: string) => {
    const solutionArray = [...solution.toLowerCase()];
    const guessArray = [...guess.toLowerCase()];

    // Initialize statuses as 'absent'
    const formattedGuess: Guess = guessArray.map((l) => ({
        char: l,
        status: CELL_STATUS.ABSENT,
    }));

    // 1. Find CORRECT (Green) matches first
    guessArray.forEach((letter, i) => {
        if (solutionArray[i] === letter) {
            formattedGuess[i].status = CELL_STATUS.CORRECT;
            solutionArray[i] = ""; // "Use up" this letter so it's not matched again
        }
    });

    // 2. Find PRESENT (Orange) matches for remaining letters
    guessArray.forEach((letter, i) => {
        if (formattedGuess[i].status !== CELL_STATUS.CORRECT && solutionArray.includes(letter)) {
            formattedGuess[i].status = CELL_STATUS.PRESENT;
            solutionArray[solutionArray.indexOf(letter)] = ""; // "Use up" the letter
        }
    });

    return formattedGuess;
};

// interface UseGameProps {
//     language: GameLanguage;
// }

export const useGame = () => {
    const {
        toastMsg,
        appNotice,
        isShaking,
        showResultsView,
        showSuccessModal,
        triggerShake,
        showToast,
        showSystemNotice,
        displayResultsView,
        closeSuccessModal
    } = useGameNotification();

    const {
        currentLanguage,
        solution,
        savedGuesses,
        savedGameStatus,
        handleLanguageChange
    } = useGameInitializer({showSystemNotice})

    // Memoize dictionary for O(1) lookup speed
    const validWords = useMemo(() => new Set(dictionary[currentLanguage]), [currentLanguage]);

    const {usedKeys, resetUsedKeys, updateUsedKeys} = useOnscreenKeyboard();

    const {
        guesses,
        currentGuess,
        gameStatus,
        guessStatus,
        onChar,
        onDelete,
        onEnter,
        resetGamePlayResource
    } = useGamePlay({
        currentLanguage,
        solution,
        validWords,
        triggerShake,
        showToast,
        updateUsedKeys,
        showSystemNotice,
        savedGuesses,
        savedGameStatus,
        displayResultsView
    })

    const handleGameRestart = (newLang: GameLanguage) => {
        // 1. Update the language state
        handleLanguageChange(newLang, `Started new game in ${LANG_NAMES[newLang].toUpperCase()}`);
        resetGamePlayResource();
        resetUsedKeys();
        closeSuccessModal();
    };

    const isGameCompleted = gameStatus === GAME_STATUS.LOST || gameStatus === GAME_STATUS.WON;

    const isKeyboardActive = (gameStatus === GAME_STATUS.PLAYING && guessStatus === GUESS_STATUS.TYPING);

    const isOnscreenKeyboardVisible = (gameStatus === GAME_STATUS.PLAYING || (showSuccessModal && isGameCompleted) || (guessStatus === GUESS_STATUS.SUBMITTING && isGameCompleted));

    const {
        proxyInputRef,
        surfaceKeyboardActive,
        openProxyKeyboard,
        enableSurfaceKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown,
    } = useKeyboard({
        onChar,
        onDelete,
        onEnter,
        keyboardActive: isKeyboardActive
    });

    const shareScore = async () => {
        const emojiGrid = generateEmojiGrid(guesses);
        const shareText = `Wordle Naija ${guesses.length}/6\n\n${emojiGrid}\n\nPlay at: [https://wordle-naija.netlify.app/]`;

        try {
            // 1. Force a copy to the clipboard first
            await navigator.clipboard.writeText(shareText);

            if (navigator.share) {
                // Best for Mobile (WhatsApp, Twitter, etc.)
                await navigator.share({
                    text: shareText,
                });
            } else {
                // Fallback for Desktop
                // await navigator.clipboard.writeText(shareText);
                showSystemNotice("Result copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return {
        currentLanguage,
        solution,
        guesses,
        currentGuess,
        gameStatus,
        usedKeys,
        toastMsg,
        appNotice,
        isShaking,
        onChar,
        onDelete,
        onEnter,
        showSuccessModal,
        closeSuccessModal,
        isOnscreenKeyboardVisible,
        proxyInputRef,
        openProxyKeyboard,
        surfaceKeyboardActive,
        enableSurfaceKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown,
        showResultsView,
        shareScore,
        handleGameRestart
    }
}

interface GamePlayProps {
    currentLanguage: GameLanguage,
    solution: string | null,
    validWords: Set<string>,
    savedGuesses: Guess[],
    savedGameStatus: GameStatus,
    triggerShake: () => void,
    showToast: (msg: string) => void,
    updateUsedKeys: (guess: Guess) => void,
    showSystemNotice: (msg: string) => void,
    displayResultsView: (resultView: ResultView) => void,
}

export const useGamePlay = ({
                                currentLanguage,
                                solution,
                                validWords,
                                savedGuesses,
                                savedGameStatus,
                                triggerShake,
                                showToast,
                                updateUsedKeys,
                                showSystemNotice,
                                displayResultsView
                            }: GamePlayProps) => {
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");

    const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.PLAYING);
    const [guessStatus, setGuessStatus] = useState<GuessStatus>(GUESS_STATUS.TYPING);

    useEffect(() => {
        const updateSavedGamePlayResource = (savedGuesses: Guess[], savedGameStatus: GameStatus) => {
            let gStatus = savedGameStatus;
            if (gStatus === GAME_STATUS.ERROR) gStatus = GAME_STATUS.PLAYING;
            setTimeout(() => setGuesses(savedGuesses), 0);
            setTimeout(() => setGameStatus(gStatus), 0);
        }
        updateSavedGamePlayResource(savedGuesses, savedGameStatus);
    }, [savedGameStatus, savedGuesses]);

    useEffect(() => {
        if (gameStatus === GAME_STATUS.WON) {
            GameStorageService.storeGameData(currentLanguage, solution, GAME_STATUS.REVIEW, guesses);
        }
    }, [currentLanguage, solution, gameStatus, guesses]);

    const resetGamePlayResource = () => {
        setGuesses([]);
        setCurrentGuess("");
        setGameStatus(GAME_STATUS.PLAYING);
        setGuessStatus(GUESS_STATUS.TYPING);
    }

    // Logic to add letters, backspace, and submit
    const onChar = useCallback((char: string) => {
        if (gameStatus !== GAME_STATUS.PLAYING) return;

        if (currentGuess.length >= 5) return;
        setCurrentGuess(prev => prev + char.toLowerCase());
    }, [currentGuess, gameStatus]);

    const onDelete = useCallback(() => {
        if (gameStatus !== GAME_STATUS.PLAYING) return;
        setCurrentGuess(prev => prev.slice(0, -1));
    }, [gameStatus]);

    const onEnter = useCallback(() => {
        if (gameStatus !== GAME_STATUS.PLAYING) return;

        if (!solution) return;

        // 1. Check if the word is long enough
        if (currentGuess.length !== 5) {
            // console.log("Too short!");
            // TODO: Trigger a "Too short" toast/animation
            triggerShake();
            return;
        }

        // 2. Normalize for dictionary check (lowercase & handle special chars)
        const formattedGuess = currentGuess.toLowerCase();

        // 3. Check if it exists in the selected language's dictionary
        const isValid = validWords.has(formattedGuess);
        if (!isValid) {
            // console.log("Word not in dictionary!");
            showToast("Word not in dictionary!");
            triggerShake();
            return;
        }

        setGuessStatus(GUESS_STATUS.SUBMITTING);
        // console.log(new Date().toISOString(), "The guess is being submitted, so keyboards should freeze now.");
        // 4. If valid, submit the guess
        const formattedCurrentGuess = formatGuess(formattedGuess, solution);
        setGuesses((prev) => [...prev, formattedCurrentGuess]);
        setCurrentGuess(""); // Clear for the next row

        // 5. Check Win/Loss conditions
        updateUsedKeys(formattedCurrentGuess);

        if (formattedGuess === solution.toLowerCase()) {
            // console.log(new Date().toISOString(), "We know you've won, but we are keeping it hush");
            setTimeout(() => {
                // console.log(new Date().toISOString(), "Now we are broadcasting it");
                showSystemNotice("Amazing Work");
                setGameStatus(GAME_STATUS.WON);
                setTimeout(() => {
                    setGuessStatus(GUESS_STATUS.COMPLETED)
                    displayResultsView(RESULT_VIEW.MODAL);
                }, 1000);
            }, 1200);

        } else if (guesses.length >= 5) { // 5 because we just added the 6th
            setTimeout(() => {
                showSystemNotice("Better Luck Next Time");
                setGameStatus(GAME_STATUS.LOST);
                setTimeout(() => {
                    setGuessStatus(GUESS_STATUS.COMPLETED)
                    displayResultsView(RESULT_VIEW.MODAL);
                }, 100);
            }, 1100);
        } else {
            setTimeout(() => {
                // console.log(new Date().toISOString(), "Keyboards are now free for typing again");
                setGuessStatus(GUESS_STATUS.TYPING);
            }, 1200)
        }
        // console.log("Checking word:", currentGuess);
    }, [gameStatus, solution, currentGuess, validWords, guesses, updateUsedKeys, triggerShake, showToast, showSystemNotice, displayResultsView]);

    return {
        guesses,
        currentGuess,
        gameStatus,
        guessStatus,
        onChar, onEnter, onDelete, resetGamePlayResource
    }
}

interface GameInitializerProps {
    showSystemNotice: (msg: string) => void,
}

export const useGameInitializer = ({showSystemNotice}: GameInitializerProps) => {
    const [currentLanguage, setCurrentLanguage] = useState<GameLanguage>("pid");
    const [solution, setSolution] = useState<string | null>(null);
    const [savedGuesses, setSavedGuesses] = useState<Guess[]>([]);
    const [savedGameStatus, setSavedGameStatus] = useState<GameStatus>(GAME_STATUS.ERROR);

    /**
     * Update language state, get daily solution and update solution state
     * @param newLang
     * @return void
     */
    const startNewGame = (newLang: GameLanguage) => {
        setCurrentLanguage(newLang);
        const word = getDailySolution(newLang);
        setSolution(word);
    };

    function isValidGameLanguage(val: string): val is GameLanguage {
        return LANGUAGES.includes(val as GameLanguage);
    }

    const handleLanguageChange = (newLanguage: GameLanguage, systemMessage?: string) => {
        setCurrentLanguage(newLanguage);
        localStorage.setItem('wordle-naija-lang', newLanguage);
        startNewGame(newLanguage);

        let msg = systemMessage
        if (!msg) msg = `Switched to ${LANG_NAMES[newLanguage].toUpperCase()}`
        showSystemNotice(msg);
    };

    const initializeLanguage = useCallback(() => {
        const savedLanguage = localStorage.getItem('wordle-naija-lang') as GameLanguage;
        return (savedLanguage && isValidGameLanguage(savedLanguage)) ? savedLanguage : 'pid';
    }, []);

    const initializeGame = useCallback(() => {
        const language = initializeLanguage();
        // Check if saved Data exist
        const savedData = GameStorageService.checkSavedGameData(language);
        if (savedData) {
            try {
                const {guesses, status, solution} = JSON.parse(savedData);
                setSavedGuesses(guesses);
                setSavedGameStatus(status as GameStatus);
                setSolution(solution);
                // updateGameResource(savedGuesses, status);

                if (status === GAME_STATUS.REVIEW) {
                    showSystemNotice(`You already finished the ${LANG_NAMES[currentLanguage].toUpperCase()} puzzle today!`);
                }
            } catch (e: unknown) {
                if (e instanceof Error) {
                    console.log(e.message);
                } else {
                    console.error(e);
                }
                setTimeout(() => startNewGame(language), 0)
            }
        } else {
            // Fresh game for this language today
            // updateGameResource([] as Guess[], GAME_STATUS.PLAYING);
            setTimeout(() => startNewGame(language), 0)
        }
    }, [currentLanguage, initializeLanguage, showSystemNotice])

    useEffect(() => {
        // Initialize solution on mount
        setTimeout(() => initializeGame(), 0);
    }, []);

    return {
        currentLanguage, solution, savedGuesses, savedGameStatus, handleLanguageChange
    }
}

export const useGameNotification = () => {
    const [toastMsg, setToastMsg] = useState<string | null>("");
    const [appNotice, setAppNotice] = useState<string | null>("");
    const [isShaking, setIsShaking] = useState(false);

    const [showResultsView, setShowResultsView] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const showSystemNotice = (msg: string) => {
        setAppNotice(msg)
        setTimeout(() => setAppNotice(null), 2000);
    }
    // Show a toast message temporarily
    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    }
    const openSuccessModal = useCallback(() => {
        // if (gameStatus !== GAME_STATUS.PLAYING) {
        setShowSuccessModal(true);
        // if (gameStatus === GAME_STATUS.WON)
        // }
    }, []);

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    }

    const displayResultsView = useCallback((resultView: ResultView) => {
        setShowResultsView(true);
        if (resultView === RESULT_VIEW.MODAL) {
            openSuccessModal();
        }
    }, [openSuccessModal]);

    return {
        toastMsg, appNotice, isShaking, showResultsView, showSuccessModal,
        triggerShake,
        showToast,
        showSystemNotice,
        displayResultsView,
        closeSuccessModal
    }
}

export class GameStorageService {

    static storeGameData = (language: GameLanguage, solution: string | null, gameStatus: GameStatus, userGuesses: Guess[]) => {
        const key = getStorageKey(language);
        const data = {
            guesses: userGuesses,
            solution: solution,
            status: gameStatus,
            lastUpdated: new Date().getTime()
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    static checkSavedGameData = (language: GameLanguage) => {
        const savedData = localStorage.getItem(getStorageKey(language));
        return (savedData) ? savedData : null;
    }
}

export const generateEmojiGrid = (guesses: Guess[]) => {
    return guesses
        .map((guess) => {
            return guess
                .map((tile) => {
                    if (tile.status === 'correct') return '🟩';
                    if (tile.status === 'present') return '🟨';
                    return '⬛';
                })
                .join('');
        })
        .join('\n');
}


