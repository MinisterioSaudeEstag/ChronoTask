"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/authContext";
import { supabase } from "../../lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Archive,
  ArrowRight,
  Calendar,
  Zap,
  LayoutDashboard,
  FileText
} from "lucide-react";
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

  const proximosVencimentos = useMemo(() => {
    return [...myDemandas]
      .filter(d => d.expected_date && d.status !== 'concluida')
      .sort((a, b) => new Date(a.expected_date) - new Date(b.expected_date))
      .slice(0, 3);
  }, [myDemandas]);

  const stats = [
    { label: "Demandas", sub: "Total de demandas", value: myDemandas.length, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Em andamento", sub: "Em execução", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Atrasadas", sub: "Fora do prazo", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100" },
    { label: "Concluídas", sub: "Finalizadas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pendentes", sub: "Não Iniciadas / Aguardando", value: myDemandas.filter(d => d.status === "nao_iniciado" || d.status === "pendente").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-100" },
  ];

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans px-4 sm:px-6 py-8 transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto space-y-8 w-full">

        <div className="relative bg-gradient-to-r from-[#f0f5ff] to-[#e6f0ff] rounded-2xl p-8 lg:p-10 overflow-hidden border border-blue-100 shadow-sm w-full">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-slate-800 text-lg font-bold">
                Olá, {user?.full_name?.split(" ")[0] || "Usuário"}! 👋
              </h2>
              {isAdmin && (
                <NovaDemandaDialog taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#004785] mb-4 tracking-tight">
              Bem-vindo ao ChronoTask
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Aqui você acompanha suas demandas, prazos e o andamento das atividades da sua equipe, de forma simples e organizada.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex justify-end items-end p-8 opacity-10 pointer-events-none">
            <LayoutDashboard className="w-64 h-64 text-[#004785] translate-x-10 translate-y-10" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {stats.map(stat => (
            <Card key={stat.label} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
                    <p className="text-sm font-bold text-[#004785] leading-tight">{stat.label}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
                <ArrowRight className={`w-4 h-4 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
          <div className="flex-1 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <MonthFilter
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className="shrink-0">
            <FiltersPanel
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          </div>
        </div>

        {(selectedMonth !== 'all' || selectedStatuses.length > 0 || selectedProducts.length > 0) && (
          <div className="text-sm text-slate-500 bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-100">
            Mostrando <strong className="text-[#004785]">{myDemandas.length}</strong> de <strong className="text-[#004785]">{demandas.length}</strong> demandas
          </div>
        )}

        <section className="w-full">
          {isAdmin && (
            <div className="flex justify-end mb-4">
              <Link
                href="/demandas-arquivadas"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Ver Arquivadas
              </Link>
            </div>
          )}
          
          <div className="w-full shadow-sm rounded-xl overflow-hidden">
            <DemandasRecentesTable
              demandas={myDemandas}
              isAdmin={isAdmin}
              onEdit={(task) => setTaskToEdit(task)}
            />
          </div>
        </section>

        {isAdmin && (
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-[#004785]" />
              <h2 className="text-lg font-bold text-slate-800">Equipe</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      </div>
    </div>
  );
}