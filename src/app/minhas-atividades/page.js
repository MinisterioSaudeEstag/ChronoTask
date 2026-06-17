'use client';

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function MinhasAtividades() {
  const { user } = useAuth();
  const [concludingId, setConcludingId] = useState(null); 
  const [observation, setObservation] = useState("");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["my_tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("funcionario_id", user.id)
        .order("expected_date", { ascending: true });
      return data;
    },
    enabled: !!user,
  });

  async function handleCompleteTask(taskId) {
    if (!observation.trim()) {
      toast.error("Por favor, adicione uma observação de conclusão.");
      return;
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "concluida", observation: observation })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Tarefa concluída com sucesso!");
      setConcludingId(null);
      setObservation("");
    } catch (error) {
      toast.error("Erro ao concluir: " + error.message);
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen text-muted-foreground">Carregando suas atividades...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Minhas Atividades</h1>
        <p className="text-muted-foreground">Acompanhe suas demandas, prazos e prioridades.</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed border-2 p-12 text-center space-y-4">
          <div className="flex justify-center"><CheckCircle2 className="w-12 h-12 text-slate-300" /></div>
          <p className="text-muted-foreground font-medium">Você não possui atividades pendentes no momento!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-[#004785] transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-full flex`}>
                  <div className={`w-2 ${
                    task.status === 'concluida' ? 'bg-emerald-500' : 
                    task.status === 'em_andamento' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  
                  <div className="p-6 w-full space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' : 
                        task.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>

                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(task.processo);
                          toast.success("Número do processo copiado!");
                        }}
                        className="text-primary hover:underline text-xs flex items-center gap-1 font-medium transition-all"
                      >
                        Processo <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground leading-tight">{task.descricao}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Produto: {task.produto}
                      </p>
                    </div>

                    {task.status !== "concluida" && (
                      <div className="pt-4 border-t border-border/40">
                        {concludingId === task.id ? (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <textarea 
                              placeholder="Insira a observação de entrega..." 
                              className="w-full p-2 text-xs border rounded-md bg-background outline-none focus:ring-1 focus:ring-[#004785]"
                              value={observation}
                              onChange={(e) => setObservation(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleCompleteTask(task.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-xs">
                                Confirmar Conclusão
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => {setConcludingId(null); setObservation("");}} className="h-8 px-3 text-xs">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => setConcludingId(task.id)} 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 h-9"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Marcar como Concluída
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="text-[10px] opacity-70 uppercase font-bold">Prazo</span>
                          <span className="font-medium text-foreground">{task.expected_date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="text-[10px] opacity-70 uppercase font-bold">Carga Horária</span>
                          <span className="font-medium text-foreground">{task.expected_time}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
