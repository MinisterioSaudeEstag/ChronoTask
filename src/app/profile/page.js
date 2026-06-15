'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Loader2, User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) setFullName(user.full_name);
  }, [user]);

  async function handleUploadAvatar(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao carregar imagem: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleUpdateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, full_name: fullName });
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações e foto de perfil</p>
      </div>

      <Card className="border-border/60 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/60">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-[#004785]">
                      {user?.full_name?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-1 right-1 bg-[#004785] text-white p-2 rounded-full cursor-pointer hover:bg-[#003566] transition-all shadow-md">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadAvatar} />
                </label>
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground font-medium">Clique no ícone para mudar a foto</p>
            </div>

            <div className="flex-1 p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <User className="w-3 h-3" /> Nome Completo
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3 h-3" /> E-mail Institucional
                  </label>
                  <input 
                    type="text" 
                    disabled 
                    className="w-full p-3 rounded-lg border border-border bg-slate-100 dark:bg-slate-800 text-muted-foreground text-sm cursor-not-allowed"
                    value={user?.email}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Cargo no Sistema
                  </label>
                  <div className="w-full p-3 rounded-lg border border-border bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-[#004785] uppercase">
                    {user?.role}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleUpdateProfile} 
                disabled={loading}
                className="w-full bg-[#004785] hover:bg-[#003566] text-white py-6"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
