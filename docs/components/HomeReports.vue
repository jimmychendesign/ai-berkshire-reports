<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <section class="home-grid" aria-label="报告列表">
    <a
      v-for="report in theme.reportCards"
      :key="report.link"
      class="report-card"
      :href="report.link"
    >
      <div class="report-card-top">
        <span class="report-ticker">{{ report.ticker }}</span>
        <span :class="['report-rating', report.ratingClass]">{{ report.rating }}</span>
      </div>
      <h2>{{ report.title }}</h2>
      <p>{{ report.description }}</p>
      <dl>
        <div>
          <dt>结论</dt>
          <dd>{{ report.conclusion }}</dd>
        </div>
        <div>
          <dt>估值</dt>
          <dd>{{ report.valuation }}</dd>
        </div>
      </dl>
    </a>
  </section>
</template>
