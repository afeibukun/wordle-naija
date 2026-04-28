import SystemToast from "@/src/components/SystemToast";
import LanguageIndicator from "@/src/components/LanguageIndicator";
import {GameLanguage, LANGUAGES} from "@/src/types/game";
import {Globe, HelpCircle} from "lucide-react";
import {LANG_NAMES} from "@/src/data/constant";
import {useEffect, useRef, useState} from "react";

interface HeaderProps {
    appNotice: string | null;
    currentLanguage: GameLanguage;
    onLanguageChange: (language: GameLanguage) => void;
    onShowHelp: () => void;
}

export const Header = ({appNotice, currentLanguage, onLanguageChange, onShowHelp}: HeaderProps) => {
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
                setIsLanguageMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="w-full mx-auto">
            <div className="nav-wrapper px-2 md:px-4 py-1.5 md:py-2 border-b border-slate-800">
                <nav className="flex items-center justify-between">
                    {/* LEFT: Help/Info */}
                    <div className="flex-1">
                        <button
                            onClick={onShowHelp}
                            className="inline-flex items-center gap-2 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <HelpCircle className="size-5"/>
                            <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-widest">How To Play</span>
                        </button>
                    </div>
                    {/* CENTER: Branding */}
                    <div className="flex-none">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-4xl font-black tracking-widest uppercase">Wordle <span
                                className="text-green-500">Naija</span></h1>
                        </div>
                    </div>

                    {/* RIGHT: Language Selector */}
                    <div className="flex-1 flex justify-end items-center gap-2">
                        <div className="relative group pb-1">
                            <button
                                className="flex items-center gap-1.5 bg-slate-800/50 px-1 md:px-3 py-1 md:py-1.5 rounded-full border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                onMouseEnter={() => setIsLanguageMenuOpen(true)}
                            >
                                <Globe className="size-4 text-slate-400"/>
                                <span
                                    className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-widest text-slate-200">
                                Select Language
                            </span>
                            </button>
                            {/* Simple Hover/Click Dropdown */}
                            {isLanguageMenuOpen && (
                                <div
                                    className="absolute right-0 top-full mt-0 w-32  bg-slate-900 border border-slate-700 rounded-xl shadow-2xl md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none md:group-hover:pointer-events-auto transition-opacity z-50 animate-in fade-in slide-in-from-top-2"
                                    onMouseLeave={() => setIsLanguageMenuOpen(false)}
                                >
                                    <div className="p-1">
                                        {LANGUAGES.map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => {
                                                    onLanguageChange(l as GameLanguage);
                                                    setIsLanguageMenuOpen(false);
                                                }
                                                }
                                                className={`w-full text-left px-3 py-2 text-[10px] font-black uppercase rounded-lg hover:bg-slate-800 cursor-pointer
                                        ${currentLanguage === l ? 'text-green-500' : 'text-slate-400'}`}
                                            >
                                                {LANG_NAMES[l].toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {(appNotice) && (<SystemToast message={appNotice}/>)}
            <div className="mt-2 md:mt-4">
                <div className="flex flex-row gap-2 justify-center items-center">
                    <div className="">
                        <h2 className="text-sm md:text-base font-semibold tracking-widest uppercase text-center text-slate-400">Daily
                            Puzzle</h2>
                    </div>
                    <LanguageIndicator current={currentLanguage}/>
                </div>
            </div>
        </header>
    )
}