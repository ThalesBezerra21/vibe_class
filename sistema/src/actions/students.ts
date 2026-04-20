"use server";

import fs from "fs/promises";
import path from "path";

export interface Student {
  id: string;
  name: string;
  cpf: string;
  email: string;
}

const dataFilePath = path.join(process.cwd(), "data", "students.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, "[]", "utf-8");
  }
}

export async function getStudents(): Promise<Student[]> {
  await ensureDataFile();
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data || "[]");
}

export async function addStudent(student: Omit<Student, "id">) {
  const students = await getStudents();
  const newStudent = { ...student, id: Date.now().toString() };
  students.push(newStudent);
  await fs.writeFile(dataFilePath, JSON.stringify(students, null, 2));
  return newStudent;
}

export async function updateStudent(id: string, data: Omit<Student, "id">) {
  const students = await getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...data };
    await fs.writeFile(dataFilePath, JSON.stringify(students, null, 2));
  }
}

export async function deleteStudent(id: string) {
  const students = await getStudents();
  const filtered = students.filter((s) => s.id !== id);
  await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2));
}