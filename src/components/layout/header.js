"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun, User, LogOut, LayoutDashboard, FileText, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useDarkMode();

  if (pathname === "/") {
    return null;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
 <header className="h-20 border-b border-border/60 bg-white dark:bg-slate-900 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-ms.png" alt="Ministério da Saúde" className="h-12 w-auto object-contain" />
            <img src="/logo-sus.png" alt="SUS" className="h-12 w-auto object-contain" />
          </div>
          
          <div className="h-10 w-[1px] bg-border mx-2" /> 
          
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[#004785] leading-none">
              ChronoTask
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              DITRE / PE
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#004785] transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Home
          </Link>
          <Link href="/minhas-atividades" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#004785] transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Minhas Atividades
          </Link>
          <Link href="/home" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#004785] transition-colors">
            <Users className="w-4 h-4" /> Equipe
          </Link>
          <Link href="/relatorios" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#004785] transition-colors">
            <FileText className="w-4 h-4" /> Relatórios
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full w-10 h-10 p-0"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </Button>

        <div className="flex items-center gap-3 pl-3 border-l border-border/60">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.full_name}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">{user?.role}</p>
          </div>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-[#004785] cursor-pointer">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#004785] font-bold">
                  {user?.full_name?.charAt(0)}
                </div>
              )}
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 p-2">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}