'use client';

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock, Calendar, FileText, ExternalLink, CheckCircle2,
  MessageSquare, AlertCircle, Hourglass, CheckCheck
} from "lucide-react";
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
        .order("due_datetime", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  async function handleAddObservation(taskId) {
    const obs = window.prompt("Escreva sua observação ou devolutiva:");
    if (obs === null || obs.trim() === "") return;
    try {
      const { error } = await supabase.from("tasks").update({ observation: obs }).eq("id", taskId);
      if (error) throw error;
      toast.success("Observação enviada ao Admin!");
    } catch (error) {
      toast.error("Erro: " + error.message);
    }
  }

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
      toast.error("Erro: " + error.message);
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen text-muted-foreground">Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Minhas Atividades</h1>
        <p className="text-muted-foreground">Acompanhe todas as informações das suas demandas atribuídas.</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed border-2 p-12 text-center space-y-4">
          <CheckCheck className="w-12 h-12 text-emerald-500 mx-auto" />
          <p className="text-muted-foreground font-medium">Parabéns! Você não possui atividades pendentes.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-primary transition-all group overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="flex">
                  <div className={`w-1.5 ${task.status === 'concluida' ? 'bg-emerald-500' :
                      task.status === 'em_andamento' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />

                  <div className="p-6 w-full space-y-5">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' :
                          task.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {task.status.replace('_', ' ')}
                      </span>

                      <div className="text-right text-[10px] text-muted-foreground uppercase font-semibold">
                        <p className="flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" /> Atribuído em:
                        </p>
                        <p className="text-foreground">
                          {new Date(task.created_at).toLocaleDateString('pt-BR')} às {new Date(task.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-tight">{task.descricao}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FileText className="w-3 h-3" /> Tipo de Produto: <span className="font-semibold text-foreground">{task.produto}</span>
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-md text-amber-700 dark:text-amber-300">
                        <Hourglass className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-800 dark:text-amber-400 uppercase font-bold tracking-wider">Prazo de Finalização</p>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                          {task.due_datetime ? new Date(task.due_datetime).toLocaleString('pt-BR') : 'A definir'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-md border border-border/60">
                        <p className="text-muted-foreground uppercase font-bold text-[10px] mb-1">Processo</p>
                        {task.processo ? (
                          <button onClick={() => { navigator.clipboard.writeText(task.processo); toast.success("Copiado!"); }} className="text-primary font-semibold flex items-center gap-1 hover:underline">
                            {task.processo} <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : <p className="text-slate-400 italic">Não informado</p>}
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-md border border-border/60">
                        <p className="text-muted-foreground uppercase font-bold text-[10px] mb-1">Carga Horária</p>
                        <p className="text-foreground font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" /> {task.expected_time ? `${task.expected_time}h` : 'Não definida'}
                        </p>
                      </div>

                      {task.convenio && (
                        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-md border border-border/60 sm:col-span-2">
                          <p className="text-muted-foreground uppercase font-bold text-[10px] mb-1">
                            {task.conv_type === 'TED' ? 'Detalhes do TED' : 'Detalhes do Convênio'}
                          </p>
                          <p className="text-foreground font-medium">
                            {task.convenio} {task.conv_year ? `| ${task.conv_year}` : ''}
                          </p>
                          {task.convenente && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {task.conv_type === 'TED' ? 'Parceiro' : 'Convenente'}: {task.convenente}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {task.observation && (
                      <div className="text-[11px] italic bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                        <strong className="not-italic flex items-center gap-1 mb-1"><MessageSquare className="w-3 h-3" /> Última devolutiva:</strong>
                        {task.observation}
                      </div>
                    )}

                    {task.status !== "concluida" && (
                      <div className="pt-3 border-t border-border/60">
                        {concludingId === task.id ? (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <textarea
                              placeholder="Insira a observação de entrega..."
                              className="w-full p-2 text-xs border rounded-md bg-background outline-none focus:ring-1 focus:ring-primary"
                              value={observation}
                              onChange={(e) => setObservation(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleCompleteTask(task.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-xs">
                                Confirmar Conclusão
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setConcludingId(null)} className="h-8 px-3 text-xs">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setConcludingId(task.id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 h-9"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Concluir
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddObservation(task.id)}
                              className="h-9 px-3 text-xs"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
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
