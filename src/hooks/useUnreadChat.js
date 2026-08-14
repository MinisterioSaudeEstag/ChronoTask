import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../lib/authContext";

export function useUnreadChat(demandas) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadMap, setUnreadMap] = useState({});
  const lastLocalUpdate = useRef(0);

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

      const timeSinceLocalUpdate = Date.now() - lastLocalUpdate.current;
      if (timeSinceLocalUpdate < 3000) {
        console.log("Ignorando re-busca por atualização local recente.");
        return;
      }

      setUnreadMap(counts);
    }

    fetchUnread();

    const tarefasIds = demandas.map(d => d.id).join(",");

    const channel = supabase
      .channel('unread_chat_v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_messages' }, (payload) => {
        if (payload.new?.user_id === user.id) return;
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, JSON.stringify(demandas)]);

  async function markAsRead(taskId) {
    lastLocalUpdate.current = Date.now();
    
    try {
      const { error } = await supabase
        .from("task_messages")
        .update({ is_read: true })
        .eq("task_id", taskId)
        .neq("user_id", user.id)
        .eq("is_read", false);
      
      if (error) throw error;

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