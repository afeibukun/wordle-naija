export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950">
            {/* Branding Logo Area */}
            <div className="relative mb-8 animate-bounce">
                <div className="w-24 h-24 bg-green-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.3)]">
                    <span className="text-5xl font-black text-white">W</span>
                </div>
                {/* Subtle Ring Animation */}
                <div className="absolute inset-0 border-4 border-green-500/20 rounded-2xl animate-ping" />
            </div>

            {/* Game Name */}
            <h1 className="text-3xl font-black tracking-[0.3em] text-white mb-2 uppercase">
                Wordle <span className="text-green-600">Naija</span>
            </h1>

            {/* Loading Progress Indicator */}
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-green-500 animate-loading-bar" />
            </div>

            <p className="mt-4 text-xs font-bold text-slate-500 tracking-widest uppercase">
                Loading Dictionary...
            </p>
        </div>
    );
}
