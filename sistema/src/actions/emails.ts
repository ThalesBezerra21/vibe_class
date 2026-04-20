"use server";

import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { getStudents } from "./students";
import { getClasses } from "./classes";

export interface EvaluationUpdate {
  classId: string;
  className: string;
  target: "requisitos" | "testes" | "implementacao";
  newValue: string;
  timestamp: number;
}

export type QueueStore = Record<string, EvaluationUpdate[]>; // Key: studentId

const queueFilePath = path.join(process.cwd(), "data", "email-queue.json");

async function ensureQueueFile() {
  try {
    await fs.mkdir(path.dirname(queueFilePath), { recursive: true });
    await fs.access(queueFilePath);
  } catch {
    await fs.writeFile(queueFilePath, "{}", "utf-8");
  }
}

export async function getQueue(): Promise<QueueStore> {
  await ensureQueueFile();
  const data = await fs.readFile(queueFilePath, "utf-8");
  return JSON.parse(data || "{}");
}

export async function addToQueue(
  studentId: string,
  classId: string,
  className: string,
  target: "requisitos" | "testes" | "implementacao",
  newValue: string
) {
  const queue = await getQueue();
  if (!queue[studentId]) queue[studentId] = [];

  // Add or update the target modification within the same class to keep it concise
  queue[studentId].push({
    classId,
    className,
    target,
    newValue,
    timestamp: Date.now(),
  });

  await fs.writeFile(queueFilePath, JSON.stringify(queue, null, 2));
}

export async function processDailyEmails() {
  const queue = await getQueue();
  const students = await getStudents();
  
  const studentIds = Object.keys(queue);
  if (studentIds.length === 0) return { message: "Nenhum e-mail na fila", count: 0 };

  // Setup nodemailer transporter using env variables
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromEmail = process.env.SMTP_FROM || "vibeclass@seudominio.com";

  for (const studentId of studentIds) {
    const student = students.find((s) => s.id === studentId);
    if (!student) continue;

    const updates = queue[studentId];
    
    // Group updates by class
    const updatesByClass = updates.reduce((acc, update) => {
      if (!acc[update.classId]) {
         acc[update.classId] = { className: update.className, changes: {} };
      }
      // Keeps the latest modification for that target
      acc[update.classId].changes[update.target] = update.newValue;
      return acc;
    }, {} as Record<string, { className: string, changes: Record<string, string> }>);

    let htmlMessage = `<p>Olá <b>${student.name}</b>,</p><p>Houve modificações em suas avaliações hoje:</p>`;
    let textMessage = `Olá ${student.name},\nHouve modificações em suas avaliações hoje:\n\n`;

    for (const [classId, classData] of Object.entries(updatesByClass)) {
      htmlMessage += `<h3>Turma: ${classData.className}</h3><ul>`;
      textMessage += `Turma: ${classData.className}\n`;
      for (const [target, newValue] of Object.entries(classData.changes)) {
          const targetName = target.charAt(0).toUpperCase() + target.slice(1);
          const val = newValue || "Removido";
          htmlMessage += `<li><b>${targetName}</b>: ${val}</li>`;
          textMessage += `- ${targetName}: ${val}\n`;
      }
      htmlMessage += `</ul>`;
      textMessage += `\n`;
    }

    try {
      if (process.env.SMTP_USER) {
        await transporter.sendMail({
          from: `"Vibe Class" <${fromEmail}>`,
          to: student.email,
          subject: "Atualização Diária de Avaliações - Vibe Class",
          text: textMessage,
          html: htmlMessage,
        });
        console.log(`E-mail real enviado para ${student.email}`);
      } else {
        // Fallback or local testing missing credentials
        console.log(`\n================= MOCK EMAIL ENVIADO (Env faltando SMTP_USER) =================`);
        console.log(`Para: ${student.email}`);
        console.log(textMessage);
        console.log(`======================================================\n`);
      }
    } catch (e) {
      console.error(`Erro enviando e-mail para ${student.email}`, e);
    }
  }

  // Clear queue after sending
  await fs.writeFile(queueFilePath, "{}", "utf-8");
  return { message: "E-mails despachados na rotina diária", count: studentIds.length };
}