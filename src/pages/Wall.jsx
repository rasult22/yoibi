import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import {
  users,
  userMap,
  posts as allPosts,
  tweets as allTweets,
  videos as allVideos,
  streams as allStreams,
  mockComments,
} from "@/data/mockData";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Send,
  X,
  Link2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  AtSign,
  Mail,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  UserPlus,
  UserCheck,
  Play,
  Pause,
  Eye,
  Clock,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const CURRENT_USER_ID = 1;

const tabs = [
  { id: "posts", label: "Posts" },
  { id: "tweets", label: "Tweets" },
  { id: "videos", label: "Videos" },
  { id: "streams", label: "Streams" },
];

function ShareModal({ post, onClose }) {
  const [copied, setCopied] = useState(false);
  const fakeUrl = `https://yoibi.com/post/${post.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { icon: Link2, label: "Copy Link", action: handleCopy },
    { icon: Mail, label: "Email", action: () => {} },
    { icon: AtSign, label: "Twitter / X", action: () => {} },
    { icon: Send, label: "Direct Message", action: () => {} },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Share Post</h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-4 rounded-lg border border-border bg-secondary/50 p-3">
          <p className="line-clamp-2 text-sm text-foreground/80">{post.text}</p>
        </div>
        <div className="space-y-1">
          {shareOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={opt.action}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <opt.icon size={18} className="text-muted-foreground" />
              {opt.label === "Copy Link" && copied ? (
                <span className="flex items-center gap-1.5 text-green-400">
                  <Check size={14} /> Copied!
                </span>
              ) : (
                opt.label
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="flex-1 truncate text-xs text-muted-foreground">{fakeUrl}</span>
          <button
            onClick={handleCopy}
            className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImageModal({ images, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
      >
        <X size={20} />
      </button>
      <div className="relative flex max-h-[90vh] max-w-[90vw] items-center" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && current > 0 && (
          <button
            onClick={() => setCurrent(current - 1)}
            className="absolute -left-12 z-10 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <motion.img
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          src={images[current].replace(/w=\d+/, "w=1200").replace(/h=\d+/, "h=900")}
          alt=""
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        />
        {images.length > 1 && current < images.length - 1 && (
          <button
            onClick={() => setCurrent(current + 1)}
            className="absolute -right-12 z-10 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ImageCarousel({ images, onImageClick }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, dragged: false });

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.offsetWidth));
  };

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, dragged: false };
    el.style.cursor = "grabbing";
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
  };
  const onMouseMove = (e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    const walk = (e.pageX - el.offsetLeft) - dragState.current.startX;
    if (Math.abs(walk) > 5) dragState.current.dragged = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const onMouseUp = () => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    const el = scrollRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    el.style.scrollBehavior = "smooth";
    el.style.scrollSnapType = "x mandatory";
    const cardWidth = el.firstElementChild?.offsetWidth || el.offsetWidth;
    const target = Math.round(el.scrollLeft / (cardWidth + 12));
    el.scrollTo({ left: target * (cardWidth + 12) });
    requestAnimationFrame(() => { el.style.scrollBehavior = ""; });
  };

  if (images.length === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-xl">
        <img src={images[0]} alt="" onClick={() => onImageClick(0)} className="aspect-[3/2] w-full cursor-pointer object-cover" />
      </div>
    );
  }

  return (
    <div className="relative mt-3">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none cursor-grab select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            onClick={() => { if (!dragState.current.dragged) onImageClick(i); }}
            className="aspect-[3/2] w-[85%] shrink-0 snap-center cursor-pointer rounded-xl object-cover"
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {images.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === activeIndex ? "w-4 bg-cyan-400" : "w-1 bg-border"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function WallPostItem({ post, onLike, onRepost, onOpenImage, onShare }) {
  const user = userMap.get(post.userId);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const postImages = post.images || [];
  const handleGoToWall = () => navigate(`/wall/${user.handle.slice(1)}`);

  return (
    <div className="px-5 py-5">
      <div className="flex gap-3">
        <img src={user.avatar} alt={user.name} onClick={handleGoToWall} className="h-10 w-10 shrink-0 cursor-pointer rounded-full bg-secondary transition-opacity hover:opacity-80" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span onClick={handleGoToWall} className="cursor-pointer font-semibold text-foreground hover:underline">{user.name}</span>
              <span onClick={handleGoToWall} className="cursor-pointer text-sm text-muted-foreground hover:underline">{user.handle}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{post.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSaved(!saved)} className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {saved ? <BookmarkCheck size={16} className="text-cyan-400" /> : <Bookmark size={16} />}
              </button>
              <button className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{post.text}</p>
          {postImages.length > 0 && (
            <ImageCarousel images={postImages} onImageClick={(i) => onOpenImage(postImages, i)} />
          )}
          <div className="mt-3 flex items-center gap-5">
            <button
              onClick={() => { setLiked(!liked); onLike(post.id, !liked); }}
              className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${liked ? "text-pink-400" : "text-muted-foreground hover:text-pink-400"}`}
            >
              <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
              </motion.div>
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan-400">
              <MessageCircle size={16} /> {post.comments}
            </button>
            <button
              onClick={() => { setReposted(!reposted); onRepost(post.id, !reposted); }}
              className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${reposted ? "text-green-400" : "text-muted-foreground hover:text-green-400"}`}
            >
              <motion.div animate={reposted ? { rotate: [0, -20, 20, 0] } : {}} transition={{ duration: 0.3 }}>
                <Repeat2 size={16} />
              </motion.div>
              {post.reposts + (reposted ? 1 : 0)}
            </button>
            <button onClick={() => onShare(post)} className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Share size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WallTweetItem({ tweet }) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const user = userMap.get(tweet.userId);
  const navigate = useNavigate();
  const handleGoToWall = () => navigate(`/wall/${user.handle.slice(1)}`);

  return (
    <div className="px-5 py-4">
      <div className="flex gap-3">
        <img src={user.avatar} alt={user.name} onClick={handleGoToWall} className="h-10 w-10 shrink-0 cursor-pointer rounded-full bg-secondary transition-opacity hover:opacity-80" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span onClick={handleGoToWall} className="cursor-pointer font-semibold text-foreground hover:underline">{user.name}</span>
            <span onClick={handleGoToWall} className="cursor-pointer text-sm text-muted-foreground hover:underline">{user.handle}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{tweet.time}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{tweet.text}</p>
          <div className="mt-3 flex items-center gap-6">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${liked ? "text-pink-400" : "text-muted-foreground hover:text-pink-400"}`}
            >
              <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
              </motion.div>
              {tweet.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={() => setRetweeted(!retweeted)}
              className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${retweeted ? "text-green-400" : "text-muted-foreground hover:text-green-400"}`}
            >
              <motion.div animate={retweeted ? { rotate: [0, -20, 20, 0] } : {}} transition={{ duration: 0.3 }}>
                <Repeat2 size={15} />
              </motion.div>
              {tweet.retweets + (retweeted ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageCircle size={15} />
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Share size={15} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WallVideoItem({ video }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (playing && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [playing]);

  function handlePlay() {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl">
      {!playing && (
        <>
          <img src={video.thumbnail} alt={video.title} className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30" onClick={handlePlay}>
            <div className="rounded-full bg-cyan-600/90 p-3 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <Play size={20} className="ml-0.5 text-white" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
            {video.duration}
          </div>
        </>
      )}
      {playing && (
        <>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="aspect-video w-full cursor-pointer object-cover"
            muted={muted}
            autoPlay
            onClick={handlePlay}
            onEnded={() => setPlaying(false)}
          />
          <div className="absolute bottom-2 left-2 flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); handlePlay(); }} className="rounded bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80">
              {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }} className="rounded bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </>
      )}
      <div className="mt-2 px-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{video.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Eye size={12} /> {video.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function WallStreamItem({ stream }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (playing && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [playing]);

  function handlePlay() {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl">
      {!playing && (
        <>
          <img src={stream.thumbnail} alt={stream.title} className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30" onClick={handlePlay}>
            <div className="rounded-full bg-red-600/90 p-3 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <Play size={20} className="ml-0.5 text-white" fill="white" />
            </div>
          </div>
        </>
      )}
      {playing && (
        <>
          <video
            ref={videoRef}
            src={stream.videoUrl}
            className="aspect-video w-full cursor-pointer object-cover"
            muted={muted}
            autoPlay
            loop
            onClick={handlePlay}
          />
          <div className="absolute bottom-2 left-2 z-10 flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); handlePlay(); }} className="rounded bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80">
              <Pause size={14} fill="currentColor" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }} className="rounded bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </>
      )}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
        <Radio size={12} className="animate-pulse" /> LIVE
      </div>
      <div className="absolute bottom-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
        {stream.viewers.toLocaleString()} watching
      </div>
      <div className="mt-2 px-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{stream.title}</h3>
      </div>
    </div>
  );
}

export default function Wall() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [following, setFollowing] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [sharePost, setSharePost] = useState(null);

  const profileUser = handle
    ? users.find((u) => u.handle === `@${handle}`)
    : userMap.get(CURRENT_USER_ID);

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-foreground">User not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This profile doesn't exist.</p>
        <button onClick={() => navigate("/feed")} className="mt-4 cursor-pointer rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
          Back to Feed
        </button>
      </div>
    );
  }

  const isOwnProfile = profileUser.id === CURRENT_USER_ID;

  const userPosts = allPosts.filter((p) => p.userId === profileUser.id && !p.replyTo);
  const userTweets = allTweets.filter((t) => t.userId === profileUser.id && !t.replyTo);
  const userVideos = allVideos.filter((v) => v.userId === profileUser.id);
  const userStreams = allStreams.filter((s) => s.userId === profileUser.id);

  const totalContent = userPosts.length + userTweets.length + userVideos.length;

  return (
    <div>
      {/* Cover */}
      <BlurFade delay={0.05}>
        <div className="relative -mx-4 lg:mx-0">
          <div className="h-40 overflow-hidden rounded-none lg:rounded-2xl sm:h-48">
            <img
              src={profileUser.cover}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent lg:rounded-2xl" />
          </div>
        </div>
      </BlurFade>

      {/* Profile info */}
      <BlurFade delay={0.1}>
        <div className="relative px-1">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="h-24 w-24 rounded-full border-4 border-background bg-secondary sm:h-28 sm:w-28"
              />
              <div
                className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-400"
              />
            </div>
            <div className="mb-2 flex flex-1 items-center justify-between">
              <div />
              {!isOwnProfile && (
                <button
                  onClick={() => setFollowing(!following)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-colors ${
                    following
                      ? "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                      : "bg-cyan-600 text-white hover:bg-cyan-700"
                  }`}
                >
                  {following ? (
                    <>
                      <UserCheck size={16} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-2xl font-bold text-foreground">{profileUser.name}</h1>
            <p className="text-sm text-muted-foreground">{profileUser.handle}</p>
          </div>

          {profileUser.bio && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{profileUser.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {profileUser.country}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Joined {profileUser.joinDate}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-5">
            <span className="text-sm">
              <span className="font-semibold text-foreground">{totalContent}</span>{" "}
              <span className="text-muted-foreground">posts</span>
            </span>
            <span className="text-sm">
              <span className="font-semibold text-foreground">{profileUser.followers.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </span>
            <span className="text-sm">
              <span className="font-semibold text-foreground">{profileUser.following}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </span>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={0.15}>
        <div className="mt-6 flex border-b border-border">
          {tabs.map((tab) => {
            const count =
              tab.id === "posts" ? userPosts.length :
              tab.id === "tweets" ? userTweets.length :
              tab.id === "videos" ? userVideos.length :
              userStreams.length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="wall-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </BlurFade>

      {/* Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {userPosts.length === 0 ? (
                <EmptyState label="No posts yet" />
              ) : (
                userPosts.map((post, i) => (
                  <BlurFade key={post.id} delay={0.05 + i * 0.04}>
                    <MagicCard className="overflow-hidden p-0" gradientColor="#06b6d410">
                      <WallPostItem
                        post={post}
                        onLike={() => {}}
                        onRepost={() => {}}
                        onOpenImage={(images, index) => setLightbox({ images, index })}
                        onShare={(p) => setSharePost(p)}
                      />
                    </MagicCard>
                  </BlurFade>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "tweets" && (
            <motion.div
              key="tweets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {userTweets.length === 0 ? (
                <EmptyState label="No tweets yet" />
              ) : (
                userTweets.map((tweet, i) => (
                  <BlurFade key={tweet.id} delay={0.05 + i * 0.04}>
                    <MagicCard className="overflow-hidden p-0" gradientColor="#06b6d410">
                      <WallTweetItem tweet={tweet} />
                    </MagicCard>
                  </BlurFade>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {userVideos.length === 0 ? (
                <EmptyState label="No videos yet" />
              ) : (
                userVideos.map((video, i) => (
                  <BlurFade key={video.id} delay={0.05 + i * 0.04}>
                    <MagicCard className="overflow-hidden p-3" gradientColor="#06b6d410">
                      <WallVideoItem video={video} />
                    </MagicCard>
                  </BlurFade>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "streams" && (
            <motion.div
              key="streams"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {userStreams.length === 0 ? (
                <EmptyState label="No streams yet" />
              ) : (
                userStreams.map((stream, i) => (
                  <BlurFade key={stream.id} delay={0.05 + i * 0.04}>
                    <MagicCard className="overflow-hidden p-3" gradientColor="#06b6d410">
                      <WallStreamItem stream={stream} />
                    </MagicCard>
                  </BlurFade>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox && (
          <ImageModal images={lightbox.images} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sharePost && (
          <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center py-16 text-muted-foreground">
      <p className="text-sm">{label}</p>
    </div>
  );
}
