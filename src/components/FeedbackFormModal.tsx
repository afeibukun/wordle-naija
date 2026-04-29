// components/FeedbackForm.tsx
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
                    <SectionFooterBranding/>
                </form>
            </div>
        </div>
    );
}
