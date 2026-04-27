import {
    CELL_STATUS,
    GAME_STATUS,
    GameLanguage,
    GameStatus,
    Guess, GUESS_STATUS,
    GuessStatus, RESULT_VIEW, ResultView,
    Tile,
    TileStatus
} from "@/src/types/game";
import {useCallback, useEffect, useMemo, useState} from "react";
import dictionary from "@/src/data/dictionary.json";
import {useKeyboard} from "@/src/hooks/useKeyboard";
import {getDailySolution} from "@/src/lib/gameUtils";
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

interface UseGameLogicProps {
    language: GameLanguage;
}

export function useGame() {
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameStatus, setGameStatus] = useState<GameStatus>(GAME_STATUS.PLAYING);
    const [usedKeys, setUsedKeys] = useState<Record<string, TileStatus>>({});

    const [toastMsg, setToastMsg] = useState<string | null>("");
    const [appNotice, setAppNotice] = useState<string | null>("");
    const [isShaking, setIsShaking] = useState(false);

    const [showResultsView, setShowResultsView] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    // if the surface keyboard is active, the proxy keyboard should not be active and vice versa

    const [guessStatus, setGuessStatus] = useState<GuessStatus>(GUESS_STATUS.TYPING);

    const showSystemNotice = (msg: string) => {
        setAppNotice(msg)
        setTimeout(() => setAppNotice(null), 2000);
    }

    const {currentLanguage, solution, handleLanguageChange} = useGameSetting({showSystemNotice})

    const handleGameRestart = (newLang: GameLanguage) => {
        // 1. Update the language state
        handleLanguageChange(newLang, `Started new game in ${LANG_NAMES[newLang].toUpperCase()}` );

        // 3. Reset all game states
        setGuesses([]);
        setCurrentGuess("");
        setGameStatus(GAME_STATUS.PLAYING);
        setGuessStatus(GUESS_STATUS.TYPING);
        setUsedKeys({});
        setShowSuccessModal(false);

    };

    // Memoize dictionary for O(1) lookup speed
    const validWords = useMemo(() => new Set(dictionary[currentLanguage]), [currentLanguage]);

    // Show a toast message temporarily
    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const updateUsedKeys = (formattedGuess: Tile[]) => {
        setUsedKeys((prev) => {
            const newKeys = {...prev};

            formattedGuess.forEach(({char, status}) => {
                const currentStatus = newKeys[char];

                // Logic: Only update if the new status is "better" than the old one
                if (status === CELL_STATUS.CORRECT) {
                    newKeys[char] = CELL_STATUS.CORRECT;
                } else if (status === CELL_STATUS.PRESENT && currentStatus !== CELL_STATUS.CORRECT) {
                    newKeys[char] = CELL_STATUS.PRESENT;
                } else if (status === CELL_STATUS.ABSENT && !currentStatus) {
                    newKeys[char] = CELL_STATUS.ABSENT;
                }
            });

            return newKeys;
        });
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

    const displayResultsView = useCallback((resultView: ResultView) => {
        setShowResultsView(true);
        if (resultView === RESULT_VIEW.MODAL) {
            openSuccessModal();
        }
    }, [openSuccessModal]);


    // Logic to add letters, backspace, and submit would go here
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
        console.log(new Date().toISOString(), "The guess is being submitted, so keyboards should freeze now.");
        // 4. If valid, submit the guess
        const formattedCurrentGuess = formatGuess(currentGuess, solution);
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
                    displayResultsView(RESULT_VIEW.MODAL);
                }, 1000);
            }, 1200);
        } else if (guesses.length >= 5) { // 5 because we just added the 6th
            setTimeout(() => {
                showSystemNotice("Better Luck Next Time");
                setGameStatus(GAME_STATUS.LOST);
                setTimeout(() => {
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
    }, [gameStatus, currentGuess, validWords, solution, guesses.length, displayResultsView]);

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    }

    const isKeyboardActive = (gameStatus === GAME_STATUS.PLAYING && guessStatus === GUESS_STATUS.TYPING);
    const isOnscreenKeyboardVisible = (gameStatus === GAME_STATUS.PLAYING || showSuccessModal ||
        (!showResultsView && (gameStatus === GAME_STATUS.LOST || gameStatus === GAME_STATUS.WON)));

    const {
        proxyInputRef,
        surfaceKeyboardActive,
        openProxyKeyboard,
        enableSurfaceKeyboard,
        onProxyInputChange,
        onProxyInputKeyDown
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

interface GameSettingProps {
    showSystemNotice: (msg: string) => void;
}

export function useGameSetting({showSystemNotice}: GameSettingProps) {
    const [currentLanguage, setCurrentLanguage] = useState<GameLanguage>("pid");
    const [solution, setSolution] = useState<string | null>(null);

    const startNewGame = (newLang: GameLanguage) => {
        const word = getDailySolution(newLang);
        setSolution(word);
        // Resetting game logic happens here
    };

    const handleLanguageChange = (newLanguage: GameLanguage, systemMessage?:string) => {
        setCurrentLanguage(newLanguage);
        localStorage.setItem('wordle-naija-lang', newLanguage);
        startNewGame(newLanguage);

        let msg = systemMessage
        if(!msg) msg =  `Switched to ${LANG_NAMES[newLanguage].toUpperCase()}`
        showSystemNotice(msg);
    };

    useEffect(() => {
        // Initialize solution on mount
        const savedLanguage = localStorage.getItem('wordle-naija-lang') as GameLanguage;
        const initialLanguage = savedLanguage || 'pid';

        setTimeout(() => {
            setCurrentLanguage(initialLanguage);
            startNewGame(initialLanguage)
        }, 0)
    }, []);

    return {
        currentLanguage, solution, handleLanguageChange,
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
};


