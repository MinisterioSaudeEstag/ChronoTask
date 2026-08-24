"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Moon, Sun, User, LogOut, LayoutDashboard, FileText, Users, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notifications/notificationBell";
import { useAutoCheckOverdue } from "../../hooks/useAutoCheckOverdue";
import { Calendar } from "lucide-react";
import { Archive } from "lucide-react";

export default function Header() {
  useAutoCheckOverdue();

  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/") return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";

    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-darkBg text-slate-900 dark:text-white px-6 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/logo-sus.png" alt="SUS" className="h-8 w-auto" />
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">ChronoTask</span>
            <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wider">COTRE/PE | DITRE/PE</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/dashboard'
              ? 'text-primary font-bold'
              : 'text-slate-400 hover:text-foreground'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Home
          </Link>

          <Link
            href="/minhas-atividades"
            className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/minhas-atividades'
              ? 'text-primary font-bold'
              : 'text-slate-400 hover:text-foreground'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Minhas Atividades
          </Link>

          <Link
            href="/home"
            className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/home'
              ? 'text-primary font-bold'
              : 'text-slate-400 hover:text-foreground'
              }`}
          >
            <Users className="w-4 h-4" /> Equipe
          </Link>

          <Link href="/calendario" className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/calendario'
            ? 'text-primary font-bold'
            : 'text-slate-400 hover:text-foreground'
            }`}>

            <Calendar className="w-4 h-4" /> Calendário
          </Link>

          {isAdmin && (
            <Link
              href="/demandas-arquivadas"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#004785] transition-colors"
            >
              <Archive className="w-4 h-4" /> Arquivadas
            </Link>
          )}

          <Link
            href="/ajuda"
            className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/ajuda' ? 'text-primary font-bold' : 'text-slate-400 hover:text-foreground'
              }`}
          >
            <HelpCircle className="w-4 h-4" /> Ajuda
          </Link>

          <Link
            href="/relatorios"
            className={`flex items-center gap-2 text-sm transition-colors ${pathname === '/relatorios'
              ? 'text-primary font-bold'
              : 'text-slate-400 hover:text-foreground'
              }`}
          >
            <FileText className="w-4 h-4" /> Relatórios
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <Link href="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.full_name?.split(" ")[0]}</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}