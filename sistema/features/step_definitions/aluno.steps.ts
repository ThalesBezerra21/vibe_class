import { Given, When, Then, Before } from '@cucumber/cucumber';
import assert from 'assert';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../src/actions/students';

// Setup: Limpeza inicial do arquivo de banco (data/students.json)
Before(async function () {
  const alunos = await getStudents();
  for (const aluno of alunos) {
    if (aluno.name?.includes("CucumberTest") || aluno.cpf === "123.456.789-00" || aluno.cpf === "333.333.333-33" || aluno.cpf === "999.888.777-66") {
      await deleteStudent(aluno.id);
    }
  }
});

// --- CENÁRIO: Adicionar um novo aluno com sucesso ---

Given('que o sistema não possui o aluno {string} com CPF {string}', async function (nome, cpf) {
  const alunos = await getStudents();
  const existe = alunos.find(a => a.cpf === cpf);
  if (existe) {
    await deleteStudent(existe.id);
  }
});

When('eu adiciono o aluno {string}, CPF {string}, Email {string}', async function (nome, cpf, email) {
  await addStudent({ name: nome, cpf, email });
});

Then('o sistema deve listar {string} na lista de alunos registrados', async function (nome) {
  const alunos = await getStudents();
  const encontrou = alunos.find(a => a.name === nome);
  assert.ok(encontrou, `Aluno ${nome} não foi encontrado no sistema.`);
});


// --- CENÁRIO: Atualizar o cadastro de um aluno existente ---

Given('que um aluno com o nome {string}, CPF {string}, Email {string} já está cadastrado', async function (nome, cpf, email) {
  await addStudent({ name: nome, cpf, email });
});

When('eu atualizo o email do aluno de CPF {string} para {string}', async function (cpf, novoEmail) {
  const alunos = await getStudents();
  const alunoAlvo = alunos.find(a => a.cpf === cpf);
  
  if (alunoAlvo) {
    await updateStudent(alunoAlvo.id, {
      name: alunoAlvo.name,
      cpf: alunoAlvo.cpf,
      email: novoEmail
    });
  }
});

Then('os dados retornados para o CPF {string} devem conter o email {string}', async function (cpf, emailEsperado) {
  const alunos = await getStudents();
  const atualizado = alunos.find(a => a.cpf === cpf);
  
  assert.ok(atualizado, "O aluno deveria continuar existindo.");
  assert.strictEqual(atualizado.email, emailEsperado, "O email não foi atualizado da forma correta.");
});

// --- CENÁRIO: Excluir um aluno existente ---

When('eu excluo o aluno de CPF {string}', async function (cpf) {
  const alunos = await getStudents();
  const alunoAlvo = alunos.find(a => a.cpf === cpf);
  
  if (alunoAlvo) {
    await deleteStudent(alunoAlvo.id);
  }
});

Then('o sistema não deve listar o aluno de CPF {string} na lista de alunos registrados', async function (cpf) {
  const alunos = await getStudents();
  const encontrou = alunos.find(a => a.cpf === cpf);
  
  assert.strictEqual(encontrou, undefined, `Aluno de CPF ${cpf} ainda foi encontrado no sistema.`);
});