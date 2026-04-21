# language: pt
Funcionalidade: Gerenciamento de Turmas e Matrículas
  Como um professor ou administrador
  Eu quero poder criar turmas, matricular alunos e avaliá-los
  Para o andamento e fechamento das notas de uma disciplina

  Cenário: Criar uma nova turma
    Dado que a turma "Engenharia de Software" do ano 2026 e semestre 1 não existe
    Quando eu crio a turma "Engenharia de Software" para o ano 2026, semestre 1
    Então a turma "Engenharia de Software" deve constar na lista de turmas

  Cenário: Matricular um aluno em uma turma
    Dado que a turma "Algoritmos" no ano 2026, semestre 1 já existe
    E que o aluno "Maria Oliveira" com CPF "444.555.666-77" e Email "maria@email.com" já está cadastrado
    Quando eu matriculo o aluno de CPF "444.555.666-77" na turma "Algoritmos"
    Então a turma "Algoritmos" deve conter o aluno de CPF "444.555.666-77" em sua lista de matriculados

  Cenário: Lançar avaliação para um aluno matriculado
    Dado que a turma "Banco de Dados" no ano 2026, semestre 2 já existe
    E que o aluno "Carlos Santos" com CPF "111.222.333-44" e Email "carlos@email.com" já está cadastrado
    E que o aluno de CPF "111.222.333-44" está matriculado na turma "Banco de Dados"
    Quando eu avalio o aluno de CPF "111.222.333-44" na turma "Banco de Dados" com a nota "MA" em "requisitos"
    Então a avaliação do aluno de CPF "111.222.333-44" na turma "Banco de Dados" no critério "requisitos" deve ser "MA"