---
title: "How Context Injection Shapes Creativity in LLM-Generated Alternative Uses"
collection: publications
category: conferences
permalink: /publication/2026-06-29-context-injection-creativity
excerpt: 'Four types of injected context are compared on the Alternative Uses Test, showing that context type steers LLM outputs toward distinct creativity profiles rather than giving a uniform boost.'
date: 2026-06-29
venue: '17th International Conference on Computational Creativity (ICCC)'
paperurl: '/files/paper_creativity_iccc26.pdf'
image: 'paper16.png'
---
<div style="text-align: justify;">
Context injection influences large language model (LLM) outputs across many tasks, but its effect on divergent-ideation measures is underexplored. We systematically inject four types of context (object-focused, semantically related, unrelated, and random) into Alternative Uses Test (AUT) prompts and evaluate responses from four open-weight LLMs using both LLM-judged proxy metrics (creativity, novelty, value) and automated text metrics, including clustering-based flexibility. The main finding is metric divergence: no single context type optimises all evaluated dimensions at once. Instead, different context types steer outputs toward distinct evaluated profiles; for instance, random context maximises judged novelty while unrelated context uniquely increases categorical flexibility. These results indicate that context type determines the direction of measured output change rather than providing a uniform creativity boost, offering practical guidance for matching prompting strategy to target outcome.
</div>

<a href="{{ page.paperurl }}" target="_blank" class="btn--download">
  <i class="fas fa-file-pdf"></i>Download Full Paper
</a>

<style>
.btn--download {
  display: inline-block;
  padding: 12px 25px;
  background-color: #2a6496;
  color: white !important;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-weight: 500;
  margin-top: 15px;
  border: 2px solid #1d4568;
}

.btn--download:hover {
  background-color: #1d4568;
  text-decoration: none;
}

.btn--download i {
  margin-right: 8px;
}
</style>