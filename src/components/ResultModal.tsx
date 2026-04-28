import {GameLanguage} from "@/src/types/game";
import {SectionFooterBranding} from "@/src/components/SectionFooterBranding";
import {TryOtherLanguageSection} from "@/src/components/TryOtherLanguageSection";
import {ResultAction} from "@/src/components/ResultAction";

interface ResultModalProp {
    isWon: boolean,
    attempts: string,
    currentLanguage: GameLanguage,
    onShare: () => Promise<void>,
    onClose: () => void,
    onRestart: (languageCode:GameLanguage) => void,
}

export default function ResultModal({isWon, attempts, currentLanguage, onShare, onClose, onRestart}: ResultModalProp) {


    return (
        <div
            className="modal fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100] animate-in fade-in zoom-in duration-300 px-4 md:px-2">
            <div
                className="bg-slate-900 px-4 md:px-8 py-8 md:py-8 rounded-2xl border-2 border-slate-700 text-center max-w-sm w-full shadow-2xl">
                <div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-100">
                    {isWon ? "🎉 YOU SABI!" : "😔 OBAKPE!"}
                </h2>
                {/*<div>*/}
                {/*    <p className="text-slate-400 mb-2">The word was:</p>*/}
                {/*    <p className="text-xl md:text-2xl font-bold text-green-500 uppercase tracking-widest mb-4 md:mb-6">{solution}</p>*/}
                {/*</div>*/}

                <div className="bg-slate-800 p-4 rounded-lg mb-4 md:mb-6">
                    <p className="text-sm text-slate-300">Attempts: {attempts}/6</p>
                </div>
                <ResultAction onShare={onShare} />
                <div className="mb-4"></div>
                <TryOtherLanguageSection currentLanguage={currentLanguage} onRestart={onRestart} />

                <SectionFooterBranding />

            </div>
        </div>

    );
}
