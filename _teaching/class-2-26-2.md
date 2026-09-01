---
title: "Algoritmos e Grafos"
semester: "26-2"
permalink: /teaching/class-2-26-2
professor: "Paulo Mann"
class_code: "ICP368"
program: "Ciência da Computação"
discussion_group: "Discord"
teaching_assistants: "Francisco Florencio"
time: "Terça e Quinta, 10:00-12:00"
location: "F2-010 (CCMN)"
layout: custom-teaching
---

<div class="course-container">
  <header class="course-header">
    <h1>{{ page.title }}</h1>
    <div class="course-metadata">
      <div class="metadata-item">
        <span class="label">Semestre:</span>
        <span class="value">{{ page.semester }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">Código:</span>
        <span class="value">{{ page.class_code }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">Professor:</span>
        <span class="value">{{ page.professor }}</span>
      </div>
    </div>
  </header>

<div style="text-align: justify;">Nesta disciplina, iremos ver problemas clássicos em Teoria dos Grafos, que servirão de pano de fundo para a compreensão de técnicas de desenvolvimento e análise de algoritmos, ao mesmo tempo em que familiarizam o aluno com a representação e manipulação de grafos no computador.</div>

  <section class="course-section">
    <h2 class="section-title">Informação Básica</h2>
    <div class="section-content">
      <p>A plataforma de comunicação principal será o grupo no classroom.</p>
      <p>As aulas serão presenciais.</p>
      <ul class="class-info">
        <li><strong>Atendimento:</strong> sob demanda. </li>
        <li><strong>Horário:</strong> {{ page.time }}</li>
        <li><strong>Local:</strong> {{ page.location }}</li>
        <li><strong>Monitor(a):</strong> <a href="mailto:franciscotaf@ic.ufrj.br?subject=Monitoria%20Turma%20Algoritmos%20e%20Grafos%20(ICP368)&body=Oi%20Francisco,%0A%0A[Sua%20mensagem%20aqui]%0A%0AAbs," 
   style="color: #2a6496; text-decoration: underline;">
          {{ page.teaching_assistants }}
        </a></li>
      </ul>
    </div>
  </section>

  <section class="course-section">
    <h2 class="section-title">Ementa</h2>
    Representação de Grafos; Ordenação Topológica; Buscas em grafos e Digrafos (largura e profundidade); Técnicas de Desenvolvimento de Algoritmos; Decomposição; Recursão; Algoritmo Guloso; Programação Dinâmica; Aplicação das Técnicas Usadas; Fluxo Máximo.
  </section>

<div class="schedule-container">
 <h2 class="section-title">Cronograma Planejado</h2>

    <div class="ufrj-schedule">
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Leituras</th>
                    <th>Conteúdo</th>
                    <th>Material</th>
                </tr>
            </thead>
            <tbody>
    
                <tr>
                    <td>Ter 11/08</td>
                    <td>Capítulo 20.1 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Representação de grafos no computador; algoritmos básicos de inserção, remoção e consulta em grafos direcionados e não direcionados</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/mit/recitation_graphs_bfs.pdf">[Nota de aula do MIT]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 13/08</td>
                    <td>Capítulo 20.1 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Representação de grafos no computador; algoritmos básicos de inserção, remoção e consulta em grafos direcionados e não direcionados</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/mit/recitation_graphs_bfs.pdf">[Nota de aula do MIT]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 18/08</td>
                    <td>Capítulo 20.1 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Representação de grafos no computador; algoritmos básicos de inserção, remoção e consulta em grafos direcionados e não direcionados</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/mit/recitation_graphs_bfs.pdf">[Nota de aula do MIT]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 20/08</td>
                    <td>Capítulo 20.2 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Busca em Largura e Subgrafo Predecessor</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/graphs_dfs_bfs.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 25/08</td>
                    <td>Capítulo 20.2 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Busca em Largura e Subgrafo Predecessor</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/graphs_dfs_bfs.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 27/08</td>
                    <td>&mdash;</td>
                    <td>Atividade de Busca em Largura</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 01/09</td>
                    <td>Capítulo 20.2 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Busca em Largura e Subgrafo Predecessor</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/graphs_dfs_bfs.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 03/09</td>
                    <td>Capítulos 20.3 e 20.4 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Busca em Profundidade, Classificação de arestas e Ordenação Topológica</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/graphs_dfs_bfs.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 08/09</td>
                    <td>Capítulo 20.5 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Aplicações de DFS: Componentes Fortemente Conexos</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/sccs.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 10/09</td>
                    <td>&mdash;</td>
                    <td>Atividade de Busca em Profundidade</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 15/09</td>
                    <td>Capítulo 15.1 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Problemas de otimização, método guloso, o problema da árvore geradora mínima</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/celso_ribeiro/02 Vienna 02 - Complexity v3.pdf">[Slides do Prof. Celso Ribeiro]</a></li>
                            <li><a href="/files/lecture_notes/celso_ribeiro/03b Vienna 03 - Constructive heuristics.pdf">[Slides do Prof. Celso Ribeiro]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 17/09</td>
                    <td>Capítulos 21.0 e 21.1 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Árvore geradora mínima: algoritmo genérico e prova para identificar arestas seguras</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/minimum_spanning_trees.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 22/09</td>
                    <td>Capítulo 21.2 do Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</td>
                    <td>Árvore geradora mínima: algoritmos de Kruskal e Prim</td>
                    <td>
                        <ul>
                            <li><a href="/files/lecture_notes/stanford/minimum_spanning_trees.pdf">[Nota de aula de Stanford]</a></li>
                        </ul>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 24/09</td>
                    <td>&mdash;</td>
                    <td>Exercícios da Lista 1</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 29/09</td>
                    <td colspan="3" style="text-align: center; font-weight: bold; color: blue;">P1</td>
                </tr>
        
                <tr>
                    <td>Qui 01/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 06/10</td>
                    <td colspan="3" style="text-align: center; font-weight: bold;">Sem aula: semana da integração acadêmica (SIAC)</td>
                </tr>
        
                <tr>
                    <td>Qui 08/10</td>
                    <td colspan="3" style="text-align: center; font-weight: bold;">Sem aula: semana da integração acadêmica (SIAC)</td>
                </tr>
        
                <tr>
                    <td>Ter 13/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 15/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 20/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 22/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 27/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 29/10</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 03/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 05/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 10/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 12/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 17/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 19/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 24/11</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 26/11</td>
                    <td colspan="3" style="text-align: center; font-weight: bold; color: blue;">P2</td>
                </tr>
        
                <tr>
                    <td>Ter 01/12</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 03/12</td>
                    <td colspan="3" style="text-align: center; font-weight: bold; color: blue;">PR</td>
                </tr>
        
                <tr>
                    <td>Ter 08/12</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 10/12</td>
                    <td colspan="3" style="text-align: center; font-weight: bold; color: blue;">PF</td>
                </tr>
        
                <tr>
                    <td>Ter 15/12</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 17/12</td>
                    <td>&mdash;</td>
                    <td>&mdash;</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
            </tbody>
        </table>
    </div>
    
</div>

<section class="course-section">
  <h2 class="section-title">Bibliografia</h2>
  <div class="section-content">
    <div class="bibliography-category">
      <h3>Bibliografia Primária</h3>
      <ul>
        <li>Cormen, Thomas H., et al. Introduction to algorithms. MIT press, 2022.</li>
      </ul>
    </div>
    <div class="bibliography-category">
      <h3>Bibliografia Secundária</h3>
      <ul>
        <li>Teoria Computacional de Grafos; os algoritmos. Jayme Luiz Swarcfiter, Fabiano S. Oliveira e Paulo E. D. Pinto. Elsevier, 2018.</li>
      </ul>
    </div>
  </div>
</section>

  <section class="course-section">
    <h2 class="section-title">Avaliação</h2>
    <div class="section-content">
      <ul class="evaluation">
        <li>✅ 2 Provas (P1/P2)</li>
        <li>✅ 1 Prova de Reposição (PR) - apenas com comprovante de acordo com o regulamento da universidade. Substitui apenas uma nota (P1 ou P2).</li>
        <li>✅ 1 Prova Final (PF)</li>
      </ul>
      <div class="formula">
        <small>MP = (P1 + P2) / 2</small><br>
        <small>Se MP < 3 → Reprovado</small><br>
        <small>Se MP ≥ 7 → Aprovado</small><br>
        <small>Se 3 ≤ MP < 7 → Então o aluno faz a Prova Final (PF)</small><br>
        <small>Se (MP + PF) / 2 ≥ 5 → Aprovado</small><br>
        <small>Se (MP + PF) / 2 < 5 → Reprovado</small>
      </div>
    </div>
  </section>

  <div class="navigation">
    <a href="/teaching" class="back-button">← Voltar às Disciplinas</a>
  </div>
</div>

<style>
.course-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.course-header {
  text-align: center;
  margin-bottom: 2rem;
}

.course-header h1 {
  color: #2a6496;
  margin-bottom: 0.5rem;
}

.course-meta {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.section-title {
  color: #2a6496;
  border-bottom: 2px solid #2a6496;
  padding-bottom: 0.5rem;
  margin-top: 2rem;
}

.section-content {
  margin: 1.5rem 0;
  line-height: 1.6;
}

.class-info {
  list-style: none;
  padding-left: 0;
}

.curriculum-list {
  padding-left: 1.5rem;
}

.bibliography li {
  margin-bottom: 1rem;
}

.exercise-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.exercise-table th,
.exercise-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.exercise-table th {
  background-color: #2a6496;
  color: white;
}

.evaluation {
  list-style: none;
  padding-left: 0;
}

.formula {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}

.back-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #2a6496;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 2rem;
}

.back-button:hover {
  background-color: #1d4568;
}

@media (max-width: 768px) {
  .course-container {
    padding: 1rem;
  }
  
  .exercise-table {
    display: block;
    overflow-x: auto;
  }
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
}

.schedule-table th {
  background-color: #2a6496;
  color: white;
  padding: 12px;
  text-align: left;
}

.schedule-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

[contenteditable="true"] {
  min-width: 200px;
  padding: 8px;
  border: 1px dashed #ccc;
}

[contenteditable="true"]:focus {
  background-color: #f8f9fa;
  outline: none;
}
</style>