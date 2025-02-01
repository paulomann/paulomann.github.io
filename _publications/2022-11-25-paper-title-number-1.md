---
title: "Detecting depression from social media data as a multiple-instance learning task"
collection: publications
category: conferences
permalink: /publication/2022-11-25-depression-mil
excerpt: 'Proposes a multiple-instance learning approach for screening depression using social media data.'
date: 2022-11-25
venue: '2022 10th International Conference on Affective Computing and Intelligent Interaction (ACII)'
paperurl: 'https://ieeexplore.ieee.org/document/9953811'
image: 'paper1.png'
---
<div style="text-align: justify;">
Major Depression Disorder (MDD) is a mental condition that causes severe impairments in a person's life. Early detection of such a condition is imperative, especially to detect cases where the person does not even know that they are affected by it. Social media provide a ubiquitous platform with self-generated data that Machine Learning models enhanced with Natural Language Processing mechanisms can extensively explore. Nonetheless, we advocate that previous Machine Learning approaches to early detection of MDD do not adequately model the problem at hand. Most assume that the isolated publications on social media are enough for early detection. This paper proposes a new problem formulation for this task using the multiple-instance learning paradigm. Furthermore, we include a theoretical and experimental analysis of the method on a dataset of Brazilian university students using the transformer and LSTM architectures. The results indicate that the proposed approach yields better accuracy and explanation capabilities than previous studies that do not rely on multiple-instance learning.
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