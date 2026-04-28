import {ShareButton} from "@/src/ui/ShareButton";
// import {PrimaryButton} from "@/src/ui/PrimaryButton";
interface Props {
    onShare: () => void;
}
export const ResultAction = ({onShare}:Props) => {
    return(
        <div className="space-y-3">
            <ShareButton label="SHARE SCORE" onShare={onShare}/>
            <div>
                {/*<PrimaryButton label="PLAY AGAIN" onClick={() => window.location.reload()}/>*/}
                <p className="text-[10px] md:text-sm text-slate-400 mt-2 text-center ">Wordle Solution Refreshes Daily</p>
            </div>
        </div>
    )
}