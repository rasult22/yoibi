import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { posts as initialPosts, users, mockComments } from "@/data/mockData";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Plus,
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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
          <span className="flex-1 truncate text-xs text-muted-foreground">
            {fakeUrl}
          </span>
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

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(images.length - 1, c + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

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
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
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
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragState.current.startX;
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
    const gap = 12;
    const target = Math.round(el.scrollLeft / (cardWidth + gap));
    el.scrollTo({ left: target * (cardWidth + gap) });
    requestAnimationFrame(() => {
      el.style.scrollBehavior = "";
    });
  };

  if (images.length === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-xl">
        <img
          src={images[0]}
          alt=""
          onClick={() => onImageClick(0)}
          className="aspect-[3/2] w-full cursor-pointer object-cover"
        />
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
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === activeIndex ? "w-4 bg-cyan-400" : "w-1 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentSection({ postId, comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      userId: 1,
      text: newComment,
      likes: 0,
      time: "Just now",
    };
    setLocalComments([comment, ...localComments]);
    onAddComment(postId);
    setNewComment("");
  };

  const handleLikeComment = (commentId) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mt-3 border-t border-border/50 pt-3">
        <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
          <img
            src={users[0].avatar}
            alt="You"
            className="h-7 w-7 rounded-full bg-secondary"
          />
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
            <input
              ref={inputRef}
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="cursor-pointer text-cyan-400 transition-colors hover:text-cyan-300 disabled:cursor-default disabled:opacity-30"
            >
              <Send size={14} />
            </button>
          </div>
        </form>

        <div className="space-y-2.5">
          {localComments.map((comment, i) => {
            const commentUser = users.find((u) => u.id === comment.userId);
            return (
              <motion.div
                key={comment.id}
                initial={i === 0 && comment.time === "Just now" ? { opacity: 0, y: -10 } : false}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <img
                  src={commentUser?.avatar || users[0].avatar}
                  alt=""
                  className="mt-0.5 h-6 w-6 rounded-full bg-secondary"
                />
                <div className="flex-1">
                  <div className="rounded-xl bg-secondary/70 px-3 py-2">
                    <span className="text-xs font-semibold text-foreground">
                      {commentUser?.name || "You"}
                    </span>
                    <p className="text-sm text-foreground/80">{comment.text}</p>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 px-1">
                    <span className="text-xs text-muted-foreground">
                      {comment.time}
                    </span>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-pink-400"
                    >
                      {comment.likes > 0 ? `${comment.likes} likes` : "Like"}
                    </button>
                    <button className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground">
                      Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function PostItem({ post, onLike, onRepost, onAddComment, onOpenImage, onShare, hasThreadBelow, isReply }) {
  const user = users.find((u) => u.id === post.userId);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [saved, setSaved] = useState(false);
  const comments = mockComments[post.id] || [];
  const postImages = post.images || (post.image ? [post.image] : []);
  const handleGoToWall = () => navigate(`/wall/${user.handle.slice(1)}`);
  const handleLike = () => {
    setLiked(!liked);
    onLike(post.id, !liked);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    onRepost(post.id, !reposted);
  };

  return (
    <>
      <div className={`relative px-5 pt-5 ${hasThreadBelow ? "pb-2" : "pb-5"}`}>
        {isReply && (
          <div className="absolute left-[39px] top-0 h-5 w-0.5 bg-border" />
        )}
        {hasThreadBelow && (
          <div className="absolute left-[39px] bottom-0 top-[60px] w-0.5 bg-border" />
        )}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt={user.name}
              onClick={handleGoToWall}
              className="relative z-10 h-10 w-10 shrink-0 cursor-pointer rounded-full bg-secondary transition-opacity hover:opacity-80"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span onClick={handleGoToWall} className="cursor-pointer font-semibold text-foreground hover:underline">{user.name}</span>
                <span onClick={handleGoToWall} className="cursor-pointer text-sm text-muted-foreground hover:underline">{user.handle}</span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{post.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSaved(!saved)}
                  className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {saved ? (
                    <BookmarkCheck size={16} className="text-cyan-400" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>
                <button className="cursor-pointer rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{post.text}</p>
            {postImages.length > 0 && (
              <ImageCarousel
                images={postImages}
                onImageClick={(i) => onOpenImage(postImages, i)}
              />
            )}
            <div className="mt-3 flex items-center gap-5">
              <button
                onClick={handleLike}
                className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${
                  liked ? "text-pink-400" : "text-muted-foreground hover:text-pink-400"
                }`}
              >
                <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                </motion.div>
                {post.likes}
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className={`flex cursor-pointer items-center gap-1.5 text-sm transition-colors ${
                  showComments ? "text-cyan-400" : "text-muted-foreground hover:text-cyan-400"
                }`}
              >
                <MessageCircle size={16} /> {post.comments}
              </button>
              <button
                onClick={handleRepost}
                className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${
                  reposted ? "text-green-400" : "text-muted-foreground hover:text-green-400"
                }`}
              >
                <motion.div animate={reposted ? { rotate: [0, -20, 20, 0] } : {}} transition={{ duration: 0.3 }}>
                  <Repeat2 size={16} />
                </motion.div>
                {post.reposts}
              </button>
              <button
                onClick={() => onShare(post)}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Share size={16} />
              </button>
            </div>

            <AnimatePresence>
              {showComments && (
                <CommentSection postId={post.id} comments={comments} onAddComment={onAddComment} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </>
  );
}

function buildThreadGroups(posts) {
  const groups = [];
  let i = 0;
  while (i < posts.length) {
    const post = posts[i];
    if (!post.replyTo) {
      const thread = [post];
      let j = i + 1;
      while (j < posts.length && posts[j].replyTo) {
        thread.push(posts[j]);
        j++;
      }
      groups.push(thread);
      i = j;
    } else {
      groups.push([post]);
      i++;
    }
  }
  return groups;
}

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [sharePost, setSharePost] = useState(null);

  const handleLike = (id, isLiking) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: isLiking ? p.likes + 1 : p.likes - 1 }
          : p
      )
    );
  };

  const handleRepost = (id, isReposting) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, reposts: isReposting ? p.reposts + 1 : p.reposts - 1 }
          : p
      )
    );
  };

  const handleAddComment = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
  };

  const handleNewPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      userId: 1,
      text: newPost,
      likes: 0,
      comments: 0,
      reposts: 0,
      time: "Just now",
    };
    setPosts([post, ...posts]);
    setNewPost("");
    setShowComposer(false);
  };

  return (
    <div>
      <BlurFade delay={0.1}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
          >
            <Plus size={16} /> New Post
          </button>
        </div>
      </BlurFade>

      {showComposer && (
        <BlurFade delay={0.05}>
          <MagicCard className="mb-6 p-4" gradientColor="#06b6d420">
            <div className="flex gap-3">
              <img
                src={users[0].avatar}
                alt="You"
                className="h-9 w-9 rounded-full bg-secondary"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500 focus:outline-none"
                  autoFocus
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {newPost.length > 0 && `${newPost.length} characters`}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowComposer(false);
                        setNewPost("");
                      }}
                      className="cursor-pointer rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNewPost}
                      disabled={!newPost.trim()}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white transition-colors hover:bg-cyan-700 disabled:cursor-default disabled:opacity-40"
                    >
                      <Send size={14} /> Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </MagicCard>
        </BlurFade>
      )}

      <div className="space-y-4">
        {buildThreadGroups(posts).map((group, gi) => (
          <BlurFade key={group[0].id} delay={0.1 + gi * 0.05}>
            <MagicCard className="overflow-hidden p-0" gradientColor="#06b6d410">
              {group.map((post, ti) => (
                <div key={post.id}>
                  <PostItem
                    post={post}
                    onLike={handleLike}
                    onRepost={handleRepost}
                    onAddComment={handleAddComment}
                    onOpenImage={(images, index) => setLightbox({ images, index })}
                    onShare={(p) => setSharePost(p)}
                    hasThreadBelow={ti < group.length - 1}
                    isReply={!!post.replyTo}
                  />
                </div>
              ))}
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <ImageModal
            images={lightbox.images}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
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
