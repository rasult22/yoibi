import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RetroGrid } from "@/components/ui/retro-grid";
import { streams, users } from "@/data/mockData";
import { Eye, Radio } from "lucide-react";

function StreamCard({ stream }) {
  const user = users.find((u) => u.id === stream.userId);

  return (
    <MagicCard className="overflow-hidden p-0" gradientColor="#06b6d410">
      <div className="relative">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-xs font-bold text-white">LIVE</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
          <Eye size={12} className="text-white" />
          <span className="text-xs text-white">
            <NumberTicker value={stream.viewers} />
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
          {stream.title}
        </h3>
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-xs text-muted-foreground">{user.name}</span>
          <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {stream.category}
          </span>
        </div>
      </div>
    </MagicCard>
  );
}

export default function Streams() {
  const totalViewers = streams.reduce((sum, s) => sum + s.viewers, 0);

  return (
    <div className="relative">
      <BlurFade delay={0.1}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Radio size={24} className="text-red-400" />
              Livestreams
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                <NumberTicker value={totalViewers} />
              </span>{" "}
              viewers right now
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-red-600/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium text-red-400">
              {streams.length} Live
            </span>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream, i) => (
          <BlurFade key={stream.id} delay={0.1 + i * 0.05}>
            <StreamCard stream={stream} />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
