---
title: "Scalable Reputation Management: A Multi-Task Prompting Approach Using Fine-Tuned PLMs for Sentiment and Topic Classification"
collection: publications
category: manuscripts
permalink: /publication/2025-06-07-reputation
excerpt: 'This study presents a PLM-based framework that streamlines corporate reputation management with efficient, multi-task, multi-company model performance.'
date: 2025-06-07
venue: 'International AAAI Conference on Web and Social Media (ICWSM)'
paperurl: 'https://ojs.aaai.org/index.php/ICWSM/article/view/35898/38052'
image: 'paper12.png'
---
<div style="text-align: justify;">
Social media platforms provide a direct, real-time channel for companies to engage with their audiences, making the management of corporate reputation on social media a pivotal factor for organizational success. Reputation is shaped by factors such as the relationship with the audience, crisis communication, public sentiment, and the topics most frequently associated with the company. Although reputation is often viewed as an intangible asset, it can be quantified and monitored through various metrics. Advances in AI and Pretrained Language Models (PLMs) have automated tasks such as sentiment analysis, sentiment strength assessment, and topic classification, creating new opportunities to manage reputation more efficiently. However, current PLM solutions typically address these tasks individually and require specialized training for each company, limiting scalability and flexibility. To address these challenges, we propose a novel system framework to assist public relations firms by leveraging PLMs for automatic classification. We evaluated this approach through experiments on four companies, comparing zero-shot and fine-tuned models in task-specific and multi-task configurations. Additionally, we explored the transfer of knowledge between client companies using fine-tuned models. Results indicate that multi-task, multi-company fine-tuned PLM models offer simpler system management with competitive performance compared to highly specialized models.
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