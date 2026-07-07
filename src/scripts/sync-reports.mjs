import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const researchDir = path.join(docsDir, 'research')
const reportsDir = path.join(docsDir, 'reports')
const configDataFile = path.join(docsDir, '.vitepress', 'reports.data.mjs')
const indexFile = path.join(docsDir, 'index.md')

function slugify(fileName) {
  const base = fileName.replace(/\.md$/i, '')
  const ascii = base
    .replace(/投资研究报告/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return ascii || encodeURIComponent(base)
}

function firstMatch(content, patterns, fallback = '') {
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match?.[1]) return clean(match[1])
  }
  return fallback
}

function clean(value) {
  return value
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value, max = 110) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

function inferTicker(title, fileName) {
  const fromTitle = title.match(/[（(]([A-Z0-9.-]{2,8})[）)]/)
  if (fromTitle) return fromTitle[1]
  const fromFile = fileName.match(/[A-Z]{2,6}/)
  return fromFile?.[0] || 'REPORT'
}

function buildSummary(content) {
  const conclusion = firstMatch(content, [
    /投资建议：([^；。\n]+[；。]?[^。\n]*)/,
    /一句话结论\s*\n+\s*([^#\n]+)/
  ], '详见正文结论')

  const moat = firstMatch(content, [
    /真正的护城河[^，。]*[，。]([^。\n]+)/,
    /护城河[^：:]*[:：]\s*([^。\n]+)/
  ], '围绕客户认证、转换成本、规模效应与技术壁垒展开')

  const financial = firstMatch(content, [
    /2025 年收入\s*([^。]+。?)/,
    /TTM 收入\s*\|\s*([^|]+)\|/
  ], '重点查看收入、利润率、现金流与资产负债表')

  const valuation = firstMatch(content, [
    /安全边际[^。]*?(\$[0-9]+-\$[0-9]+[^。]*)/,
    /安全边际价格区间约\s*([^，。]+)/
  ], '详见估值与安全边际章节')

  const risk = firstMatch(content, [
    /最大风险[^|]*\|\s*([^|]+)\|/,
    /空方核心论点：([^。\n]+)/
  ], '估值、客户集中、扩产和现金流兑现风险')

  const catalyst = firstMatch(content, [
    /加仓信号\s*\|\s*([^|]+)\|/,
    /连续两个季度([^。\n]+)/
  ], '收入超指引、毛利率改善、经营现金流转正')

  return {
    conclusion: truncate(conclusion, 95),
    moat: truncate(moat, 95),
    financial: truncate(financial, 95),
    valuation: truncate(valuation, 95),
    risk: truncate(risk, 95),
    catalyst: truncate(catalyst, 95)
  }
}

function frontmatter(title, summary) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    'outline: deep',
    '---',
    '',
    '<ReportSummary',
    `  conclusion=${JSON.stringify(summary.conclusion)}`,
    `  moat=${JSON.stringify(summary.moat)}`,
    `  financial=${JSON.stringify(summary.financial)}`,
    `  valuation=${JSON.stringify(summary.valuation)}`,
    `  risk=${JSON.stringify(summary.risk)}`,
    `  catalyst=${JSON.stringify(summary.catalyst)}`,
    '/>',
    ''
  ].join('\n')
}

async function findResearchReports() {
  const entries = await readdir(researchDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .filter((entry) => !entry.name.toLowerCase().startsWith('readme'))
    .map((entry) => entry.name)
}

async function main() {
  await mkdir(reportsDir, { recursive: true })
  const files = await findResearchReports()
  const reports = []

  for (const fileName of files) {
    const source = path.join(researchDir, fileName)
    const content = await readFile(source, 'utf8')
    const title = clean(content.match(/^#\s+(.+)$/m)?.[1] || fileName.replace(/\.md$/i, ''))
    const slug = slugify(fileName)
    const ticker = inferTicker(title, fileName)
    const summary = buildSummary(content)
    const targetContent = `${frontmatter(title, summary)}\n${content.trim()}\n`
    await writeFile(path.join(reportsDir, `${slug}.md`), targetContent)

    reports.push({
      title,
      ticker,
      link: `/reports/${slug}`,
      description: truncate(firstMatch(content, [/## 1\. 一句话结论\s*\n+\s*([^#\n]+)/], summary.conclusion), 130),
      conclusion: summary.conclusion,
      valuation: summary.valuation,
      rating: summary.conclusion.includes('观望') ? '观望' : '研究',
      ratingClass: summary.conclusion.includes('观望') ? 'watch' : 'neutral'
    })
  }

  reports.sort((a, b) => a.ticker.localeCompare(b.ticker))

  const sidebarReports = reports.map(({ title, link }) => ({ text: title, link }))
  await writeFile(
    configDataFile,
    `export const reportCards = ${JSON.stringify(reports, null, 2)}\nexport const sidebarReports = ${JSON.stringify(sidebarReports, null, 2)}\n`
  )

  await writeFile(
    indexFile,
    [
      '---',
      'layout: doc',
      'title: 投研报告',
      '---',
      '',
      '<section class="home-hero">',
      '  <div class="eyebrow">AI Berkshire Research</div>',
      '  <h1>投研报告库</h1>',
      '  <p>把 ai-berkshire 生成的 Markdown 报告整理成可检索、可导航、适合长文阅读的静态网页。</p>',
      '</section>',
      '',
      '<HomeReports />',
      ''
    ].join('\n')
  )

  console.log(`Synced ${reports.length} report(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
