---
title: "VIBES--Vision Backbone Efficient Selection"
collection: publications
category: conferences
permalink: /publication/2024-10-11-vibes
excerpt: 'Presents an efficient framework for selecting vision backbones in deep learning architectures.'
date: 2024-10-11
venue: 'arXiv preprint'
paperurl: 'https://arxiv.org/pdf/2410.08592v1.pdf'
image: 'paper3.png'
---

<div style="text-align: justify;">
This work tackles the challenge of efficiently selecting high-performance pre-trained vision backbones for specific target tasks. Although exhaustive search within a finite set of backbones can solve this problem, it becomes impractical for large datasets and backbone pools. To address this, we introduce Vision Backbone Efficient Selection (VIBES), which aims to quickly find well-suited backbones, potentially trading off optimality for efficiency. We propose several simple yet effective heuristics to address VIBES and evaluate them across four diverse computer vision datasets. Our results show that these approaches can identify backbones that outperform those selected from generic benchmarks, even within a limited search budget of one hour on a single GPU. We reckon VIBES marks a paradigm shift from benchmarks to task-specific optimization.</div>

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