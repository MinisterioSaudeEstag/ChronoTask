"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, Calendar, FileText, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function HomeEquipe() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data: equipe = [], isLoading: loadingEquipe } = useQuery({
    queryKey: ["equipe_list"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").neq("role", "admin");
      return data || [];
    },
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks_member", selectedEmployee?.id],
    queryFn: async () => {
      if (!selectedEmployee) return [];
      const { data } = await supabase
        .from("tasks")
        .select("*, profiles:admin_id(full_name)") 
        .eq("funcionario_id", selectedEmployee.id);
      return data || [];
    },
    enabled: !!selectedEmployee,
  });

  if (loadingEquipe) return <div className="flex justify-center items-center h-screen">Carregando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-[#004785]" />
        <h1 className="text-3xl font-bold text-foreground">Painel de Equipe</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipe.map(emp => (
          <Card 
            key={emp.id} 
            className="cursor-pointer hover:border-[#004785] transition-all group"
            onClick={() => setSelectedEmployee(emp)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-[#004785] transition-all">
                {emp.avatar_url ? <img src={emp.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold text-[#004785]">{emp.full_name[0]}</div>}
              </div>
              <p className="font-bold text-foreground group-hover:text-[#004785] transition-colors">{emp.full_name}</p>
              <Button variant="outline" size="sm" className="w-full">Ver Atividades</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-[#004785] text-white">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-lg">Atividades de {selectedEmployee.full_name}</h3>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="hover:text-slate-300">Fechar</button>
            </div>

            <div className="p-6 overflow-x-auto">
              {loadingTasks ? (
                <div className="flex justify-center py-10 text-muted-foreground">Buscando atividades...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Nenhuma atividade atribuída a este funcionário.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Atividade / Produto</th>
                      <th className="px-4 py-3">Atribuído por</th>
                      <th className="px-4 py-3">Prazo / Hora</th>
                      <th className="px-4 py-3">Processo</th>
                      <th className="px-4 py-3">Convênio / Convte</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{task.descricao}</p>
                          <p className="text-xs text-muted-foreground">{task.produto}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {task.profiles?.full_name || "Admin"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col text-xs">
                            <span>{task.expected_date}</span>
                            <span className="text-muted-foreground">{task.start_time} - {task.end_time}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { navigator.clipboard.writeText(task.processo); toast.success("Copiado!"); }} className="text-primary flex items-center gap-1 hover:underline">
                            {task.processo} <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p><b className="opacity-60">Vínculo:</b> {task.conv_type || "Convênio"}</p>
                          <p><b className="opacity-60">Nome:</b> {task.convenente || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
