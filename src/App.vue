<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon-wrapper">
            <span class="logo-icon">📊</span>
          </div>
          <div class="logo-text">
            <h1 class="main-title">大学生就业分析</h1>
            <p class="sub-title">时代变迁与 AI 浪潮下的专业抉择</p>
          </div>
        </div>

        <div class="controls-section">
          <div v-if="isStoryMode" class="mode-toggle-wrapper">
            <button
              @click="toggleMode"
              class="mode-toggle-btn"
            >
              探索数据
            </button>
          </div>

          <div v-if="!isStoryMode" class="filter-group">
            <div class="filter-item">
              <label class="filter-label">学历</label>
              <select
                v-model="educationLevel"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="all">全部</option>
                <option value="undergraduate">本科</option>
                <option value="graduate">研究生</option>
              </select>
            </div>

            <div class="filter-item">
              <label class="filter-label">地区</label>
              <select
                v-model="region"
                class="filter-select"
                @change="handleFilterChange"
              >
                <option value="all">全国</option>
                <option value="east">东部</option>
                <option value="central">中部</option>
                <option value="west">西部</option>
              </select>
            </div>

            <div class="filter-item mode-btn-item">
              <button
                @click="toggleMode"
                class="mode-toggle-btn explore-mode-btn"
              >
                故事模式
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div v-if="isStoryMode" class="story-mode-full">
      <TimelineStory
        :timeSeriesData="timeSeriesData"
        :riverChartData="riverChartData"
        @step-change="updateSelectedYear"
        @close="isStoryMode = false"
      />
    </div>

    <main v-else class="main-content">
      <div class="explore-mode">
        <div class="research-intro">
          <div class="intro-card">
            <div class="intro-header">
              <h2 class="intro-title">研究背景与目的</h2>
            </div>
            <div class="intro-content">
              <div class="intro-section">
                <h3 class="section-title">背景介绍</h3>
                <p class="section-text">
                  随着中国高等教育规模的持续扩大，大学生就业问题已成为社会关注的焦点。过去二十年，中国经历了从传统制造业到移动互联网，再到人工智能大模型的深刻变革。这些技术变革不仅重塑了就业市场结构，也对高校专业设置和人才培养提出了新的挑战。
                </p>
              </div>
              <div class="intro-section">
                <h3 class="section-title">研究目的</h3>
                <p class="section-text">
                  本可视化项目旨在通过多维度数据分析，揭示2004-2024年间大学生就业市场的演变规律，帮助政策制定者、教育机构和学生更好地理解就业市场的动态变化。
                </p>
              </div>
              <div class="intro-section">
                <h3 class="section-title">数据说明</h3>
                <p class="section-text">
                  数据来源于国家统计局、教育部及各大招聘平台的行业报告，覆盖全国范围，包含本科和研究生两个学历层次，涵盖19个主要学科专业。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="charts-sections">
          <div class="analysis-section">
            <div class="section-header">
              <div class="section-number">01</div>
              <div class="section-info">
                <h2 class="section-title">就业形势演变分析</h2>
                <p class="section-description">
                  通过时间序列分析，我们可以观察到大学生就业市场在过去二十年的宏观变化趋势。就业率受宏观经济周期影响呈现明显的周期性波动，而平均薪资则随着经济发展稳步上升。特别值得关注的是2020年之后，受疫情和经济转型双重影响，就业市场出现了新的结构性变化。
                </p>
              </div>
            </div>
            <div class="section-chart">
              <div class="chart-container">
                <h3 class="chart-title">时代总览</h3>
                <TimeSeries
                  :data="timeSeriesData"
                  :selectedYear="selectedYear"
                  @year-change="updateSelectedYear"
                  @time-range-change="updateTimeRange"
                  @hover-year="handleHoverYear"
                />
              </div>
              <div class="chart-analysis">
                <div class="analysis-content">
                  <p v-if="hoveredYearData">
                    {{ hoveredYearData.year }}年份的平均就业率为{{ hoveredYearData.employmentRate.toFixed(1) }}%，平均薪资为¥{{ Math.round(hoveredYearData.averageSalary).toLocaleString() }}。
                  </p>
                  <p v-else>
                    鼠标悬停可查看各年份的详细数据。蓝色曲线代表就业率，橙色曲线代表平均薪资。
                  </p>
                </div>
                <div class="analysis-tips">
                  鼠标悬停查看详细数据，可刷选时间范围
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-section">
            <div class="section-header">
              <div class="section-number">02</div>
              <div class="section-info">
                <h2 class="section-title">专业结构演变分析</h2>
                <p class="section-description">
                  学科专业结构反映了高等教育与社会需求之间的动态匹配关系。分析结果显示，工学专业始终占据主导地位，这与我国制造业大国的地位相吻合。近年来，管理学和经济学专业占比稳步上升，反映了服务业快速发展的趋势。
                </p>
              </div>
            </div>
            <div class="section-chart">
              <div class="chart-container">
                <h3 class="chart-title">专业结构演变</h3>
                <RiverChart
                  :data="riverChartData"
                  :selectedMajor="selectedMajor"
                  :timeRange="timeRange"
                  @major-select="updateSelectedMajor"
                />
              </div>
              <div class="chart-analysis">
                <div class="analysis-content">
                  <p>采用河流图形式展示各学科专业毕业生占比的演变。不同颜色代表不同学科，带宽宽度表示该专业的毕业生占比。</p>
                </div>
                <div class="analysis-tips">
                  鼠标悬停可查看各专业具体占比数据
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-section">
            <div class="section-header">
              <div class="section-number">03</div>
              <div class="section-info">
                <h2 class="section-title">AI技术影响分析</h2>
                <p class="section-description">
                  人工智能技术的快速发展正在深刻改变就业市场格局。通过构建AI影响矩阵，我们可以清晰地看到不同专业面临的机遇与挑战。位于低风险高潜力象限的专业将在未来获得更大的发展空间。
                </p>
              </div>
            </div>
            <div class="section-chart">
              <div class="chart-container">
                <h3 class="chart-title">AI影响矩阵</h3>
                <AIMatrix
                  :data="aiMatrixData"
                  :selectedYear="selectedYear"
                  :selectedMajor="selectedMajor"
                  @major-select="updateSelectedMajor"
                />
              </div>
              <div class="chart-analysis">
                <div class="analysis-content">
                  <p>横轴表示AI替代风险（越高表示越容易被AI替代），纵轴表示发展潜力（越高表示未来发展前景越好）。各专业根据这两个维度被定位在四个象限中。</p>
                </div>
                <div class="analysis-tips">
                  点击专业标签可查看详细分析
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-section">
            <div class="section-header">
              <div class="section-number">04</div>
              <div class="section-info">
                <h2 class="section-title">行业流向变迁分析</h2>
                <p class="section-description">
                  专业与行业之间的流动关系是理解就业市场的关键视角。桑基图清晰地展示了不同专业毕业生流向各行业的规模和趋势。计算机相关专业毕业生大量流向IT互联网行业，而经管类专业分布较为广泛。
                </p>
              </div>
            </div>
            <div class="section-chart">
              <div class="chart-container">
                <h3 class="chart-title">行业流向变迁</h3>
                <SankeyChart
                  :data="sankeyData"
                  :selectedYear="selectedYear"
                  :selectedMajor="selectedMajor"
                  @year-change="updateSelectedYear"
                />
              </div>
              <div class="chart-analysis">
                <div class="analysis-content">
                  <p>桑基图展示了不同专业毕业生的行业流向。左侧为专业类别，右侧为行业类别，箭头宽度表示就业人数规模。</p>
                </div>
                <div class="analysis-tips">
                  观察各专业流向变化，了解行业需求
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-section">
            <div class="section-header">
              <div class="section-number">05</div>
              <div class="section-info">
                <h2 class="section-title">就业指导建议</h2>
                <p class="section-description">
                  基于以上分析，我们为不同专业的学生提供个性化的就业指导建议。选择您感兴趣的专业，系统将根据该专业的就业趋势和AI影响程度，提供综合评估、发展建议和核心技能培养方向。
                </p>
              </div>
            </div>
            <div class="section-chart">
              <div class="chart-container">
                <CareerAdvice
                  :data="majorDetails"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="slide">
        <div v-if="selectedMajor && !isStoryMode" class="major-card-container">
          <MajorCard
            :data="getMajorDetails(selectedMajor)"
            @close="selectedMajor = null"
          />
        </div>
      </transition>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-info">大学生就业分析可视化项目</div>
        <div class="footer-divider"></div>
        <div class="footer-sources">数据来源：国家统计局、教育部、招聘平台行业报告</div>
        <div class="footer-divider"></div>
        <div class="footer-tech">Vue 3 + D3.js + Tailwind CSS</div>
      </div>
    </footer>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载数据...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TimeSeries from './components/TimeSeries.vue'
import RiverChart from './components/RiverChart.vue'
import AIMatrix from './components/AIMatrix.vue'
import SankeyChart from './components/SankeyChart.vue'
import MajorCard from './components/MajorCard.vue'
import TimelineStory from './components/TimelineStory.vue'
import CareerAdvice from './components/CareerAdvice.vue'
import { loadData } from './utils/dataLoader.js'

const isStoryMode = ref(true)
const isLoading = ref(true)
const selectedYear = ref(2024)
const selectedMajor = ref(null)
const timeRange = ref({ start: 2004, end: 2024 })
const educationLevel = ref('all')
const region = ref('all')
const hoveredYear = ref(null)

const timeSeriesData = ref([])
const riverChartData = ref([])
const aiMatrixData = ref([])
const sankeyData = ref([])
const majorDetails = ref({})

const educationLabel = computed(() => {
  const labels = { all: '全部', undergraduate: '本科', graduate: '研究生' }
  return labels[educationLevel.value]
})

const regionLabel = computed(() => {
  const labels = { all: '全国', east: '东部', central: '中部', west: '西部' }
  return labels[region.value]
})

const hoveredYearData = computed(() => {
  if (!hoveredYear.value || !timeSeriesData.value.length) return null
  return timeSeriesData.value.find(d => d.year === hoveredYear.value)
})

const toggleMode = () => {
  isStoryMode.value = !isStoryMode.value
}

const updateSelectedYear = (year) => {
  selectedYear.value = year
}

const updateTimeRange = (range) => {
  timeRange.value = range
}

const updateSelectedMajor = (major) => {
  selectedMajor.value = major
}

const handleHoverYear = (year) => {
  hoveredYear.value = year
}

const handleFilterChange = async () => {
  isLoading.value = true
  try {
    const data = await loadData(educationLevel.value, region.value)
    timeSeriesData.value = data.timeSeries
    riverChartData.value = data.riverChart
    aiMatrixData.value = data.aiMatrix
    sankeyData.value = data.sankey
    majorDetails.value = data.majorDetails
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
}

const getMajorDetails = (major) => {
  return majorDetails.value[major] || {}
}

onMounted(async () => {
  await handleFilterChange()
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.logo-icon-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #000;
  margin: 0;
  letter-spacing: -0.01em;
}

.sub-title {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.mode-toggle-btn {
  padding: 0.5625rem 1.125rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.mode-toggle-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mode-toggle-btn:active {
  transform: translateY(-1px);
}

.mode-toggle-btn.explore-mode-btn {
  background: #333;
}

.mode-toggle-btn.explore-mode-btn:hover {
  background: #444;
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.filter-item.mode-btn-item {
  justify-content: flex-end;
}

.filter-item.mode-btn-item .mode-toggle-btn {
  margin-top: auto;
}

.filter-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 0.5rem 1.75rem 0.5rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-size: 0.75rem;
  color: #000;
  background: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.4rem center;
  background-repeat: no-repeat;
  background-size: 1.1em;
}

.filter-select:hover {
  border-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-select:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.story-mode-full {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
}

.research-intro {
  margin-bottom: 2rem;
}

.intro-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #f0f0f0;
}

.intro-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.intro-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.intro-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.intro-section {
  background: #fafafa;
  padding: 1rem;
  border-radius: 8px;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.5rem 0;
}

.section-text {
  font-size: 0.75rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.charts-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.analysis-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 1.25rem;
}

.section-number {
  width: 40px;
  height: 40px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.section-info {
  flex: 1;
}

.analysis-section .section-title {
  font-size: 1rem;
  margin: 0 0 0.375rem 0;
}

.section-description {
  font-size: 0.75rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.section-chart {
  padding: 1.25rem 1.5rem 1.5rem;
}

.chart-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
}

.chart-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.75rem 0;
}

.chart-analysis {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.analysis-content p {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #555;
  margin: 0;
}

.analysis-tips {
  margin-top: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.6875rem;
  color: #666;
}

.major-card-container {
  margin-top: 1.5rem;
}

.app-footer {
  background: #fff;
  padding: 1rem 2rem;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info {
  font-size: 0.75rem;
  color: #333;
  font-weight: 500;
}

.footer-divider {
  width: 1px;
  height: 12px;
  background: #ddd;
}

.footer-sources,
.footer-tech {
  font-size: 0.6875rem;
  color: #999;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.8125rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }

  .logo-icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .logo-icon {
    font-size: 1.375rem;
  }

  .main-title {
    font-size: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .mode-toggle-btn {
    padding: 0.4rem 0.875rem;
    font-size: 0.75rem;
  }

  .intro-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    padding: 1rem;
  }

  .section-number {
    align-self: flex-start;
  }

  .section-chart {
    padding: 1rem;
  }

  .filter-select {
    min-width: 80px;
  }
}
</style>