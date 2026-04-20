"use client";

import { useState } from "react";
import { ClassRoom, toggleStudentEnrollment, updateStudentEvaluation, EvaluationGrade } from "@/actions/classes";
import { Student } from "@/actions/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ClassDetail({ classRoom: initialClassRoom, allStudents }: { classRoom: ClassRoom, allStudents: Student[] }) {
  const [classRoom, setClassRoom] = useState<ClassRoom>(initialClassRoom);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const refreshData = async () => {
    const updatedClasses = await import("@/actions/classes").then((m) => m.getClasses());
    const updatedClass = updatedClasses.find(c => c.id === classRoom.id);
    if (updatedClass) {
      setClassRoom(updatedClass);
    }
    router.refresh();
  };

  const handleToggleEnrollment = async (studentId: string) => {
    await toggleStudentEnrollment(classRoom.id, studentId);
    await refreshData();
  };

  const handleUpdateEvaluation = async (studentId: string, meta: "requisitos" | "testes" | "implementacao", value: EvaluationGrade) => {
    await updateStudentEvaluation(classRoom.id, studentId, { 
      [meta]: value 
    });
    await refreshData();
  };

  const filteredStudents = allStudents.filter(s => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.cpf.includes(q) || s.email.toLowerCase().includes(q);
  });

  const getEvaluationColor = (val: EvaluationGrade) => {
    switch (val) {
      case "MA": return "text-green-600";
      case "MPA": return "text-yellow-600";
      case "MANA": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/turmas">
          <Button variant="link" className="pl-0 text-muted-foreground w-fit">← Voltar para Turmas</Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {classRoom.description}
        </h1>
        <p className="text-muted-foreground">
          {classRoom.year} • {classRoom.semester}º Semestre • {classRoom.enrolledStudents.length} Alunos
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-end">
          <h2 className="text-2xl font-semibold">Avaliações dos Alunos</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="font-medium">MANA (Meta Ainda Não Atingida)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
              <span className="font-medium">MPA (Meta Parcialmente Atingida)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              <span className="font-medium">MA (Meta Atingida)</span>
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome e CPF</TableHead>
                <TableHead className="w-36 text-center">Requisitos</TableHead>
                <TableHead className="w-36 text-center">Testes</TableHead>
                <TableHead className="w-36 text-center">Implementação</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classRoom.enrolledStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhum aluno matriculado nesta turma.
                  </TableCell>
                </TableRow>
              ) : (
                classRoom.enrolledStudents.map(studentId => {
                  const student = allStudents.find(s => s.id === studentId);
                  if (!student) return null;
                  
                  const evaluation = classRoom.evaluations[studentId] || { requisitos: "", testes: "", implementacao: "" };

                  const MetaSelect = ({ meta, value }: { meta: "requisitos" | "testes" | "implementacao", value: EvaluationGrade }) => (
                    <Select 
                      value={value} 
                      onValueChange={(v) => handleUpdateEvaluation(studentId, meta, v as EvaluationGrade)}
                    >
                      <SelectTrigger className={`w-full font-bold ${getEvaluationColor(value)}`}>
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANA" className="text-red-500 font-bold">MANA</SelectItem>
                        <SelectItem value="MPA" className="text-yellow-600 font-bold">MPA</SelectItem>
                        <SelectItem value="MA" className="text-green-600 font-bold">MA</SelectItem>
                      </SelectContent>
                    </Select>
                  );

                  return (
                    <TableRow key={studentId}>
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.cpf}</div>
                      </TableCell>
                      <TableCell>
                        <MetaSelect meta="requisitos" value={evaluation.requisitos as EvaluationGrade} />
                      </TableCell>
                      <TableCell>
                        <MetaSelect meta="testes" value={evaluation.testes as EvaluationGrade} />
                      </TableCell>
                      <TableCell>
                        <MetaSelect meta="implementacao" value={evaluation.implementacao as EvaluationGrade} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => handleToggleEnrollment(studentId)}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="pt-8 border-t space-y-4">
        <h2 className="text-2xl font-semibold">Adicionar Alunos</h2>
        <div>
          <Input 
            placeholder="Pesquisar por nome, CPF ou email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {searchQuery.trim().length > 0 && (
          <div className="rounded-md border bg-background shadow-sm">
              <Table>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow><TableCell className="text-center py-4 text-muted-foreground">Nenhum aluno encontrado</TableCell></TableRow>
                ) : (
                  filteredStudents.map(student => {
                    const isEnrolled = classRoom.enrolledStudents.includes(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email} • {student.cpf}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={isEnrolled ? "outline" : "default"} 
                            size="sm" 
                            onClick={() => handleToggleEnrollment(student.id)}
                          >
                            {isEnrolled ? "Desmatricular" : "Matricular"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
              </Table>
          </div>
        )}
      </div>
    </div>
  );
}