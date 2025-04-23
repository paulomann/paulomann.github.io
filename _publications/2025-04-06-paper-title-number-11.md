---
title: "Warehousing Data for Brand Health and Reputation with AI-Driven Scores in NewSQL Architectures: Opportunities and Challenges"
collection: publications
category: manuscripts
permalink: /publication/2025-04-06-warehousing
excerpt: 'Explores AI-driven scores in NewSQL architectures for brand health and reputation.'
date: 2025-04-06
venue: 'International Conference on Enterprise Information Systems (ICEIS)'
paperurl: 'https://www.scitepress.org/PublicationsDetail.aspx?ID=9HAH4QCBl2c=&t=1'
image: 'paper11.png'
---
<div style="text-align: justify;">
This study explores the use of NewSQL systems for brand health and reputation analysis, focusing on multidimensional modeling and Data Warehouses. While row-based and relational OLAP systems (ROLAP) struggle to ingest large volumes of data and NoSQL alternatives rely on physically coupled models, NewSQL solutions enable Data Warehouses to maintain their multidimensional schemas, which can be seamlessly implemented across various physical models, including columnar and key-value structures. Additionally, NewSQL provides ACID guarantees for data updates, which is instrumental when data curation involves human supervision. To address these challenges, we propose a Star schema model to analyze brand health and reputation, focusing on the ingestion of large volumes of data from social media and news sources. The ingestion process also includes rapid data labeling through a large language model (GPT-4o), which is later refined by human experts through updates. To validate this approach, we implemented the Star schema in a system called RepSystemand tested it across four NewSQL systems: Google Spanner, CockroachDB, Snowflake, and Amazon Aurora. An extensive evaluation revealed that NewSQL systems significantly outperformed the baseline ROLAP (a multi-sharded PostgreSQL instance) in terms of: (i) data ingestion time, (ii) query performance, and (iii) maintenance and storage. Results also indicated that the primary bottleneck of RepSystem lies in the classification process, which may hinder data ingestion. These findings highlight how NewSQL can overcome the drawbacks of row-based systems while maintaining the logical model, and suggest the potential for integrating AI-driven strategies into data management to optimize both data curation and ingestion.
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