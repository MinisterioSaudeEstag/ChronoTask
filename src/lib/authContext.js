'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMINS_LIST = ["Eliane Leal", "Maria Juliana", "Monalisa Aquino", "Matheus Nascimento"];

  const STAFF_LIST = ["Arthur Vinícius", "Ana Aparecida", "Giselly Soares", "Emilly Alves", "Maria Luna"];

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleUserRole(session.user);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleUserRole(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleUserRole(supabaseUser) {
    const email = supabaseUser.email;

    const isInstitutional = email.endsWith("@saude.gov.br") || email.endsWith("@outlook.com");

    if (!isInstitutional) {
      alert("Acesso negado. Por favor, utilize seu e-mail institucional.");
      await supabase.auth.signOut();
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    let role = profile?.role || "employee";
    const fullName = profile?.full_name || supabaseUser.email;

    if (ADMINS_LIST.includes(fullName) || role === "admin") {
      role = "admin";
    } else if (STAFF_LIST.includes(fullName) || role === "employee") {
      role = "employee";
    }

    setUser({
      id: supabaseUser.id,
      email: email,
      full_name: profile?.full_name || "Usuário",
      role: role,
      avatar_url: profile?.avatar_url || null
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);