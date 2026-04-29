import {ShareButton} from "@/src/ui/ShareButton";
import {GAME_STATUS, GameLanguage, GameStatus} from "@/src/types/game";
import {PrimaryButton} from "@/src/ui/PrimaryButton";
import {useTranslation} from "@/src/hooks/useTranslation";
import {RotateCcw} from "lucide-react";

interface Props {
    lang: GameLanguage;
    gameStatus: GameStatus;
    onShare: () => void;
}

export const ResultAction = ({lang, gameStatus, onShare}: Props) => {
    const { translation } = useTranslation(lang);
    return (
        <div className="space-y-3">
            <ShareButton label="SHARE SCORE" onShare={onShare}/>
            <div>
                {gameStatus === GAME_STATUS.LOST &&
                    <PrimaryButton label={<div className="inline-flex items-center justify-center gap-2">
                    <RotateCcw className="size-4" /> {translation('playAgain')}</div>} onClick={() => window.location.reload()}/>
                }
                <p className="text-[10px] md:text-sm text-slate-400 mt-2 text-center ">Wordle Solution Refreshes
                    Daily</p>
            </div>
        </div>
    )
}