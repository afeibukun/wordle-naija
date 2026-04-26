export const CELL_STATUS = {
    CORRECT: 'correct', // Green
    PRESENT: 'present', // Orange
    ABSENT: 'absent', // Gray
    EMPTY: 'empty',
} as const;

export type TileStatus = typeof CELL_STATUS[keyof typeof CELL_STATUS];

export interface Tile {
    char: string;
    status: TileStatus;
}

export type Guess = Tile[];

export type GameLanguage = 'pid' | 'yo' | 'ig' | 'ha'; //'en'

export const GAME_STATUS = {
    IDLE: "idle",
    PLAYING: "playing",
    WON: "won",
    LOST: "lost",
    ERROR: "error",
} as const;
export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];

export const GUESS_STATUS = {
    TYPING: 'typing',
    SUBMITTING: 'submitting',
    COMPLETED: 'completed',
} as const
export type GuessStatus = typeof GUESS_STATUS[keyof typeof GUESS_STATUS];

export const RESULT_VIEW = {
    MODAL: "modal",
    FLAT: "flat"
} as const;
export type ResultView = typeof RESULT_VIEW[keyof typeof RESULT_VIEW];