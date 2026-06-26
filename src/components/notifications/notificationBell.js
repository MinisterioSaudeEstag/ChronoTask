"use client";
import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('id, descricao, expected_date, created_at')
        .eq('funcionario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    const channel = supabase
      .channel('notificacoes_tempo_real')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'tasks',
        filter: `funcionario_id=eq.${user.id}` 
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);

        // Dispara a notificação nativa do sistema operacional
        if (typeof window !== "undefined" && Notification.permission === "granted") {
          new Notification("ChronoTask - Nova Demanda Atribuída", {
            body: payload.new.descricao,
          });
        }
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [user]);

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className={`w-5 h-5 ${open ? 'text-primary' : 'text-slate-400'}`} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-darkBg" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-darkCard border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
            <h3 className="text-sm font-bold text-foreground">Notificações</h3>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-muted-foreground">
                Nenhuma notificação no momento.
              </p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <p className="text-sm font-medium text-foreground truncate">{n.descricao}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                    Nova demanda • Prazo: {n.expected_date || 'A definir'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}