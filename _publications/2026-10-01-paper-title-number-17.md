---
title: "Can Low-Parameter LLMs Provide Trustworthy Simulations of Human BDI-II Responses? A Comparison of Biodemographic and Instagram-Based Context Profiles"
collection: publications
category: conferences
permalink: /publication/2026-10-01-llm-bdi-ii-simulation
excerpt: 'A comparison of low-parameter LLMs simulating BDI-II responses using biodemographic profiles and Instagram posts, examining how faithfully they represent individual differences.'
date: 2026-10-01
venue: '36th Brazilian Conference on Intelligent Systems (BRACIS)'
paperurl: 'https://doi.org/10.1007/978-3-032-39895-6_41'
image: 'paper17.png'
image_fit: contain
image_alt: 'PCA plots comparing human BDI-II responses with Mistral using Instagram context and Gemma 3 using biodemographic context, colored by depression severity.'
---
<p><strong>Authors:</strong> Giovanna Magalhães Lavouras, Silas Lima Filho, and Paulo Mann.</p>

<div style="text-align: justify;">
This study evaluates whether publicly available low-parameter large language models can faithfully simulate human responses to the Beck Depression Inventory-II (BDI-II). It compares prompting strategies using personas constructed from biodemographic information or Instagram posts, with real participants' questionnaire responses serving as ground truth. The analysis examines both response accuracy and the preservation of individual differences. Results vary across models and experimental settings: some produce overly uniform representations, while others, particularly with Instagram context, capture more nuanced differences. The findings identify limitations that must be addressed before these models can reliably simulate human participants in psychological research.
</div>

<figure>
  <a href="{{ page.image | prepend: '/images/' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ page.image | prepend: '/images/' | relative_url }}" alt="{{ page.image_alt }}" width="1798" height="742" style="width: 100%; height: auto;">
  </a>
</figure>

<a href="{{ page.paperurl }}" target="_blank" rel="noopener noreferrer" class="btn--download">
  <i class="fas fa-external-link-alt" aria-hidden="true"></i>View Paper on Springer
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
