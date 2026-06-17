'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NovaDemandaDialog({ taskToEdit, setTaskToEdit }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);

  const [formData, setFormData] = useState({
    funcionario_id: "", funcionario_nome: "", descricao: "", produto: "Planilha",
    expected_time: "", expected_date: "", start_date: "",
    start_time: "", end_time: "", processo: "", 
    conv_type: "Convênio", 
    convenio: "", convenente: "",
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
      setIsOpen(true);
    }
  }, [taskToEdit]);

  useEffect(() => {
    if (isOpen) {
      async function fetchFuncs() {
        const { data } = await supabase.from("profiles").select("id, full_name").neq("role", "admin");
        if (data) setFuncionarios(data);
      }
      fetchFuncs();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    const id = e.target.value;
    const func = funcionarios.find(f => f.id === id);
    setFormData(prev => ({ ...prev, funcionario_id: id, funcionario_nome: func?.full_name || "" }));
  };

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const finalData = { ...formData };
      if (finalData.produto === "Outro") {
        finalData.convenio = "";
        finalData.convenente = "";
      }

      if (taskToEdit) {
        const { error } = await supabase.from("tasks").update(finalData).eq("id", taskToEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tasks").insert([{ ...finalData, admin_id: user.id, status: "pendente" }]);
        if (error) throw error;
      }

      toast.success(taskToEdit ? "Demanda atualizada!" : "Demanda atribuída!");
      setIsOpen(false);
      if (setTaskToEdit) setTaskToEdit(null); 
      queryClient.invalidateQueries(["demandas"]);
      queryClient.invalidateQueries(["equipe"]);
    } catch (error) {
      toast.error("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => { if (setTaskToEdit) setTaskToEdit(null); setIsOpen(true); }} className="bg-[#004785] hover:bg-[#003566] gap-2">
        <Plus className="w-4 h-4" /> {taskToEdit ? "Editar Demanda" : "Atribuir Nova Demanda"}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-xl shadow-2xl my-8">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-foreground">{taskToEdit ? "Editar Demanda" : "Nova Atribuição de Demanda"}</h3>
              <button onClick={() => { setIsOpen(false); if (setTaskToEdit) setTaskToEdit(null); }} className="text-slate-400 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Funcionário</label>
                <select name="funcionario_id" onChange={handleEmployeeChange} value={formData.funcionario_id} className="w-full p-2 rounded-md border bg-background text-sm" required>
                  <option value="">Selecione...</option>
                  {funcionarios.map(f => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Número do Processo</label>
                <input name="processo" value={formData.processo} placeholder="0000.000/0000-00" className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Tipo de Produto</label>
                <select name="produto" value={formData.produto} onChange={handleChange} className="w-//full p-2 rounded-md border bg-background text-sm">
                  <option value="Planilha">Planilha</option>
                  <option value="Documento">Documento</option>
                  <option value="Relatório">Relatório</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-medium">Descrição da Demanda</label>
                <textarea name="descricao" rows="2" value={formData.descricao} className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Data de Início</label>
                <input name="start_date" type="date" value={formData.start_date} className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Horário Início</label>
                <input name="start_time" type="time" value={formData.start_time} className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Horário Término</label>
                <input name="end_time" type="time" value={formData.end_time} className="w-full p-2 rounded-//md border bg-background text-sm" onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Prazo (Data Esperada)</label>
                <input name="expected_date" type="date" value={formData.expected_date} className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} required />
              </div>

              {formData.produto !== "Outro" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Tipo de Vínculo</label>
                    <select name="conv_type" value={formData.conv_type} onChange={handleChange} className="w-full p-2 rounded-md border bg-background text-sm">
                      <option value="Convênio">Convênio</option>
                      <option value="TED">TED</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Número do {formData.conv_type}</label>
                    <input name="convenio" className="w-full p-2 rounded-md border bg-background text-sm" onChange={handleChange} value={formData.convenio} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">{formData.conv_type === "TED" ? "Parceiro" : "Convenente"}</label>
                    <input name="convenente" className="w-//full p-2 rounded-//md border bg-background text-sm" onChange={handleChange} value={formData.convenente} />
                  </div>
                </>
              )}

              <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <Button variant="ghost" type="button" onClick={() => { setIsOpen(false); if (setTaskToEdit) setTaskToEdit(null); }}>Cancelar</Button>
                <Button className="bg-[#004785] hover:bg-[#003566]" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} {taskToEdit ? "Salvar Alterações" : "Atribuir Demanda"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}