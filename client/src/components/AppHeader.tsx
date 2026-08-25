import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Boxes, LogIn, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

const navigation = [
  { href: "/", label: "はじめる" },
  { href: "/catalog", label: "ブロック図鑑" },
  { href: "/projects", label: "保存プロジェクト" },
];
const mobileNavigation = [
  { href: "/workspace", label: "設計開始" },
  { href: "/catalog", label: "図鑑" },
  { href: "/projects", label: "保存" },
];

export default function AppHeader() {
  const [location] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/15 bg-[#090d20]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-[#f7f2d0] no-underline">
          <span className="grid h-9 w-9 place-items-center border-2 border-lime-300 bg-lime-300 text-[#090d20] shadow-[4px_4px_0_#25e8ff] transition-transform duration-150 group-hover:-translate-y-0.5">
            <Boxes className="h-5 w-5" strokeWidth={3} />
          </span>
          <span className="hidden text-[11px] leading-[1.15] sm:block font-pixel">ぽこあ<br /><span className="text-lime-300">MODELLER</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主なナビゲーション">
          {navigation.map(item => (
            <Link key={item.href} href={item.href} className={`rounded-sm px-3 py-2 text-xs font-bold no-underline transition-colors ${location === item.href ? "bg-cyan-300/15 text-cyan-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              {item.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin" className={`rounded-sm px-3 py-2 text-xs font-bold no-underline transition-colors ${location === "/admin" ? "bg-fuchsia-400/15 text-fuchsia-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              管理
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && isAuthenticated ? (
            <>
              <Badge className="hidden border-lime-300/30 bg-lime-300/10 text-lime-200 sm:flex">{user?.name ?? "TRAINER"}</Badge>
              <Button onClick={logout} variant="ghost" size="sm" className="text-slate-300 hover:bg-white/10 hover:text-white">
                <LogOut className="mr-1.5 h-4 w-4" /> <span className="hidden sm:inline">ログアウト</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => startLogin()} size="sm" className="pixel-button bg-lime-300 text-[#090d20] hover:bg-lime-200">
              <LogIn className="mr-1.5 h-4 w-4" /> ログイン
            </Button>
          )}
        </div>
      </div>
        <nav className={`grid border-t border-cyan-300/10 bg-[#090d20] md:hidden ${user?.role === "admin" ? "grid-cols-4" : "grid-cols-3"}`} aria-label="モバイルナビゲーション">
          {mobileNavigation.map(item => <Link key={item.href} href={item.href} className={`px-1 py-3 text-center text-[10px] font-bold no-underline ${location === item.href ? "bg-cyan-300/15 text-cyan-100" : "text-slate-400"}`}>{item.label}</Link>)}
          {user?.role === "admin" && <Link href="/admin" className={`px-1 py-3 text-center text-[10px] font-bold no-underline ${location === "/admin" ? "bg-fuchsia-400/15 text-fuchsia-200" : "text-slate-400"}`}>管理</Link>}
        </nav>
    </header>
  );
}
