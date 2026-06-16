"use client";
import React from "react";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <ShieldCheck className="w-16 h-16 text-[#004785]" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Termos de Privacidade</h1>
        <p className="text-muted-foreground">Diretrizes de proteção de dados do sistema ChronoTask</p>
        <div className="h-1 w-20 bg-[#004785] mx-auto rounded-full" />
      </div>

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#004785] font-bold text-xl">
            <Lock className="w-5 h-5" /> 
            <h2>1. Segurança dos Dados</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            O ChronoTask utiliza criptografia de ponta a ponta e autenticação via Supabase Auth para garantir que apenas usuários 
            autorizados com e-mail institucional tenham acesso às informações de demandas e processos.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#004785] font-bold text-xl">
            <Eye className="w-5 h-5" /> 
            <h2>2. Coleta e Uso de Informações</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            As informações coletadas (nome, cargo, número de processo e horas estimadas) são utilizadas exclusivamente para a 
            organização interna do setor <strong>DITRE/PE</strong>, visando a eficiência na entrega de produtos e a transparência 
            no controle de prazos.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-[#004785] font-bold text-xl">
            <FileText className="w-5 h-5" /> 
            <h2>3. Sigilo Institucional</h2>
          </div>
          <p className="text-muted-foreground leading-//relaxed">
            Considerando a natureza dos processos do Ministério da Saúde, todos os usuários concordam em manter o sigilo 
            das informações acessadas no sistema, seguindo as normas de conduta do servidor público e a LGPD.
          </p>
        </section>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl text-center text-sm text-muted-foreground border border-border/60">
        Este documento é para fins de organização interna da unidade DITRE/PE. <br/>
        Para dúvidas, entre em contato com a administração do sistema.
      </div>
    </div>
  );
}