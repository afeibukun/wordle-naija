interface PrimaryButtonProps {
    label: string;
    onClick: () => void;
}
export const PrimaryButton = ({label, onClick}:PrimaryButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="w-full py-3 md:py-4 bg-green-600 hover:bg-green-500 font-bold text-sm md:text-base rounded-lg md:rounded-xl transition-all cursor-pointer"
        >
            {label}
        </button>
    )
}