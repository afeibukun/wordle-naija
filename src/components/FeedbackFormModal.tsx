import React, {useState} from 'react';
import {X, Send, MessageSquare, Bug, Heart} from 'lucide-react';
import {submitFeedback} from "@/src/hooks/useFeedback";
import {SectionFooterBranding} from "@/src/components/SectionFooterBranding";
import {GameLanguage} from "@/src/types/game";
import {LANG_NAMES} from "@/src/data/constant";

const CATEGORIES = [
    {id: 'suggestion', label: 'Suggestion', icon: MessageSquare, color: 'text-blue-400'},
    {id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400'},
    {id: 'love', label: 'Compliment', icon: Heart, color: 'text-pink-400'},
];

interface FeedbackFormProps {
    lang: GameLanguage;
    onClose: () => void;
    showSystemNotice: (msg: string) => void;
}

export default function FeedbackFormModal({lang, onClose, showSystemNotice}: FeedbackFormProps) {
    const [category, setCategory] = useState('suggestion');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        const result = await submitFeedback({category, message}, LANG_NAMES[lang]);
        setIsSending(false);

        if (result.success) {
            showSystemNotice("Your feedback has been sent successfully.")
            setTimeout(() => onClose(), 1200);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
                className="bg-slate-900 border border-slate-800 text-slate-300 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => onClose()}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer">
                    <X size={20}/>
                </button>

                <h2 className="text-xl font-black uppercase tracking-tight mb-1">Send Feedback</h2>
                <p className="text-slate-400 text-xs mb-6">Help us make Wordle Naija better!</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Picker */}
                    <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                                    category === cat.id
                                        ? 'bg-slate-800 border-slate-500 ring-1 ring-slate-500'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <cat.icon size={18} className={cat.color}/>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Message Input */}
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What's on your mind?..."
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all resize-none"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSending || !message.trim()}
                        className="w-full py-4 bg-green-600 text-slate-900 hover:bg-green-500 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        ) : (
                            <>
                                <Send size={18}/>
                                <span>SEND FEEDBACK</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 md:mt-8 pt-2 md:pt-6 border-t border-slate-800 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 md:mb-3">
                        Or
                    </p>

                    <a
                        href="mailto:thedesdistrict@:gmail.com"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-full transition-all group"
                    >
                        <div className="p-1.5 bg-slate-900 rounded-full">
                            <svg
                                xmlns="http://w3.org"
                                className="h-3 w-3 text-green-500 group-hover:scale-110 transition-transform"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-slate-300">Shoot me an email</span>
                    </a>

                    <p className="mt-4 text-[9px] text-slate-600 italic">
                        I read every message. Abeg, no spam!
                    </p>
                </div>

                <SectionFooterBranding/>
            </div>
        </div>
    );
}
