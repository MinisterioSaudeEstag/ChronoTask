"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, ExternalLink, Hourglass } from "lucide-react";
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
        .eq("funcionario_id", selectedEmployee.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selectedEmployee,
  });

  if (loadingEquipe) return <div className="flex justify-center items-center h-screen text-slate-900 dark:text-white">Carregando equipe...</div>;

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-12 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Painel de Equipe</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipe.map(emp => (
          <Card
            key={emp.id}
            className="cursor-pointer hover:border-primary transition-all group bg-white dark:bg-darkCard"
            onClick={() => setSelectedEmployee(emp)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-primary transition-all dark:border-white/10">
                {emp.avatar_url ? (
                  <img src={emp.avatar_url} className="w-full h-full object-cover" alt={emp.full_name} />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-primary text-xl">
                    {emp.full_name[0]}
                  </div>
                )}
              </div>
              <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{emp.full_name}</p>
              <Button variant="outline" size="sm" className="w-full">Ver Atividades</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 flex justify-between items-center bg-primary text-white">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-lg">Atividades de {selectedEmployee.full_name}</h3>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="hover:text-slate-200 transition-colors text-sm">Fechar</button>
            </div>

            <div className="p-6 overflow-x-auto">
              {loadingTasks ? (
                <div className="flex justify-center py-10 text-slate-500">Buscando atividades...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Nenhuma atividade atribuída a este funcionário.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Atividade / Produto</th>
                      <th className="px-4 py-3">Atribuído por</th>
                      <th className="px-4 py-3">Prazo / Hora</th>
                      <th className="px-4 py-3">Processo</th>
                      <th className="px-4 py-3">Convênio / TED</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">{task.descricao}</p>
                          <p className="text-xs text-slate-500">{task.produto}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {task.profiles?.full_name || "Admin"}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                            <Hourglass className="w-3 h-3" />
                            {task.due_datetime ? new Date(task.due_datetime).toLocaleString('pt-BR') : 'A definir'}
                          </div>
                          {task.start_time && (
                            <p className="text-slate-500 mt-1">{task.start_time} - {task.end_time}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {task.processo ? (
                            <button 
                              onClick={() => { navigator.clipboard.writeText(task.processo); toast.success("Copiado!"); }} 
                              className="text-primary flex items-center gap-1 hover:underline font-medium"
                            >
                              {task.processo} <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Não informado</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {task.conv_type || "Convênio"}: {task.convenio ? `${task.convenio} ${task.conv_year ? `| ${task.conv_year}` : ""}` : "-"}
                          </p>
                          {task.convenente && (
                            <p className="text-[10px] text-slate-500 mt-1">
                              {task.conv_type === "TED" ? "Parceiro" : "Convenente"}: {task.convenente}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' : 
                            task.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {task.status.replace('_', ' ')}
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