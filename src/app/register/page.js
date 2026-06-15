'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    const isInstitutional = email.endsWith("@saude.gov.br") || email.endsWith("@outlook.com");
    if (!isInstitutional) {
      alert("Erro: Apenas e-mails institucionais (@saude.gov.br ou @outlook.com) são permitidos.");
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Erro ao criar conta: " + authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: "employee",
        },
      ]);

      if (profileError) {
        alert("Erro ao criar perfil: " + profileError.message);
      } else {
        alert("Conta criada com sucesso! Por favor, verifique seu e-mail.");
        router.push("/login");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border/60 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#004785] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
            CT
          </div>
          <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm mt-2">Preencha os dados para acessar o sistema</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Arthur Vinícius" 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail Institucional</label>
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
            {loading ? "Cadastrando..." : <><UserPlus className="w-4 h-4" /> Criar Conta</>}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já possui conta?{" "}
          <Link href="/login" className="text-[#004785] font-semibold hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}