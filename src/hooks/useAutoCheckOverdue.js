import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export function useAutoCheckOverdue() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkOverdueTasks = async () => {
      try {
        const nowISO = new Date().toISOString();
        
        // Busca tarefas vencidas que NÃO estão concluídas nem atrasadas
        const { data: expiredTasks, error } = await supabase
          .from("tasks")
          .select("id, status, due_datetime")
          .lt("due_datetime", nowISO)
          .not("status", "in", "(concluida,atrasada)"); // Sintaxe corrigida!

        if (error) throw error;
        if (!expiredTasks || expiredTasks.length === 0) return;

        const ids = expiredTasks.map(t => t.id);
        await supabase
          .from("tasks")
          .update({ status: "atrasada" })
          .in("id", ids);

        queryClient.invalidateQueries(["demandas"]);
        queryClient.invalidateQueries(["equipe"]); // Atualiza também a home
        
        console.log(`[AutoCheck] ${ids.length} tarefas movidas para atrasadas.`);
      } catch (err) {
        console.error("Erro no verificador de atraso:", err);
      }
    };

    checkOverdueTasks();

    // Verifica a cada 5 minutos (300.000 ms)
    const interval = setInterval(checkOverdueTasks, 300000);
    
    return () => clearInterval(interval);
  }, [queryClient]);
}