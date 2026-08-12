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
        .select("task_id")
        .eq("is_read", false)
        .neq("user_id", user.id)
        .in("task_id", taskIds);

      if (error) return;

      const counts = {};
      data.forEach(msg => {
        counts[msg.task_id] = (counts[msg.task_id] || 0) + 1;
      });
      setUnreadMap(counts);
    }

    fetchUnread();

    const channel = supabase
      .channel('unread_chat_global')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_messages' }, () => {
      fetchUnread(); 
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, JSON.stringify(demandas)]);

  async function markAsRead(taskId) {
    const { error } = await supabase
      .from("task_messages")
      .update({ is_read: true })
      .eq("task_id", taskId)
      .neq("user_id", user.id)
      .eq("is_read", false);
    
    if (!error) {
      setUnreadMap(prev => ({ ...prev, [taskId]: 0 }));
      queryClient.invalidateQueries(["demandas"]);
    }
  }

  return { unreadMap, markAsRead };
}