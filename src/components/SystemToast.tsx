// components/SystemToast.tsx
export default function SystemToast({ message }: { message: string }) {
    return (
        <div className="system-toast fixed w-max max-w-[90%] md:max-w-sm top-20 md:top-32 right-1/2 translate-x-1/2 z-[110] bg-slate-800 text-white border border-slate-700 px-2 md:px-6 py-2 md:py-4 rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-right-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="flex-1"><span className="font-normal md:font-medium text-sm md:text-base">{message}</span></div>
        </div>
    );
}
