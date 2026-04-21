# language: pt
Funcionalidade: Gerenciamento de Alunos
  Como um administrador do sistema
  Eu quero poder adicionar, visualizar e remover alunos
  Para que eu possa gerenciar os dados da instituição

  Cenário: Adicionar um novo aluno com sucesso
    Dado que o sistema não possui o aluno "João da Silva" com CPF "123.456.789-00"
    Quando eu adiciono o aluno "João da Silva", CPF "123.456.789-00", Email "joao@email.com"
    Então o sistema deve listar "João da Silva" na lista de alunos registrados

  Cenário: Atualizar o cadastro de um aluno existente
    Dado que um aluno com o nome "Pedro Alves", CPF "333.333.333-33", Email "pedro@email.com" já está cadastrado
    Quando eu atualizo o email do aluno de CPF "333.333.333-33" para "novo-email-pedro@email.com"
    Então os dados retornados para o CPF "333.333.333-33" devem conter o email "novo-email-pedro@email.com"
