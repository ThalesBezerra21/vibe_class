"use client";

import Link from "next/link";
import { useState } from "react";
import { ClassRoom, addClass, updateClass, deleteClass, toggleStudentEnrollment, updateStudentEvaluation } from "@/actions/classes";
import { Student } from "@/actions/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ClassManager({ initialClasses, allStudents }: { initialClasses: ClassRoom[], allStudents: Student[] }) {
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [formStudents, setFormStudents] = useState<string[]>([]);
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    description: "",
    year: new Date().getFullYear(),
    semester: 1,
  });

  const handleOpenNew = () => {
    setEditingClass(null);
    setFormData({ description: "", year: new Date().getFullYear(), semester: 1 });
    setFormStudents([]);
    setSearchQuery("");
    setIsOpen(true);
  };

  const handleOpenEdit = (classRoom: ClassRoom) => {
    setEditingClass(classRoom);
    setFormData({ description: classRoom.description, year: classRoom.year, semester: classRoom.semester });
    setFormStudents([...classRoom.enrolledStudents]);
    setSearchQuery("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
      // Create evaluations for new students if they don't have one
    const mergedEvaluations = { ...(editingClass?.evaluations || {}) };
    formStudents.forEach(studentId => {
      if (!mergedEvaluations[studentId]) {
        mergedEvaluations[studentId] = { studentId, requisitos: "", testes: "", implementacao: "" };
      }
    });

    if (editingClass) {
      await updateClass(editingClass.id, { 
        ...formData, 
        year: Number(formData.year), 
        semester: Number(formData.semester),
        enrolledStudents: formStudents,
        evaluations: mergedEvaluations as any
      });
    } else {
      await addClass({
        ...formData,
        year: Number(formData.year),
        semester: Number(formData.semester),
        enrolledStudents: formStudents,
        evaluations: mergedEvaluations as any,
      });
    }
    setIsOpen(false);
    refreshData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta turma?")) {
      await deleteClass(id);
      refreshData();
    }
  };

  const refreshData = async () => {
    const updatedClasses = await import("@/actions/classes").then((m) => m.getClasses());
    setClasses(updatedClasses);
    router.refresh();
  };

  const filteredStudents = allStudents.filter(s => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.cpf.includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* List / Form classes dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>Voltar</Button>
          <Button onClick={handleOpenNew}>Nova Turma</Button>
        </div>
        
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Editar Turma" : "Nova Turma"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="desc">Tópico / Descrição</Label>
              <Input
                id="desc"
                placeholder="Ex: Introdução a Programação"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sem">Semestre</Label>
                <Input
                  id="sem"
                  type="number"
                  min="1"
                  max="2"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label>Pesquisar Aluno (Nome, CPF, Email)</Label>
              <Input 
                className="mt-2 text-sm"
                placeholder="Digite para buscar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.trim().length > 0 && (
                <div className="rounded-md border my-2 bg-background shadow-sm max-h-40 overflow-y-auto">
                  <Table>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow><TableCell className="text-center text-sm py-2">Nenhum aluno encontrado</TableCell></TableRow>
                      ) : (
                        filteredStudents.map(student => {
                          const isEnrolled = formStudents.includes(student.id);
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="py-2 text-sm">
                                {student.name} <span className="opacity-50 ml-2">{student.cpf}</span>
                              </TableCell>
                              <TableCell className="text-right py-2">
                                <Button 
                                  type="button"
                                  variant={isEnrolled ? "outline" : "default"} 
                                  size="sm" 
                                  onClick={() => {
                                    if (isEnrolled) {
                                      setFormStudents(prev => prev.filter(id => id !== student.id));
                                    } else {
                                      setFormStudents(prev => [...prev, student.id]);
                                    }
                                  }}
                                >
                                  {isEnrolled ? "Remover" : "Adicionar"}
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

            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Alunos na Turma ({formStudents.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {formStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">Nenhum aluno nesta turma.</p>
                ) : (
                  formStudents.map(id => {
                    const student = allStudents.find(s => s.id === id);
                    if (!student) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-sm p-1 border-b last:border-0 hover:bg-muted/50 rounded-sm">
                        <span className="px-2">{student.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-destructive"
                          onClick={() => setFormStudents(prev => prev.filter(p => p !== id))}
                        >
                          Tirar
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Turma</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tópico</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Alunos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhuma turma cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.description}</TableCell>
                  <TableCell>{cls.year} / {cls.semester}º Sem</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cls.enrolledStudents.length}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/turmas/${cls.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                      >
                        Visualizar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(cls)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}