'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Send, User, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";

export default function ChatModal({ taskId, taskDescricao, isOpen, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    async function fetchMessages() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("task_messages")
          .select("*")
          .eq("task_id", taskId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Erro ao buscar chat:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    const channel = supabase
      .channel(`chat_task_${taskId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'task_messages',
        filter: `task_id=eq.${taskId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isOpen, taskId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("task_messages").insert([{
        task_id: taskId,
        user_id: user?.id,
        user_name: user?.full_name || "Usuário",
        user_role: user?.role || "employee",
        message: newMessage,
        is_read: false
      }]);
      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem: " + error.message);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[80vh] max-h-[600px] rounded-xl shadow-2xl flex flex-col">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-primary text-white rounded-t-xl">
          <div className="flex items-center gap-2 truncate">
            <MessageCircle className="w-5 h-5 shrink-0" />
            <div className="truncate">
              <h3 className="font-bold text-sm">Chat da Demanda</h3>
              <p className="text-[11px] text-blue-100 truncate">{taskDescricao}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-800/30">
          {loading && messages.length === 0 ? (
            <p className="text-center text-xs text-slate-500">Carregando conversa...</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <MessageCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>Nenhuma mensagem ainda.</p>
              <p className="text-xs">Inicie a conversa abaixo.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.user_id === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                  }`}>
                    {!isMe && (
                      <p className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${msg.user_role === 'admin' ? 'text-amber-500' : 'text-primary'}`}>
                        {msg.user_role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {msg.user_name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-border bg-white dark:bg-slate-900 rounded-b-xl flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="bg-primary hover:bg-primary-dark text-white p-2 h-10 w-10 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}