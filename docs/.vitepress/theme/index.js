import DefaultTheme from 'vitepress/theme'
import ReportSummary from '../../components/ReportSummary.vue'
import HomeReports from '../../components/HomeReports.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReportSummary', ReportSummary)
    app.component('HomeReports', HomeReports)
  }
}
