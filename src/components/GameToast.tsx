export default function GameToast({ message }: { message: string }) {
    return (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-100 text-slate-900 px-4 py-2 rounded shadow-lg font-bold animate-bounce">
            {message}
        </div>
    );
}
