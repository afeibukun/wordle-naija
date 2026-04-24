import {Share2} from "lucide-react";

interface SuccessModalProp {
    solution: string,
    isWon: boolean,
    attempts: string,
    onShare: () => Promise<void>,
    onClose: () => void,
}

export default function SuccessModal({solution, isWon, attempts, onShare, onClose}: SuccessModalProp) {
    return (
        <div
            className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[100] animate-in fade-in zoom-in duration-300">
            <div
                className="bg-slate-900 p-8 rounded-2xl border-2 border-slate-700 text-center max-w-sm w-full shadow-2xl">
                <div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
                <h2 className="text-3xl font-black mb-4 text-slate-100">
                    {isWon ? "🎉 YOU SABI!" : "😔 OBAKPE!"}
                </h2>
                <p className="text-slate-400 mb-2">The word was:</p>
                <p className="text-2xl font-bold text-green-500 uppercase tracking-widest mb-6">{solution}</p>

                <div className="bg-slate-800 p-4 rounded-lg mb-6">
                    <p className="text-sm text-slate-300">Attempts: {attempts}/6</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onShare}
                        className="w-full py-4 bg-slate-300 hover:bg-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>SHARE SCORE</span>
                        <Share2 className="w-5 h-5" /> {/* Use a small icon here */}
                    </button>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 font-bold rounded-xl transition-all"
                >
                    PLAY AGAIN
                </button>
                </div>

            </div>
        </div>

    );
}
