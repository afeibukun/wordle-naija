export default function GameToast({ message }: { message: string }) {
    return (
        <div className="game-toast absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-100 text-slate-900 px-2 md:px-4 py-2 rounded shadow-lg text-sm md:text-base font-bold animate-bounce">
            {message}
        </div>
    );
}
