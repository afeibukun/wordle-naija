import GameView from "@/src/views/Game";
import {Suspense} from "react";

export default function Home() {
  return (
      <Suspense fallback={<GameViewFallback />}>
        <GameView />
      </Suspense>

    );
}


const GameViewFallback = () => {
  return (
      <div className="w-full max-w-sm mx-auto mt-8 animate-pulse">
        {/* Skeleton for 6 rows */}
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-2 justify-center">
                {/* Skeleton for 5 tiles per row */}
                {[...Array(5)].map((_, j) => (
                    <div
                        key={j}
                        className="w-14 h-14 bg-slate-800/50 rounded-md border-2 border-slate-800"
                    />
                ))}
              </div>
          ))}
        </div>

        {/* Keyboard Skeleton */}
        <div className="mt-12 space-y-2 px-2">
          <div className="h-10 bg-slate-800/50 rounded-lg w-full" />
          <div className="h-10 bg-slate-800/50 rounded-lg w-[90%] mx-auto" />
          <div className="h-10 bg-slate-800/50 rounded-lg w-full" />
        </div>
      </div>
  );
}
