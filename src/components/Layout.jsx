import { Outlet, useLocation, useNavigate } from "react-router-dom";
import YoibiLogo from "@/components/YoibiLogo";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Home,
  Video,
  MessageCircle,
  Radio,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Feed", path: "/feed" },
  { icon: Video, label: "Videos", path: "/videos" },
  { icon: MessageCircle, label: "Tweets", path: "/tweets" },
  { icon: Radio, label: "Streams", path: "/streams" },
  { icon: Users, label: "Meet Up", path: "/meetup" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2"
          >
            <YoibiLogo className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold text-cyan-500">
              YOIBI
            </span>
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer text-sm transition-colors ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <Outlet />
      </main>

      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <Dock
          iconSize={40}
          iconMagnification={60}
          className="border-border/50 bg-background/80 backdrop-blur-xl"
        >
          {navItems.map((item) => (
            <DockIcon key={item.path} onClick={() => navigate(item.path)}>
              <item.icon
                size={20}
                className={
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              />
            </DockIcon>
          ))}
        </Dock>
      </div>
    </div>
  );
}
