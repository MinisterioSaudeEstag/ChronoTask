"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Archive 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notifications/notificationBell";
import { useAutoCheckOverdue } from "../../hooks/useAutoCheckOverdue";

export default function Header() {
  useAutoCheckOverdue();

  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (pathname === "/") return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const linkBaseStyle = "flex items-center gap-2 text-sm transition-colors";
  const linkActiveStyle = "text-slate-900 font-bold";
  const linkInactiveStyle = "text-slate-500 font-medium hover:text-slate-800";

  return (
    <header className="h-16 border-b border-slate-200 bg-white text-slate-900 px-6 flex items-center justify-between transition-colors duration-300 sticky top-0 z-40">
      
      <div className="flex items-center gap-8">
        
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <img src="/logo-sus.png" alt="SUS" className="h-8 w-auto" />
          <div className="h-8 w-[1px] bg-slate-300 mx-1" />
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-xl leading-none text-[#004785] tracking-tight group-hover:text-blue-700 transition-colors">
              ChronoTask
            </span>
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">
              COTRE/PE | DITRE/PE
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          <Link
            href="/dashboard"
            className={`${linkBaseStyle} ${pathname === '/dashboard' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Home
          </Link>

          <Link
            href="/minhas-atividades"
            className={`${linkBaseStyle} ${pathname === '/minhas-atividades' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Minhas Atividades
          </Link>

          <Link
            href="/home"
            className={`${linkBaseStyle} ${pathname === '/home' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <Users className="w-4 h-4" /> Equipe
          </Link>

          <Link
            href="/calendario"
            className={`${linkBaseStyle} ${pathname === '/calendario' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <Calendar className="w-4 h-4" /> Calendário
          </Link>

          {isAdmin && (
            <Link
              href="/demandas-arquivadas"
              className={`${linkBaseStyle} ${pathname === '/demandas-arquivadas' ? linkActiveStyle : linkInactiveStyle}`}
            >
              <Archive className="w-4 h-4" /> Arquivadas
            </Link>
          )}

          <Link
            href="/ajuda"
            className={`${linkBaseStyle} ${pathname === '/ajuda' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <HelpCircle className="w-4 h-4" /> Ajuda
          </Link>

          <Link
            href="/relatorios"
            className={`${linkBaseStyle} ${pathname === '/relatorios' ? linkActiveStyle : linkInactiveStyle}`}
          >
            <FileText className="w-4 h-4" /> Relatórios
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        
        <div className="text-slate-500 hover:text-slate-800 transition-colors">
          <NotificationBell />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#004785] text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#004785] transition-colors">
              {user?.full_name?.split(" ")[0] || "Usuário"}
            </span>
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-500 p-1.5 transition-colors rounded-md hover:bg-red-50"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </header>
  );
}