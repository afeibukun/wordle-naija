import {GameLanguage, Tile} from "@/src/types/game";
import GameRow from "@/src/components/GameRow";
import {useTranslation} from "@/src/hooks/useTranslation";

interface Props {
    lang:GameLanguage;
    onClose: () => void;
}
export default function HowToPlayModal({lang, onClose}: Props) {
    // Example data for the visual guides
    const exampleCorrect: Tile[] = [
        {char: 'A', status: 'correct'},
        {char: 'W', status: 'empty'},
        {char: 'O', status: 'empty'},
        {char: 'O', status: 'empty'},
        {char: 'F', status: 'empty'},
    ];

    const examplePresent: Tile[] = [
        {char: 'P', status: 'empty'},
        {char: 'I', status: 'present'},
        {char: 'K', status: 'empty'},
        {char: 'I', status: 'empty'},
        {char: 'N', status: 'empty'},
    ];

    const exampleAbsent: Tile[] = [
        {char: 'K', status: 'empty'},
        {char: 'A', status: 'empty'},
        {char: 'M', status: 'empty'},
        {char: 'P', status: 'absent'},
        {char: 'E', status: 'empty'},
    ];

    const { translation } = useTranslation(lang);

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div
                className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300">

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    ✕
                </button>

                <div className="app-title text-left mb-2 space-y-4">
                    <h1 className="text-sm md:text-base font-black tracking-tight uppercase">
                        <span className="text-slate-100">Wordle</span> <span
                        className="text-green-500">Naija</span></h1>
                    <h2 className="text-lg md:text-xl font-black tracking-tight uppercase">
                        <span className="text-slate-300">{translation('howToPlay')}</span> </h2>
                </div>

                <div className="space-y-2 mb-6 list-disc">
                    <p className="text-slate-300 text-sm md:text-base font-bold">
                        <span className="relative mr-3 px-3 h-8 inline-flex items-center bg-slate-700 rounded-l-lg before:content-[''] before:absolute before:left-full before:top-[-1px] before:h-0 before:w-0  before:border-y-[17px] before:border-y-transparent before:border-l-[12px] before:border-l-slate-700">The  Goal:</span>  {translation('guessTheWord')}
                    </p>
                    <p className="text-slate-300 text-[12px] md:text-sm">- Each attempts must be a valid 5-letter word in
                        the stated language. (E.g Pidgin)</p>
                    <p className="text-slate-300 text-[12px] md:text-sm">- The color of the tiles will change to show you
                        how close your guess was to the solution of the wordle.</p>
                </div>

                <div className="space-y-6">
                    {/* Example 1: Correct */}
                    <div>
                        <div className="scale-75 origin-left mb-1">
                            <GameRow guess={exampleCorrect} isAnimationEnabled={false}/>
                        </div>
                        <p className="text-[12px] md:text-sm text-slate-400">
                            <span className="text-white font-bold uppercase">A</span> is in the word and in the correct
                            spot.
                        </p>
                    </div>

                    {/* Example 2: Present */}
                    <div>
                        <div className="scale-75 origin-left mb-1">
                            <GameRow guess={examplePresent} isAnimationEnabled={false}/>
                        </div>
                        <p className="text-[12px] md:text-sm text-slate-400">
                            <span className="text-white font-bold uppercase">I</span> is in the word but in the wrong
                            spot.
                        </p>
                    </div>
                    {/* Example 3: Present */}
                    <div>
                        <div className="scale-75 origin-left mb-1">
                            <GameRow guess={exampleAbsent} isAnimationEnabled={false}/>
                        </div>
                        <p className="text-[12px] md:text-sm text-slate-400">
                            <span className="text-white font-bold uppercase">P</span> is not in the word in any spot.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-2 md:py-3 bg-white text-black font-black rounded-lg md:rounded-xl hover:bg-slate-200 transition-colors"
                >
                    LET&#39;S GO!
                </button>
            </div>
        </div>
    );
}
