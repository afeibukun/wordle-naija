import {GameLanguage} from '@/src/types/game';

const LANG_NAMES: Record<GameLanguage, string> = {
    pid: 'Nigerian Pidgin',
    yo: 'Yorùbá',
    ig: 'Igbo',
    ha: 'Hausa',
};

export default function LanguageIndicator({current}: { current: GameLanguage }) {
    return (
        <div className="language-indicator flex flex-col items-center gap-1 mb-2 md:mb-6 animate-in fade-in slide-in-from-top-1">
            <span className="hidden text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Current Language
            </span>
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 mt-2 md:mt-4 px-2.5 md:px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] md:text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    {LANG_NAMES[current]}
                </span>
            </div>
        </div>
    );
}
