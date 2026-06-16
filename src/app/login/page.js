"use client"; 

import React, { useState } from "react"; 
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Mail, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert("Erro ao entrar: " + error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      alert("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithMicrosoft() {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: { 
          redirectTo: window.location.origin + '/dashboard' 
        }
      });
    } catch (error) {
      alert("Erro ao conectar com Microsoft: " + error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border/60 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#004785] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
            CT
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao ChronoTask</h1>
          <p className="text-muted-foreground text-sm mt-2">Entre com seu e-mail institucional</p>
        </div>

        <div className="space-y-6">

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full"></div>
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-xs text-muted-foreground uppercase font-medium">

            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="nome@saude.gov.br" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#004785] hover:bg-[#003566] text-white py-6 gap-2"
            >
              {loading ? "Entrando..." : <><LogIn className="w-4 h-4" /> Acessar Sistema</>}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/register" className="text-[#004785] font-semibold hover:underline">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
