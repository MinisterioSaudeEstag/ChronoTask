import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export function useAutoCheckOverdue() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkOverdueTasks = async () => {
      try {
        const nowISO = new Date().toISOString();
        
        const { data: expiredTasks, error } = await supabase
          .from("tasks")
          .select("id, status, expected_date, end_time")
          .lt("due_datetime", nowISO)
          .not("status", "in", '("concluida","atrasada")'); 

        if (error) throw error;
        if (!expiredTasks || expiredTasks.length === 0) return;

        const ids = expiredTasks.map(t => t.id);
        await supabase
          .from("tasks")
          .update({ status: "atrasada" })
          .in("id", ids);

        queryClient.invalidateQueries(["demandas"]);
        
        console.log(`[AutoCheck] ${ids.length} tarefas movidas para atrasadas.`);
      } catch (err) {
        console.error("Erro no verificador de atraso:", err);
      }
    };

    checkOverdueTasks();

    const interval = setInterval(checkOverdueTasks, 300000);
    
    return () => clearInterval(interval); 
  }, [queryClient]);
}