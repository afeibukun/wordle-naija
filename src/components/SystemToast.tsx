// components/SystemToast.tsx
export default function SystemToast({ message }: { message: string }) {
    return (
        <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white border border-slate-700 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">{message}</span>
        </div>
    );
}
