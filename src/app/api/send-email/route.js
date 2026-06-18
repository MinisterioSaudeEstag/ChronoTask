import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // INSTANCIAÇÃO DENTRO DA FUNÇÃO: 
    // Isso evita que o build da Vercel trave se a chave estiver ausente no momento da compilação
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, funcionarioNome, demanda, prazo } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "API Key do Resend não configurada" }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: 'ChronoTask <onboarding@resend.dev>', 
      to: [email],
      subject: 'Nova Demanda Atribuída - ChronoTask',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #004785;">Olá, ${funcionarioNome}!</h2>
          <p>Uma nova demanda foi atribuída a você no sistema <strong>ChronoTask</strong>.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; border-left: 4px solid #004785;">
            <p><strong>Demanda:</strong> ${demanda}</p>
            <p><strong>Prazo:</strong> ${prazo}</p>
          </div>
          <p>Acesse o sistema para ver todos os detalhes e o número do processo.</p>
          <br>
          <p>Atenciosamente,<br/>Administração DITRE/PE</p>
        </div>
      `,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no envio de e-mail:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
