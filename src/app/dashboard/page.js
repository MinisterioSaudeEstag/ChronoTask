"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/authContext";
import { supabase } from "../../lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Users, Archive } from "lucide-react";
import FuncionarioCard from "../../components/demanda/employeCard";
import NovaDemandaDialog from "../../components/demanda/newDemandDialog";
import DemandasRecentesTable from "../../components/demanda/recentDemandTable";
import MonthFilter from "../../components/dashboard/MonthFilter";
import FiltersPanel from "../../components/dashboard/FilterPanel";
import { useArchiveTask } from "../../hooks/useArchiveTask";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { archiveTask } = useArchiveTask();

  const { data: equipe = [], isLoading: loadingEquipe } = useQuery({
    queryKey: ["equipe_dashboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .neq("role", "admin");
      return data || [];
    },
  });

  const { data: demandas = [], isLoading: loadingDemandas } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar demandas:", error);
        return [];
      }
      return data;
    },
  });

  const isLoading = loadingDemandas || loadingEquipe;

  const demandasFiltradas = useMemo(() => {
    let filtradas = [...demandas];

    if (!isAdmin) {
      filtradas = filtradas.filter(d => d.funcionario_id === user?.id);
    }

    if (selectedMonth !== 'all') {
      const mesFiltro = parseInt(selectedMonth);
      filtradas = filtradas.filter(d => {
        const dataAtribuicao = new Date(d.created_at);
        return dataAtribuicao.getMonth() === mesFiltro;
      });
    }

    if (selectedStatuses.length > 0) {
      filtradas = filtradas.filter(d => selectedStatuses.includes(d.status));
    }

    if (selectedProducts.length > 0) {
      filtradas = filtradas.filter(d => selectedProducts.includes(d.produto));
    }

    return filtradas;
  }, [demandas, isAdmin, user, selectedMonth, selectedStatuses, selectedProducts]);

  const myDemandas = !isAdmin 
    ? demandasFiltradas.filter(d => d.funcionario_id === user?.id) 
    : demandasFiltradas;

  const stats = [
    { label: "Não Iniciadas", value: myDemandas.filter(d => d.status === "nao_iniciado").length, icon: Clock, color: "text-slate-500" },
    { label: "Pendentes", value: myDemandas.filter(d => d.status === "pendente").length, icon: Clock, color: "text-statusYellow" },
    { label: "Em Andamento", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-statusCyan" },
    { label: "Concluídas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-statusGreen" },
    { label: "Atrasadas", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-statusRed" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-8 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Olá, {user?.full_name?.split(" ")[0] || "Usuário"} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isAdmin ? "Painel de controle de demandas da equipe" : "Suas demandas e atividades"}
          </p>
        </div>
        {isAdmin && (
          <NovaDemandaDialog taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <Card key={stat.label} className="border-border/60 bg-white dark:bg-darkCard">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[300px]">
          <MonthFilter 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
          />
        </div>
        <FiltersPanel 
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>

      {(selectedMonth !== 'all' || selectedStatuses.length > 0 || selectedProducts.length > 0) && (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Mostrando <strong>{myDemandas.length}</strong> de <strong>{demandas.length}</strong> demandas
        </div>
      )}

      {isAdmin && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Equipe</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipe.map(func => (
              <FuncionarioCard
                key={func.id}
                nome={func.full_name}
                demandas={demandas.filter(d => d.funcionario_id === func.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <ClipboardList className="w-5 h-5 text-primary" />
            Demandas Recentes
          </h2>
          
          {isAdmin && (
            <Link 
              href="/demandas-arquivadas"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Archive className="w-4 h-4" />
              Ver Arquivadas
            </Link>
          )}
        </div>

        <DemandasRecentesTable 
          demandas={myDemandas} 
          isAdmin={isAdmin} 
          onEdit={(task) => setTaskToEdit(task)} 
        />
      </section>
    </div>
  );
}