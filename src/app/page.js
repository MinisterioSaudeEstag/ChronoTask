import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Layout, 
  ShieldCheck, 
  Users, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#004785] rounded-full flex items-center justify-center text-white font-bold text-xs">
                MS
              </div>
              <span className="font-bold text-xl tracking-tight text-[#004785]">
                Chrono<span className="text-slate-500">Task</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#004785] hover:bg-[#003566] text-white px-5">
                Acessar Sistema
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <ShieldCheck className="w-3 h-3" />
                <span>Sistema Oficial - Ministério da Saúde</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                Gestão de demandas com <span className="text-[#004785]">precisão e controle.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                O ChronoTask organiza o fluxo de trabalho da equipe, permitindo que administradores atribuam demandas e funcionários gerenciem seus prazos de forma transparente e eficiente.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="bg-[#004785] hover:bg-[#003566] gap-2 px-8">
                    Começar agora <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8">
                  Saiba mais
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#004785]/20 to-transparent rounded-3xl blur-2xl" />
              <Card className="relative border-border/60 shadow-2xl overflow-hidden">
                <div className="bg-slate-100 p-2 border-b flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <CardContent className="p-0 bg-white">
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-50 border rounded-lg p-3 space-y-2">
                          <div className="h-2 w-full bg-slate-200 rounded" />
                          <div className="h-2 w-2/3 bg-slate-200 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="h-32 w-full bg-slate-50 border rounded-lg p-4 space-y-3">
                      <div className="h-3 w-full bg-slate-200 rounded" />
                      <div className="h-3 w-5/6 bg-slate-200 rounded" />
                      <div className="h-3 w-4/6 bg-slate-200 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Tudo o que você precisa para organizar seu setor
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ferramentas integradas para garantir que nenhum processo fique para trás e cada hora seja contabilizada.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-[#004785]" />} 
                title="Gestão de Equipe" 
                description="Visão clara de quem está fazendo o quê, com atribuição rápida de demandas pelos administradores." 
              />
              <FeatureCard 
                icon={<FileText className="w-6 h-6 text-[#004785]" />} 
                title="Controle de Processos" 
                description="Integração com números de processos clicáveis, facilitando a navegação entre sistemas." 
              />
              <FeatureCard 
                icon={<Clock className="w-6 h-6 text-[#004785]" />} 
                title="Rastreamento de Tempo" 
                description="Controle rigoroso de datas de início, término e horas estimadas para cada atividade." 
              />
              <FeatureCard 
                icon={<Layout className="w-6 h-6 text-[#004785]" />} 
                title="Produtos Definidos" 
                description="Classificação clara do entregável: planilhas, relatórios, documentos ou atas." 
              />
              <FeatureCard 
                icon={<CheckCircle className="w-6 h-6 text-[#004785]" />} 
                title="Status em Tempo Real" 
                description="Acompanhe se a demanda está pendente, em andamento ou concluída instantaneamente." 
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6 text-[#004785]" />} 
                title="Acesso Institucional" 
                description="Segurança rigorosa com login exclusivo via e-mail institucional do Governo Federal." 
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 text-left border-border/60 hover:border-[#004785]/50 transition-all duration-300 group">
      <CardContent className="p-0 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
