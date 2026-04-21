import { Given, When, Then, Before } from '@cucumber/cucumber';
import assert from 'assert';
import { getClasses, addClass, updateClass, deleteClass, toggleStudentEnrollment, updateStudentEvaluation } from '../../src/actions/classes';
import { getStudents, addStudent, deleteStudent } from '../../src/actions/students';

// Hook de limpeza e preparação para a suíte de Turmas
Before(async function () {
  // Limpeza de Turmas e Alunos de teste
  const turmas = await getClasses();
  for (const turma of turmas) {
    if (['Engenharia de Software', 'Algoritmos', 'Banco de Dados', 'Física', 'Cálculo'].includes(turma.description)) {
      await deleteClass(turma.id);
    }
  }

  const alunos = await getStudents();
  for (const aluno of alunos) {
    if (['444.555.666-77', '111.222.333-44'].includes(aluno.cpf)) {
      await deleteStudent(aluno.id);
    }
  }
});

// --- CENÁRIO: Criar uma nova turma ---

Given('que a turma {string} do ano {int} e semestre {int} não existe', async function (nomeDaTurma, ano, semestre) {
  const turmas = await getClasses();
  const encontrada = turmas.find(t => t.description === nomeDaTurma && t.year === ano && t.semester === semestre);
  if (encontrada) {
    await deleteClass(encontrada.id);
  }
});

When('eu crio a turma {string} para o ano {int}, semestre {int}', async function (nomeDaTurma, ano, semestre) {
  await addClass({
    description: nomeDaTurma,
    year: ano,
    semester: semestre,
    enrolledStudents: [],
    evaluations: {}
  });
});

Then('a turma {string} deve constar na lista de turmas', async function (nomeDaTurma) {
  const turmas = await getClasses();
  const encontrada = turmas.find(t => t.description === nomeDaTurma);
  assert.ok(encontrada, `A turma ${nomeDaTurma} não foi encontrada ou não foi persistida.`);
});


// --- CENÁRIO: Matricular um aluno em uma turma ---

Given('que a turma {string} no ano {int}, semestre {int} já existe', async function (nomeDaTurma, ano, semestre) {
  await addClass({
    description: nomeDaTurma,
    year: ano,
    semester: semestre,
    enrolledStudents: [],
    evaluations: {}
  });
});

Given('que o aluno {string} com CPF {string} e Email {string} já está cadastrado', async function (nome, cpf, email) {
  await addStudent({ name: nome, cpf, email });
});

When('eu matriculo o aluno de CPF {string} na turma {string}', async function (cpf, nomeDaTurma) {
  const alunos = await getStudents();
  const aluno = alunos.find(a => a.cpf === cpf);
  assert.ok(aluno, `O aluno de CPF ${cpf} deveria existir no BD.`);

  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  assert.ok(turma, `A turma ${nomeDaTurma} deveria existir no BD.`);

  // toggleStudentEnrollment adiciona caso não exista na turma
  await toggleStudentEnrollment(turma.id, aluno.id);
});

Then('a turma {string} deve conter o aluno de CPF {string} em sua lista de matriculados', async function (nomeDaTurma, cpf) {
  const alunos = await getStudents();
  const aluno = alunos.find(a => a.cpf === cpf);
  assert.ok(aluno, 'Aluno deve existir.');

  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  assert.ok(turma, 'Turma de validação deve existir.');

  assert.ok(turma.enrolledStudents.includes(aluno.id), `Aluno de ID ${aluno.id} deveria estar matriculado.`);
});


// --- CENÁRIO: Lançar avaliação para um aluno matriculado ---

Given('que o aluno de CPF {string} está matriculado na turma {string}', async function (cpf, nomeDaTurma) {
  const alunos = await getStudents();
  const aluno = alunos.find(a => a.cpf === cpf);
  
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  
  if (aluno && turma && !turma.enrolledStudents.includes(aluno.id)) {
    await toggleStudentEnrollment(turma.id, aluno.id);
  }
});

When('eu avalio o aluno de CPF {string} na turma {string} com a nota {string} em {string}', async function (cpf, nomeDaTurma, nota, criterio) {
  const alunos = await getStudents();
  const aluno = alunos.find(a => a.cpf === cpf);
  
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);

  assert.ok(aluno && turma, "Aluno e Turma devem existir.");

  const evaluationPayload: any = {};
  evaluationPayload[criterio] = nota;

  await updateStudentEvaluation(turma.id, aluno.id, evaluationPayload);
});

Then('a avaliação do aluno de CPF {string} na turma {string} no critério {string} deve ser {string}', async function (cpf, nomeDaTurma, criterio, notaEsperada) {
  const alunos = await getStudents();
  const aluno = alunos.find(a => a.cpf === cpf);
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);

  assert.ok(aluno && turma, "Aluno e Turma não encontrados (validação final).");

  const avaliacao = turma.evaluations[aluno.id];
  assert.ok(avaliacao, `Não existe avaliação registrada para o aluno ID ${aluno.id}`);
  assert.strictEqual(avaliacao[criterio as keyof typeof avaliacao], notaEsperada, `A nota de ${criterio} não confere.`);
});

// --- CENÁRIO: Editar dados de uma turma existente ---

When('eu atualizo a turma {string} para o ano {int} e semestre {int}', async function (nomeDaTurma, ano, semestre) {
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  assert.ok(turma, `A turma ${nomeDaTurma} deveria existir para sofrer atualização.`);
  
  await updateClass(turma.id, { year: ano, semester: semestre });
});

Then('os dados retornados para a turma {string} devem conter o ano {int} e semestre {int}', async function (nomeDaTurma, anoEsperado, semestreEsperado) {
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  
  assert.ok(turma, `A turma ${nomeDaTurma} não foi encontrada.`);
  assert.strictEqual(turma.year, anoEsperado, 'O ano não foi atualizado corretamente.');
  assert.strictEqual(turma.semester, semestreEsperado, 'O semestre não foi atualizado corretamente.');
});

// --- CENÁRIO: Excluir uma turma existente ---

When('eu excluo a turma {string}', async function (nomeDaTurma) {
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  
  if (turma) {
    await deleteClass(turma.id);
  }
});

Then('o sistema não deve listar a turma {string} na lista de turmas', async function (nomeDaTurma) {
  const turmas = await getClasses();
  const turma = turmas.find(t => t.description === nomeDaTurma);
  
  assert.strictEqual(turma, undefined, `A turma ${nomeDaTurma} continua na base após a deleção.`);
});
