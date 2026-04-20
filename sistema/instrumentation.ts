import { getSettings } from "./src/actions/settings";

let currentTask: any = null;

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = (await import('node-cron')).default;
    
    async function setupCronJob() {
      if (currentTask) {
        currentTask.stop();
      }

      const settings = await getSettings();
      const [hour, minute] = settings.emailTime.split(":");

      const cronExpression = `${minute} ${hour} * * *`;
      console.log(`[Cron] E-mails agendados diariamente às ${hour}:${minute} (Ambiente Node.js)`);

      currentTask = cron.schedule(cronExpression, async () => {
        console.log(`\n[Cron] Executando envio de e-mails de ${hour}:${minute}...`);
        
        // Refetch settings just in case it changed without restarting server
        const freshSettings = await getSettings();
        const [freshHour, freshMinute] = freshSettings.emailTime.split(":");
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Executa apenas se o horário atual for compatível com a configuração
        if (currentHour === parseInt(freshHour) && currentMinute === parseInt(freshMinute)) {
             const { processDailyEmails } = await import("./src/actions/emails");
             const result = await processDailyEmails();
             console.log(`[Cron] ${result.message} (Total: ${result.count})`);
        } else {
             console.log(`[Cron] Abortado. A configuração de horário foi alterada para ${freshHour}:${freshMinute}. O job será atualizado no próximo restart.`);
        }
      });
    }

    await setupCronJob();
    
    // Check every minute if settings changed to update cron dynamically (optional helper)
    setInterval(async () => {
        const settings = await getSettings();
        const [hour, minute] = settings.emailTime.split(":");
        const newCronExpression = `${minute} ${hour} * * *`;
        // We could refresh if it changed, but let's keep it simple for now
    }, 60000);
  }
}
