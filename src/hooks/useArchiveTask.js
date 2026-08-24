import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useArchiveTask() {
  const queryClient = useQueryClient();

  async function archiveTask(taskId) {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          archived: true, 
          archived_at: new Date().toISOString() 
        })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Demanda arquivada com sucesso!");
      // Atualiza todas as queries que dependem das tarefas
      queryClient.invalidateQueries(["demandas"]);
      queryClient.invalidateQueries(["equipe"]);
      queryClient.invalidateQueries(["tarefas_arquivadas"]);
    } catch (error) {
      toast.error("Erro ao arquivar: " + error.message);
    }
  }

  async function restoreTask(taskId) {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ 
          archived: false, 
          archived_at: null 
        })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Demanda restaurada com sucesso!");
      queryClient.invalidateQueries(["demandas"]);
      queryClient.invalidateQueries(["equipe"]);
      queryClient.invalidateQueries(["tarefas_arquivadas"]);
    } catch (error) {
      toast.error("Erro ao restaurar: " + error.message);
    }
  }

  return { archiveTask, restoreTask };
}