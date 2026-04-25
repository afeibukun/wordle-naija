import {Share2} from "lucide-react";

interface ShareButtonProps {
    onShare?: () => void;
    label: string
}

export const ShareButton = ({onShare, label}: ShareButtonProps) => {
    return (

        <button
            onClick={onShare}
            className="w-full py-3 md:py-4 bg-slate-300 hover:bg-slate-400 font-bold text-sm md:text-base rounded-lg md:rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
            <span>{label}</span>
            <Share2 className="w-4 md:w-5 h-4 md:h-5"/> {/* Use a small icon here */}
        </button>
    )
}