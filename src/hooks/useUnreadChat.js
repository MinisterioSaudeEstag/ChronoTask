import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../lib/authContext";

export function useUnreadChat(demandas) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadMap, setUnreadMap] = useState({});
  
  const lastLocalUpdate = useRef(0);
  const recentlyOpened = useRef(new Set());

  useEffect(() => {
    if (!user || !demandas || demandas.length === 0) return;

    async function fetchUnread() {
      if (Date.now() - lastLocalUpdate.current < 5000) {
        return;
      }

      const taskIds = demandas.map(d => d.id);

      const { data, error } = await supabase
        .from("task_messages")
        .select("task_id")
        .eq("is_read", false)
        .neq("user_id", user.id)
        .in("task_id", taskIds);

      if (error) return;

      const counts = {};
      data.forEach(msg => {
        if (!recentlyOpened.current.has(msg.task_id)) {
          counts[msg.task_id] = (counts[msg.task_id] || 0) + 1;
        }
      });

      setUnreadMap(counts);
    }

    fetchUnread();

    const channel = supabase
      .channel('unread_chat_final')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_messages' }, (payload) => {
        if (payload.new?.user_id === user.id) return;
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, JSON.stringify(demandas)]);

  async function markAsRead(taskId) {
    lastLocalUpdate.current = Date.now();
    
    recentlyOpened.current.add(taskId);
    setTimeout(() => {
      recentlyOpened.current.delete(taskId);
    }, 8000); 

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