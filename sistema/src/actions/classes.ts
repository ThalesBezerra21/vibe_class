"use server";

import fs from "fs/promises";
import path from "path";

export interface StudentEvaluation {
  studentId: string;
  notes: string;
  grade: number | null;
}

export interface ClassRoom {
  id: string;
  description: string;
  year: number;
  semester: number;
  enrolledStudents: string[]; // IDs of students
  evaluations: Record<string, StudentEvaluation>; // Key: studentId
}

const dataFilePath = path.join(process.cwd(), "data", "classes.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, "[]", "utf-8");
  }
}

export async function getClasses(): Promise<ClassRoom[]> {
  await ensureDataFile();
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data || "[]");
}

export async function addClass(classRoom: Omit<ClassRoom, "id">) {
  const classes = await getClasses();
  const newClass = { ...classRoom, id: Date.now().toString() };
  classes.push(newClass);
  await fs.writeFile(dataFilePath, JSON.stringify(classes, null, 2));
  return newClass;
}

export async function updateClass(id: string, data: Partial<Omit<ClassRoom, "id">>) {
  const classes = await getClasses();
  const index = classes.findIndex((c) => c.id === id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...data };
    await fs.writeFile(dataFilePath, JSON.stringify(classes, null, 2));
  }
}

export async function deleteClass(id: string) {
  const classes = await getClasses();
  const filtered = classes.filter((c) => c.id !== id);
  await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2));
}

export async function toggleStudentEnrollment(classId: string, studentId: string) {
  const classes = await getClasses();
  const cl = classes.find((c) => c.id === classId);
  if (cl) {
    if (cl.enrolledStudents.includes(studentId)) {
      cl.enrolledStudents = cl.enrolledStudents.filter((id) => id !== studentId);
      delete cl.evaluations[studentId]; // remove evaluation when unenrolled
    } else {
      cl.enrolledStudents.push(studentId);
      cl.evaluations[studentId] = { studentId, notes: "", grade: null };
    }
    await fs.writeFile(dataFilePath, JSON.stringify(classes, null, 2));
  }
}

export async function updateStudentEvaluation(classId: string, studentId: string, evaluation: Partial<StudentEvaluation>) {
  const classes = await getClasses();
  const cl = classes.find((c) => c.id === classId);
  if (cl && cl.enrolledStudents.includes(studentId)) {
    cl.evaluations[studentId] = { ...cl.evaluations[studentId], ...evaluation, studentId };
    await fs.writeFile(dataFilePath, JSON.stringify(classes, null, 2));
  }
}