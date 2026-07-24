'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Send, Clock, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";

export default function ObservationModal({ taskId, taskDescricao, isOpen, onClose }) {
  const { user } = useAuth();
  const [observation, setObservation] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchHistory();
    }
  }, [isOpen, taskId]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("task_observations")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!observation.trim()) {
      toast.error("Escreva uma observação antes de enviar.");
      return;
    }

    try {
      const { error } = await supabase.from("task_observations").insert([{
        task_id: taskId,
        user_id: user?.id,
        user_name: user?.full_name || "Usuário",
        user_role: user?.role || "employee",
        observation: observation,
        status_at_time: "em_andamento" 
      }]);
      if (error) throw error;

      await supabase.from("tasks").update({ observation }).eq("id", taskId);

      toast.success("Observação registrada no histórico!");
      setObservation("");
      fetchHistory(); 
    } catch (error) {
      toast.error("Erro: " + error.message);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-t-xl">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Observações e Histórico</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <p className="text-xs text-slate-500">
            Tarefa: <span className="font-semibold text-foreground">{taskDescricao}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Nova Observação
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={5}
              placeholder="Digite aqui a devolutiva, dúvida ou status da execução..."
              className="w-full p-3 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-white gap-2">
                <Send className="w-4 h-4" /> Enviar para o Histórico
              </Button>
            </div>
          </form>

          <div className="space-y-3 pt-4 border-t border-border/60">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4" /> Histórico de Mensagens
            </h4>
            
            {loading ? (
              <p className="text-xs text-slate-500">Carregando histórico...</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhuma observação registrada ainda.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {history.map((item) => (
                  <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/60">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.user_name} {item.user_role === 'admin' ? '(Admin)' : ''}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {item.observation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}