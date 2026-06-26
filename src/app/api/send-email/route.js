import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, funcionarioNome, demanda, prazo, tipo, adminNome } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "API Key do Resend não configurada" }, { status: 500 });
    }

    let subject = '';
    let titulo = '';
    let corpo = '';

    if (tipo === 'atribuicao') {
      subject = 'Nova Demanda Atribuída - ChronoTask';
      titulo = `Olá, ${funcionarioNome}!`;
      corpo = `Uma nova demanda foi atribuída a você pela administração.`;
    } else if (tipo === 'devolutiva') {
      subject = 'Nova Devolutiva de Demanda - ChronoTask';
      titulo = `Olá, ${adminNome}!`;
      corpo = `O(a) funcionário(a) <strong>${funcionarioNome}</strong> enviou uma devolutiva/observação para uma demanda.`;
    } else {
      subject = 'Atualização no ChronoTask';
      titulo = `Olá!`;
      corpo = `Houve uma atualização em uma demanda no sistema.`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fdfbf7;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0;">
          
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #004785;">
            <h1 style="color: #004785; margin: 0; font-size: 28px;">ChronoTask</h1>
            <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">
              Ministério da Saúde | DITRE/PE
            </p>
          </div>

          <div style="padding: 30px 0;">
            <h2 style="color: #0f172a; margin-top: 0;">${titulo}</h2>
            <p style="color: #334155; line-height: 1.6; font-size: 15px;">${corpo}</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #004785; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #475569; font-size: 13px; text-transform: uppercase; font-weight: bold;">Demanda</p>
              <p style="margin: 0 0 15px 0; color: #0f172a; font-size: 16px;">${demanda}</p>
              
              <p style="margin: 0 0 5px 0; color: #475569; font-size: 13px; text-transform: uppercase; font-weight: bold;">Prazo Final</p>
              <p style="margin: 0; color: #0f172a; font-size: 16px;">${prazo || 'Não definido'}</p>
            </div>

            <p style="color: #334155; line-height: 1.6; font-size: 15px;">
              Acesse o sistema para acompanhar o andamento e registrar a sua devolutiva.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://chrono-task-gilt.vercel.app" style="background-color: #004785; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Acessar o Sistema
              </a>
            </div>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 5px 0;">
              © ${new Date().getFullYear()} ChronoTask - Sistema de Gestão de Demandas
            </p>
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              Secretaria Executiva | COTRE/PE | DITRE/PE
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'ChronoTask <arthur.moreira@saude.gov.br>', 
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro no envio de e-mail:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}