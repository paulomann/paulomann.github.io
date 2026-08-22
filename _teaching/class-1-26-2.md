---
title: "Introdução ao Aprendizado de Máquina"
semester: "26-2"
permalink: /teaching/class-1-26-2
professor: "Paulo Mann"
class_code: "ICP363"
program: "Ciência da Computação"
discussion_group: "Discord"
teaching_assistants: "Giovanna Magalhães"
time: "Terça e Quinta, 13:00-15:00"
location: "Ter: LEP1, Qui: F2-010"
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

<div style="text-align: justify;">Desenvolvimento das competências fundamentais de Aprendizado de Máquina.</div>

  <section class="course-section">
    <h2 class="section-title">Informação Básica</h2>
    <div class="section-content">
      <p>A plataforma de comunicação principal será o grupo no classroom.</p>
      <p>As aulas serão presenciais.</p>
      <ul class="class-info">
        <li><strong>Atendimento:</strong> sob demanda. </li>
        <li><strong>Horário:</strong> {{ page.time }}</li>
        <li><strong>Local:</strong> {{ page.location }}</li>
        <li><strong>Monitor(a):</strong> <a href="mailto:giovannaml@ic.ufrj.br?subject=Monitoria%20Turma%20IAM%20(ICP363)&body=Oi%20Giovanna,%0A%0A[Sua%20mensagem%20aqui]%0A%0AAbs," 
   style="color: #2a6496; text-decoration: underline;">
          {{ page.teaching_assistants }}
        </a></li>
      </ul>
    </div>
  </section>

  <section class="course-section">
    <h2 class="section-title">Ementa</h2>
    <div class="section-content">
      <ol class="curriculum-list">
        <li>Contextualizando o aprendizado de máquina (história e paradigmas)</li>
        <li>Questões éticas</li>
        <li>Tipos de aprendizado de máquina: supervisionado, não supervisionado, por reforço</li>
        <li>Métricas de avaliação</li>
        <li>Métodos de aprendizado: classificação (árvore de decisão, regressão linear, regressão logística, classificador Bayesiano, redes neurais, CART), agrupamento (K-means, classificação hierárquico)</li>
        <li>Redes neurais, redes neurais recorrentes, redes convolucionais, e transformers.</li>
      </ol>
    </div>
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
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/01_ml_basics/" style="color: #2a6496; text-decoration: underline;">Capítulo 1</a></td>
                    <td>Introdução, Dados</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 13/08</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/01_ml_basics/" style="color: #2a6496; text-decoration: underline;">Capítulo 1</a></td>
                    <td>Introdução, Dados</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 18/08</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/02_supervised_regression/" style="color: #2a6496; text-decoration: underline;">Capítulo 2</a></td>
                    <td>Numpy, Pandas, Matplotlib, Scikit-learn</td>
                    <td>
                        <a href="{{ '/files/machine_learning/01_intro_linear_regression.ipynb' | relative_url }}">[Notebook 1]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 20/08</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/01_ml_basics/" style="color: #2a6496; text-decoration: underline;">Capítulo 1</a></td>
                    <td>Tarefas, Modelos e Parâmetros, Aprendizagem</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 25/08</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/01_ml_basics/" style="color: #2a6496; text-decoration: underline;">Capítulo 1</a></td>
                    <td>Funções de Perda, Otimização, Componentes de Aprendizagem</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 27/08</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/02_supervised_regression/" style="color: #2a6496; text-decoration: underline;">Capítulo 2</a></td>
                    <td>Modelos Lineares, Função de perda L2, o Método dos Mínimos Quadrados</td>
                    <td>
                        <a href="{{ '/files/machine_learning/01_intro_linear_regression.ipynb' | relative_url }}">[Notebook 1]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 01/09</td>
                    <td>&mdash;</td>
                    <td>Atividade de Regressão Linear</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 03/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/02_supervised_regression/" style="color: #2a6496; text-decoration: underline;">Capítulo 2</a></td>
                    <td>Modelos de regressão polinomial, Função de perda L1</td>
                    <td>
                        <a href="{{ '/files/machine_learning/02_gradient_descent.ipynb' | relative_url }}">[Notebook 2]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 08/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/03_supervised_classification/" style="color: #2a6496; text-decoration: underline;">Capítulo 3</a></td>
                    <td>A tarefa de classificação, Definições Básicas</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 10/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/03_supervised_classification/" style="color: #2a6496; text-decoration: underline;">Capítulo 3</a></td>
                    <td>Classificadores Lineares, Regressão Logística</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 15/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/03_supervised_classification/" style="color: #2a6496; text-decoration: underline;">Capítulo 3</a></td>
                    <td>Regressão Logística</td>
                    <td>
                        <a href="{{ '/files/machine_learning/03_logistic_regression.ipynb' | relative_url }}">[Notebook 3]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 17/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/03_supervised_classification/" style="color: #2a6496; text-decoration: underline;">Capítulo 3</a></td>
                    <td>LDA, QDA</td>
                    <td>
                        <a href="{{ '/files/machine_learning/04_discriminant_analysis.ipynb' | relative_url }}">[Notebook 4]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 22/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/03_supervised_classification/" style="color: #2a6496; text-decoration: underline;">Capítulo 3</a></td>
                    <td>Naive Bayes</td>
                    <td>
                        <a href="{{ '/files/machine_learning/05_naive_bayes.ipynb' | relative_url }}">[Notebook 5]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 24/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/05_knn/" style="color: #2a6496; text-decoration: underline;">Capítulo 5</a></td>
                    <td>k-Vizinhos mais Próximos (KNN)</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 29/09</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/04_evaluation/" style="color: #2a6496; text-decoration: underline;">Capítulo 4</a>, <a href="{{ '/files/slides_bias_variance_resampling_metrics.pdf' | relative_url }}" style="color: #2a6496; text-decoration: underline;">Slides de Bias-Variance</a></td>
                    <td>Bias-Variance</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 01/10</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/04_evaluation/" style="color: #2a6496; text-decoration: underline;">Capítulo 4</a>, <a href="{{ '/files/slides_bias_variance_resampling_metrics.pdf' | relative_url }}" style="color: #2a6496; text-decoration: underline;">Slides de Bias-Variance</a></td>
                    <td>Reamostragem: holdout, validação cruzada, bootstrap</td>
                    <td>
                        <a href="{{ '/files/machine_learning/06_avaliacao_kfold.ipynb' | relative_url }}">[Notebook 6]</a>
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
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/04_evaluation/" style="color: #2a6496; text-decoration: underline;">Capítulo 4</a>, <a href="{{ '/files/slides_bias_variance_resampling_metrics.pdf' | relative_url }}" style="color: #2a6496; text-decoration: underline;">Slides de Bias-Variance</a></td>
                    <td>Métricas de avaliação</td>
                    <td>
                        <a href="{{ '/files/machine_learning/06_avaliacao_kfold.ipynb' | relative_url }}">[Notebook 6]</a>
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 15/10</td>
                    <td colspan="3" style="text-align: center; font-weight: bold;">Plantão de Dúvidas</td>
                </tr>
        
                <tr>
                    <td>Ter 20/10</td>
                    <td colspan="3" style="text-align: center; font-weight: bold; color: blue;">P1</td>
                </tr>
        
                <tr>
                    <td>Qui 22/10</td>
                    <td colspan="3" style="text-align: center; font-weight: bold;">Resolução da P1</td>
                </tr>
        
                <tr>
                    <td>Ter 27/10</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/06_cart/" style="color: #2a6496; text-decoration: underline;">Capítulo 6</a></td>
                    <td>Árvores de decisão (CART)</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 29/10</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/06_cart/" style="color: #2a6496; text-decoration: underline;">Capítulo 6</a></td>
                    <td>Árvores de decisão (CART): poda e regularização</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 03/11</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/07_forests/" style="color: #2a6496; text-decoration: underline;">Capítulo 7</a></td>
                    <td>Random Forests</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 05/11</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/08_neural_networks/" style="color: #2a6496; text-decoration: underline;">Capítulo 8</a></td>
                    <td>Redes Neurais</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 10/11</td>
                    <td><a href="https://slds-lmu.github.io/i2ml/chapters/08_neural_networks/" style="color: #2a6496; text-decoration: underline;">Capítulo 8</a></td>
                    <td>Redes Neurais: treinamento e backpropagation</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 12/11</td>
                    <td>&mdash;</td>
                    <td>Redes convolucionais</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 17/11</td>
                    <td>&mdash;</td>
                    <td>Redes recorrentes e Transformers</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Qui 19/11</td>
                    <td>&mdash;</td>
                    <td>Agrupamento: K-means e agrupamento hierárquico</td>
                    <td>
                        &mdash;
                    </td>
                </tr>
        
                <tr>
                    <td>Ter 24/11</td>
                    <td>&mdash;</td>
                    <td>Questões éticas em aprendizado de máquina</td>
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
        <li>James, G., Witten, D., Hastie, T., Tibshirani, R., & Taylor, J. (2023). Statistical learning. In An introduction to statistical learning: With applications in Python. Cham: Springer International Publishing.</li>
        <li>Introduction to Machine Learning - Ludwig Maximilian University of Munich (LMU Munich). Disponível em <a href="https://slds-lmu.github.io/i2ml/">https://slds-lmu.github.io/i2ml/</a></li>
      </ul>
    </div>
    <div class="bibliography-category">
      <h3>Bibliografia Secundária</h3>
      <ul>
        <li>I. Goodfellow, Y. Bengio, A. Courville. Deep Learning. MIT Press, 2016. Disponível em <a href="https://www.deeplearningbook.org">https://www.deeplearningbook.org</a></li>
      </ul>
    </div>
  </div>
</section>

  <section class="course-section">
    <h2 class="section-title">Avaliação</h2>
    <div class="section-content">
      <ul class="evaluation">
        <li>✅ 2 Provas individuais escritas (P1/P2)</li>
        <li>✅ 1 Prova de Reposição (PR) - apenas com justificativa de acordo com o regulamento da universidade. Substitui apenas uma nota (P1 ou P2).</li>
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