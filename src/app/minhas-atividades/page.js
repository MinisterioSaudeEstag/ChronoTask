'use client';

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from 'sonner'; 

export default function MinhasAtividades() {
  const { user } = useAuth();

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