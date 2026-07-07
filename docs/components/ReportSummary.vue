<script setup>
const props = defineProps({
  conclusion: { type: String, default: '' },
  moat: { type: String, default: '' },
  financial: { type: String, default: '' },
  valuation: { type: String, default: '' },
  risk: { type: String, default: '' },
  catalyst: { type: String, default: '' }
})

const items = [
  { key: 'conclusion', icon: '🎯', label: '投资结论', value: props.conclusion },
  { key: 'moat', icon: '🏰', label: '护城河', value: props.moat },
  { key: 'financial', icon: '💵', label: '财务', value: props.financial },
  { key: 'valuation', icon: '📐', label: '估值', value: props.valuation },
  { key: 'risk', icon: '⚠️', label: '风险', value: props.risk },
  { key: 'catalyst', icon: '⚡', label: '催化剂', value: props.catalyst }
].filter((item) => item.value)
</script>

<template>
  <section class="report-summary" aria-label="报告摘要">
    <article v-for="item in items" :key="item.key" class="summary-card">
      <div class="summary-icon" aria-hidden="true">{{ item.icon }}</div>
      <div>
        <div class="summary-label">{{ item.label }}</div>
        <p>{{ item.value }}</p>
      </div>
    </article>
  </section>
</template>
