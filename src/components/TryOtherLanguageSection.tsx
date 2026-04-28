import {LANG_NAMES} from "@/src/data/constant";
import {GameLanguage, LANGUAGES} from "@/src/types/game";

interface Props {
    currentLanguage: GameLanguage;
    onRestart: (languageCode:GameLanguage) => void;
}
export const TryOtherLanguageSection = ({currentLanguage, onRestart}:Props) => {
    const otherLanguages = LANGUAGES.filter(l => l != currentLanguage);

    return (
        <div className="pt-4 border-t border-slate-700">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Try another language
            </p>
            <div className="grid grid-cols-2 gap-2">
                {otherLanguages.map((langCode) => (
                    <button
                        key={langCode}
                        onClick={() => onRestart(langCode)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold transition-all text-slate-200"
                    >
                        Play in {LANG_NAMES[langCode]}
                    </button>
                ))}
            </div>
        </div>
    )
}