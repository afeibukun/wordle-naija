import {GameLanguage} from "@/src/types/game";
import {UI_STRINGS} from "@/src/data/translations";

export function useTranslation(lang: GameLanguage) {
    const translation = (key: keyof typeof UI_STRINGS['en']) => {
        return UI_STRINGS[lang][key] || UI_STRINGS['en'][key];
    };

    return { translation };
}