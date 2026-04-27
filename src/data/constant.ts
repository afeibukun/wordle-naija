import {GameLanguage} from "@/src/types/game";

export const GAME_LANGUAGES =  ['pid', 'yo', 'ig', 'ha'] as GameLanguage[];

export const LANG_NAMES: Record<GameLanguage, string> = {
    pid: 'Nigerian Pidgin',
    yo: 'Yorùbá',
    ig: 'Igbo',
    ha: 'Hausa',
};