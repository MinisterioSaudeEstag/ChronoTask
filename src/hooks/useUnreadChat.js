import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../lib/authContext";

export function useUnreadChat(demandas) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadMap, setUnreadMap] = useState({});

  useEffect(() => {
    if (!user || !demandas || demandas.length === 0) return;

    async function fetchUnread() {
      const taskIds = demandas.map(d => d.id);

      const { data, error } = await supabase
        .from("task_messages")
        .select("task_id, is_read")
        .neq("user_id", user.id)
        .in("task_id", taskIds);

      if (error) return;

      const counts = {};
      data.forEach(msg => {
        if (msg.is_read === false) {
          counts[msg.task_id] = (counts[msg.task_id] || 0) + 1;
        }
      });
      setUnreadMap(counts);
    }

    fetchUnread();

    const channel = supabase
      .channel('unread_chat_global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_messages' }, () => {
      fetchUnread();
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, JSON.stringify(demandas)]);

  async function markAsRead(taskId) {
    try {
      const { error } = await supabase
        .from("task_messages")
        .update({ is_read: true })
        .eq("task_id", taskId)
        .neq("user_id", user.id)
        .eq("is_read", false);
      
      if (error) throw error;

      setUnreadMap(prev => ({ ...prev, [taskId]: 0 }));

      queryClient.invalidateQueries(["demandas"]);
      queryClient.invalidateQueries(["unread_chat"]);
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  }

  return { unreadMap, markAsRead };
}