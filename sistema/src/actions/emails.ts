"use server";

import fs from "fs/promises";
import path from "path";
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

    console.log(`\n================= MOCK EMAIL ENVIADO =================`);
    console.log(`Para: ${student.email}`);
    console.log(`Assunto: Atualização Diária de Avaliações - Vibe Class`);
    console.log(`Mensagem: Olá ${student.name},\n`);
    console.log(`Houve modificações em suas avaliações hoje:\n`);
    
    for (const [classId, classData] of Object.entries(updatesByClass)) {
      console.log(`Turma: ${classData.className}`);
      for (const [target, newValue] of Object.entries(classData.changes)) {
          console.log(`- ${target.charAt(0).toUpperCase() + target.slice(1)}: ${newValue || "Removido"}`);
      }
      console.log("");
    }
    console.log(`======================================================\n`);
  }

  // Clear queue after sending
  await fs.writeFile(queueFilePath, "{}", "utf-8");
  return { message: "E-mails enviados com sucesso!", count: studentIds.length };
}