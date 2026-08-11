import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { videos, users, videoCategories } from "@/data/mockData";
import { Play, Eye, Clock } from "lucide-react";

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function VideoCard({ video }) {
  const user = users.find((u) => u.id === video.userId);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MagicCard className="overflow-hidden p-0" gradientColor="#06b6d410">
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="aspect-video w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600/90 backdrop-blur-sm">
              <Play size={20} className="text-white" fill="white" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            {video.duration}
          </span>
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
            {video.title}
          </h3>
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-xs text-muted-foreground">{user.name}</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {formatViews(video.views)}
            </span>
          </div>
        </div>
        {hovered && <BorderBeam size={200} duration={8} />}
      </MagicCard>
    </div>
  );
}

export default function Videos() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  return (
    <div>
      <BlurFade delay={0.1}>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Exciting Videos
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Discover content across categories
        </p>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeCategory === "all"
                ? "bg-cyan-600 text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {videoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat.id
                  ? "bg-cyan-600 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((video, i) => (
          <BlurFade key={video.id} delay={0.1 + i * 0.05}>
            <VideoCard video={video} />
          </BlurFade>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No videos in this category yet.
        </div>
      )}
    </div>
  );
}
