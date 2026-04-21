import cron from "node-cron";
import { getSettings } from "./src/actions/settings";
import { processDailyEmails } from "./src/actions/emails";

let currentTask: cron.ScheduledTask | null = null;
let currentCronExpression: string = "";

async function setupCronJob(cronExpression: string, hour: string, minute: string) {
  if (currentTask) {
    currentTask.stop();
  }
  
  currentCronExpression = cronExpression;
  console.log(`[Cron] E-mails agendados diariamente às ${hour}:${minute} (Ambiente Node.js)`);

  currentTask = cron.schedule(cronExpression, async () => {
    console.log(`\n[Cron] Executando envio de e-mails de ${hour}:${minute}...`);
    try {
      const result = await processDailyEmails();
      console.log(`[Cron] ${result.message} (Total: ${result.count})`);
    } catch (e) {
      console.error(`[Cron] Erro ao enviar e-mails:`, e);
    }
  }, {
    timezone: "America/Sao_Paulo"
  });
}

async function init() {
  const settings = await getSettings();
  const [hour, minute] = settings.emailTime.split(":");
  const initialCronExpression = `${minute} ${hour} * * *`;
  
  await setupCronJob(initialCronExpression, hour, minute);
  
  // Observa mudanças nas configurações a cada minuto para atualizar o cron imediatamente
  setInterval(async () => {
    try {
      const freshSettings = await getSettings();
      const [fHour, fMinute] = freshSettings.emailTime.split(":");
      const newCronExpression = `${fMinute} ${fHour} * * *`;
      
      if (newCronExpression !== currentCronExpression) {
        console.log(`[Cron] Alteração de horário detectada para ${fHour}:${fMinute}. Reconfigurando agendamento...`);
        await setupCronJob(newCronExpression, fHour, fMinute);
      }
    } catch (err) {
      console.error("[Cron] Erro ao checar configurações dinamicamente", err);
    }
  }, 10000); // Checa a cada 10 segundos!
}

init();
