import SystemToast from "@/src/components/SystemToast";
import LanguageIndicator from "@/src/components/LanguageIndicator";
import {GameLanguage, LANGUAGES} from "@/src/types/game";
import {Globe, HelpCircle, Info, LucideIcon, Menu, MessageSquare, MessageSquarePlus, Settings, X} from "lucide-react";
import {LANG_NAMES} from "@/src/data/constant";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "@/src/hooks/useTranslation";

interface HeaderProps {
    appNotice: string | null;
    currentLanguage: GameLanguage;
    onLanguageChange: (language: GameLanguage) => void;
    onShowHelp: () => void;
    openFeedbackForm: () => void;
}

export const Header = ({appNotice, currentLanguage, onLanguageChange, onShowHelp, openFeedbackForm}: HeaderProps) => {
    const {translation} = useTranslation(currentLanguage);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageMenuRef = useRef<HTMLDivElement>(null);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
                setIsLanguageMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isNavOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
                setIsNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isNavOpen]);

    return (
        <header className="w-full mx-auto">
            <div>
                <div className="nav-wrapper px-2 md:px-4 py-1.5 md:py-2 border-b border-slate-800">
                    <nav className="flex items-center justify-between">
                        {/* LEFT: Help/Info */}
                        <div className="flex-1">
                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsNavOpen(true)}
                                className="md:hidden p-2 text-slate-400 hover:text-white"
                            >
                                <Menu size={24}/>
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onShowHelp}
                                    className="hidden md:inline-flex items-center gap-2 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <HelpCircle className="size-5"/>
                                    <span
                                        className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-widest">{translation('howToPlay')}</span>
                                </button>
                                <button
                                    className="hidden md:flex items-center gap-1.5 bg-slate-800/50 px-1 md:px-3 py-1 md:py-1.5 rounded-full border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                                    onClick={() => openFeedbackForm()}
                                >
                                    <MessageSquarePlus className="size-4 text-slate-400"/>
                                    <span
                                        className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-widest text-slate-200">
                                Send Feedback
                            </span>
                                </button>
                            </div>
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

                    {/* MOBILE SLIDE-OUT DRAWER */}
                    <div
                        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
                            isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        {/* Backdrop overlay */}
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"/>

                        {/* Drawer Content */}
                        <div
                            ref={navRef}
                            className={`absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
                                isNavOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="text-sm md:text-base font-black tracking-widest uppercase">Wordle <span
                                        className="text-green-500">Naija</span></h4>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Menu</h2>

                                </div>
                                <button onClick={() => setIsNavOpen(false)} className="text-slate-400">
                                    <X size={20}/>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <NavItem
                                    icon={HelpCircle}
                                    label="How to Play"
                                    onClick={() => {
                                        onShowHelp();
                                        setIsNavOpen(false);
                                    }}
                                />
                                {/*<NavItem icon={Info} label="About Wordle NG"/>*/}
                                {/*<NavItem icon={Settings} label="Settings"/>*/}
                                <NavItem
                                    icon={MessageSquare}
                                    label="Feedback"
                                    onClick={() => {
                                        openFeedbackForm();
                                        setIsNavOpen(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
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
            </div>
        </header>
    )
}

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}

const NavItem = ({icon: Icon, label, onClick}: NavItemProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-bold text-sm uppercase tracking-tight"
        >
            <Icon size={18} className="text-green-500"/>
            {label}
        </button>
    );
}