import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";

export function useUnreadChat(demandas) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadMap, setUnreadMap] = useState({});

  // Tarefas que o usuário acabou de abrir (ficam bloqueadas contra re-sincronização)
  const tarefasVistas = useRef(new Set());

  useEffect(() => {
    if (!user || !demandas || demandas.length === 0) return;

    async function fetchUnread() {
      const taskIds = demandas.map(d => d.id);

      const { data, error } = await supabase
        .from("task_messages")
        .select("task_id, is_read")
        .eq("is_read", false)
        .neq("user_id", user.id)
        .in("task_id", taskIds);

      if (error) return;

      const counts = {};
      data.forEach(msg => {
        // FILTRO ANTI-FANTASMA: ignora tarefas que o usuário já abriu
        if (!tarefasVistas.current.has(msg.task_id)) {
          counts[msg.task_id] = (counts[msg.task_id] || 0) + 1;
        }
      });

      setUnreadMap(counts);
    }

    fetchUnread();

    const channel = supabase
      .channel('unread_chat_impervious')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_messages' }, (payload) => {
        // Ignora mudanças vindas do próprio usuário
        if (payload.new?.user_id === user.id) return;
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, JSON.stringify(demandas)]);

  async function markAsRead(taskId) {
    try {
      // 1. Marca no banco
      await supabase
        .from("task_messages")
        .update({ is_read: true })
        .eq("task_id", taskId)
        .neq("user_id", user.id)
        .eq("is_read", false);

      // 2. CORREÇÃO NUCLEAR: Adiciona a tarefa à lista de "vistas permanentemente"
      tarefasVistas.current.add(taskId);

      // 3. Remove do mapa IMEDIATAMENTE (sem esperar o banco)
      setUnreadMap(prev => {
        const newMap = { ...prev };
        delete newMap[taskId];
        return newMap;
      });

      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  }

  return { unreadMap, markAsRead };
}
