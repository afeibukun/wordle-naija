import SystemToast from "@/src/components/SystemToast";
import LanguageIndicator from "@/src/components/LanguageIndicator";
import {GameLanguage} from "@/src/types/game";

interface HeaderProps {
    appNotice: string | null;
    currentLanguage: GameLanguage;
    onShowHelp: () => void;
}

export const Header = ({appNotice, currentLanguage, onShowHelp}: HeaderProps) => {
    return (
        <header className="w-full py-2 md:py-4">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase">Wordle <span
                    className="text-green-500">Naija</span></h1>
            </div>
            {(appNotice) && (<SystemToast message={appNotice}/>)}
            <div className="mt-2 md:mt-4">
            <div className="flex flex-row gap-2 justify-center items-center">
                <LanguageIndicator current={currentLanguage}/>
                <div>
                <button
                    onClick={onShowHelp}
                    className="group flex items-center justify-center h-7 md:h-8 gap-x-2 px-3 py-2 rounded-full border border-slate-700 bg-slate-800/30 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200 mx-auto cursor-pointer"
                    title="How to play"
                >
                    <span className="text-slate-400 group-hover:text-white font-serif italic text-sm md:text-lg leading-none">i</span>
                    <span className="text-[12px] md:text-sm">How to play</span>
                </button>
                </div>
            </div>
            </div>
        </header>
    )
}