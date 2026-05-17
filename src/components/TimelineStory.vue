<template>
  <div class="timeline-container" :style="{ backgroundImage: currentBackground }">
    <div class="background-overlay"></div>
    
    <div class="timeline-content-wrapper">
      <div class="timeline-header">
        <h2 class="timeline-title">时代变迁与就业图景</h2>
        <p class="timeline-subtitle">探索2004-2024年间中国大学生就业市场的演变</p>
        <p class="timeline-hint">向下滚动探索各个时代</p>
      </div>

      <div class="timeline">
        <div
          v-for="(step, index) in storySteps"
          :key="step.year"
          class="timeline-item"
          :class="{ 'left': index % 2 === 0, 'right': index % 2 === 1 }"
          :id="'era-' + step.year"
          ref="timelineItems"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line"></div>
          </div>

          <div class="timeline-label">
            <span>{{ step.year }} · {{ step.title }}</span>
          </div>

          <div class="timeline-content">
            <div class="timeline-year">{{ step.year }}</div>

            <div class="timeline-card">
              <div class="card-header">
                <div class="era-icon">{{ step.icon }}</div>
                <h3 class="era-title">{{ step.title }}</h3>
              </div>

              <div class="era-description">{{ step.description }}</div>

              <div class="era-tags">
                <span
                  v-for="tag in step.tags"
                  :key="tag"
                  class="era-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="employment-data">
                <div class="data-section">
                  <h4 class="data-title">就业概况</h4>
                  <div class="data-grid">
                    <div class="data-item">
                      <span class="data-label">就业率</span>
                      <span class="data-value">{{ getStepData(step.year, 'employmentRate') }}%</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">平均薪资</span>
                      <span class="data-value">¥{{ getStepData(step.year, 'averageSalary') }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">毕业生总数</span>
                      <span class="data-value">{{ getStepData(step.year, 'graduateSize') }}万</span>
                    </div>
                  </div>
                </div>

                <div class="data-section">
                  <h4 class="data-title">热门行业</h4>
                  <div class="industry-list">
                    <div
                      v-for="industry in getStepIndustries(step.year)"
                      :key="industry.name"
                      class="industry-item"
                    >
                      <div class="industry-bar">
                        <div
                          class="industry-fill"
                          :style="{ width: industry.percentage + '%' }"
                        ></div>
                      </div>
                      <span class="industry-name">{{ industry.name }}</span>
                      <span class="industry-percent">{{ industry.percentage }}%</span>
                    </div>
                  </div>
                </div>

                <div class="data-section">
                  <h4 class="data-title">AI影响分析</h4>
                  <div class="ai-analysis">
                    <div class="ai-indicator">
                      <span class="ai-label">AI替代风险</span>
                      <div class="ai-bar">
                        <div
                          class="ai-fill risk"
                          :style="{ width: getStepAIImpact(step.year, 'risk') + '%' }"
                        ></div>
                      </div>
                      <span class="ai-value">{{ getStepAIImpact(step.year, 'risk') }}</span>
                    </div>
                    <div class="ai-indicator">
                      <span class="ai-label">AI互补潜力</span>
                      <div class="ai-bar">
                        <div
                          class="ai-fill potential"
                          :style="{ width: getStepAIImpact(step.year, 'potential') + '%' }"
                        ></div>
                      </div>
                      <span class="ai-value">{{ getStepAIImpact(step.year, 'potential') }}</span>
                    </div>
                  </div>
                </div>

                <div class="data-section">
                  <h4 class="data-title">专家解读</h4>
                  <p class="expert-insight">{{ step.insight }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-end">
          <div class="timeline-marker">
            <div class="marker-dot end-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps({
  timeSeriesData: {
    type: Array,
    default: () => []
  },
  riverChartData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['step-change'])

const timelineItems = ref([])
const currentEraIndex = ref(0)

const storySteps = [
  {
    year: 2010,
    icon: '🏭',
    title: '传统行业主导时代',
    description: '这一时期，制造业、金融业和教育业是大学生就业的主要方向。国有企业、政府机关和事业单位是毕业生的首选。计算机专业刚刚起步，AI尚未对就业市场产生明显影响。',
    tags: ['传统行业', '制造业', '金融业', '稳定就业'],
    insight: '2010年之前，中国经济高速增长，传统行业提供大量就业岗位。大学生就业相对稳定，但薪资水平整体偏低。工程类、商科类专业更受青睐。',
    topIndustries: [
      { name: '制造业', percentage: 35 },
      { name: '金融', percentage: 20 },
      { name: '教育', percentage: 18 },
      { name: '政府/事业单位', percentage: 15 },
      { name: '其他', percentage: 12 }
    ],
    background: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=90'
  },
  {
    year: 2015,
    icon: '📱',
    title: '移动互联网兴起',
    description: '随着智能手机普及，移动互联网飞速发展。IT/互联网公司开始大规模招聘，计算机相关专业就业率和薪资大幅提升。传统行业开始受到互联网技术的冲击。',
    tags: ['互联网+', '移动互联网', '创业潮', '技术人才'],
    insight: '2011-2015年是互联网爆发期。阿里、腾讯、百度等巨头扩张，滴滴、美团等独角兽崛起。技术类人才供不应求，程序员成为高薪代名词。',
    topIndustries: [
      { name: 'IT/互联网', percentage: 40 },
      { name: '金融', percentage: 18 },
      { name: '制造业', percentage: 15 },
      { name: '教育', percentage: 12 },
      { name: '其他', percentage: 15 }
    ],
    background: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=90'
  },
  {
    year: 2021,
    icon: '🤖',
    title: 'AI技术深度发展',
    description: '深度学习技术逐渐成熟，AI开始在各个行业落地应用。计算机、数据科学、人工智能等专业需求激增。同时，部分传统岗位开始受到自动化技术的冲击。',
    tags: ['人工智能', '数字化转型', '产业升级', '复合型人才'],
    insight: '2016-2021年是AI技术成熟期。人脸识别、自动驾驶、智能推荐等技术广泛应用。理工科学生优势明显，但AI也开始影响金融、客服等领域。',
    topIndustries: [
      { name: 'IT/互联网', percentage: 45 },
      { name: 'AI/智能制造', percentage: 20 },
      { name: '金融', percentage: 15 },
      { name: '教育', percentage: 10 },
      { name: '其他', percentage: 10 }
    ],
    background: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=90'
  },
  {
    year: 2024,
    icon: '🚀',
    title: '大模型时代到来',
    description: 'ChatGPT等大语言模型的爆发式发展，对教育、金融、设计、客服等行业产生深远影响。AI互补潜力高的专业迎来新机遇，而替代风险高的专业面临转型压力。',
    tags: ['大模型', 'AIGC', '人机协作', '终身学习'],
    insight: '2022年后，以ChatGPT为代表的大模型震惊世界。AI不再是单一任务工具，而是通用助手。既有挑战也有机遇，关键是学会与AI协作而非竞争。',
    topIndustries: [
      { name: 'AI/大模型', percentage: 35 },
      { name: 'IT/互联网', percentage: 25 },
      { name: '新能源/智能制造', percentage: 18 },
      { name: '金融科技', percentage: 12 },
      { name: '其他', percentage: 10 }
    ],
    background: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=90'
  }
]

const currentBackground = computed(() => {
  const currentStep = storySteps[currentEraIndex.value]
  return currentStep ? `url('${currentStep.background}')` : ''
})

const getStepData = (year, field) => {
  if (!props.timeSeriesData || props.timeSeriesData.length === 0) {
    const defaults = {
      employmentRate: 85,
      averageSalary: 8000,
      graduateSize: 700
    }
    return defaults[field] || 0
  }

  const yearData = props.timeSeriesData.find(d => d.year === year)
  if (yearData) {
    return field === 'averageSalary'
      ? Math.round(yearData.averageSalary).toLocaleString()
      : field === 'graduateSize'
      ? Math.round(yearData.averageSalary / 10)
      : yearData[field]?.toFixed(1)
  }

  return 0
}

const getStepIndustries = (year) => {
  const step = storySteps.find(s => s.year === year)
  return step?.topIndustries || []
}

const getStepAIImpact = (year, type) => {
  const impacts = {
    2010: { risk: 20, potential: 30 },
    2015: { risk: 35, potential: 50 },
    2021: { risk: 50, potential: 70 },
    2024: { risk: 65, potential: 85 }
  }
  return impacts[year]?.[type] || 0
}

const checkScrollPosition = () => {
  const items = timelineItems.value
  if (!items || items.length === 0) return

  const windowHeight = window.innerHeight
  const scrollTop = window.scrollY

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    const rect = item.getBoundingClientRect()
    
    if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25) {
      if (currentEraIndex.value !== i) {
        currentEraIndex.value = i
        emit('step-change', storySteps[i].year)
      }
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition)
  checkScrollPosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
})
</script>

<style scoped>
.timeline-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-color: #1a1a1a;
  transition: background-image 1.2s ease-in-out;
  margin: 0;
  padding: 0;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  transition: background 1.2s ease-in-out;
}

.timeline-content-wrapper {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
  padding: calc(2rem + 60px) 1.5rem 3rem;
  width: 100%;
  box-sizing: border-box;
}

.timeline-header {
  text-align: center;
  margin-bottom: 4rem;
  color: white;
}

.timeline-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.timeline-title:hover {
  transform: scale(1.05);
  text-shadow: 0 4px 30px rgba(255, 255, 255, 0.3);
  letter-spacing: 0.02em;
}

.timeline-subtitle {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

.timeline-hint {
  font-size: 0.8125rem;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7);
}

.timeline {
  position: relative;
  padding: 0 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 45%;
  margin-bottom: 3rem;
}

.timeline-item.left {
  margin-right: auto;
  padding-right: 2.5rem;
}

.timeline-item.right {
  margin-left: auto;
  padding-left: 2.5rem;
}

.timeline-marker {
  position: absolute;
  top: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-item.left .timeline-marker {
  right: 0;
  transform: translateX(50%);
}

.timeline-item.right .timeline-marker {
  left: 0;
  transform: translateX(-50%);
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #000;
  z-index: 3;
  transition: transform 0.3s ease;
}

.timeline-item:hover .marker-dot {
  transform: scale(1.15);
}

.marker-line {
  width: 2px;
  flex: 1;
  min-height: 30px;
  background: rgba(255, 255, 255, 0.3);
  margin-top: 4px;
}

.timeline-label {
  position: absolute;
  top: -50px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  white-space: nowrap;
  z-index: 4;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
}

.timeline-label:hover {
  transform: translateX(50%) scale(1.1);
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  padding: 0.5625rem 1.125rem;
}

.timeline-item.left .timeline-label {
  right: -10px;
  transform: translateX(50%);
}

.timeline-item.left .timeline-label:hover {
  transform: translateX(50%) scale(1.1);
}

.timeline-item.right .timeline-label {
  left: -10px;
  transform: translateX(-50%);
}

.timeline-item.right .timeline-label:hover {
  transform: translateX(-50%) scale(1.1);
}

.timeline-item:last-of-type .marker-line {
  display: none;
}

.timeline-content {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 1.5rem;
}

.timeline-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.timeline-year {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.era-icon {
  font-size: 1.75rem;
}

.era-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #000;
}

.era-description {
  font-size: 0.8125rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.era-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.era-tag {
  font-size: 0.6875rem;
  padding: 0.1875rem 0.625rem;
  background: #f0f0f0;
  color: #444;
  border-radius: 4px;
}

.employment-data {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.data-section {
  margin-bottom: 1rem;
}

.data-section:last-child {
  margin-bottom: 0;
}

.data-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.data-item {
  background: #fafafa;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
}

.data-label {
  display: block;
  font-size: 0.625rem;
  color: #888;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.data-value {
  display: block;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #000;
}

.industry-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.industry-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.industry-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.industry-fill {
  height: 100%;
  border-radius: 3px;
  background: #000;
  transition: width 0.5s ease;
}

.industry-name {
  font-size: 0.6875rem;
  color: #666;
  min-width: 70px;
}

.industry-percent {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #000;
  min-width: 35px;
  text-align: right;
}

.ai-analysis {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ai-indicator {
  display: grid;
  grid-template-columns: 70px 1fr 30px;
  align-items: center;
  gap: 0.5rem;
}

.ai-label {
  font-size: 0.625rem;
  color: #888;
  text-transform: uppercase;
}

.ai-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.ai-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.ai-fill.risk {
  background: #666;
}

.ai-fill.potential {
  background: #000;
}

.ai-value {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #000;
  text-align: right;
}

.expert-insight {
  font-size: 0.75rem;
  color: #555;
  line-height: 1.6;
  background: #fafafa;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 2px solid #000;
  margin: 0;
}

.timeline-end {
  position: relative;
  text-align: center;
  padding-top: 2rem;
  margin-top: 1rem;
}

.timeline-end .timeline-marker {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.end-dot {
  background: #000;
  border-color: #fff;
}

@media (max-width: 768px) {
  .timeline::before {
    left: 16px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 45px;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
  }

  .timeline-marker {
    left: 16px;
    right: auto;
    transform: translateX(-50%) !important;
    width: auto;
  }

  .timeline-label {
    display: none;
  }

  .timeline-content {
    padding: 1rem;
    margin-top: 1rem;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }

  .industry-item {
    grid-template-columns: 1fr auto;
  }

  .industry-name {
    display: none;
  }

  .ai-indicator {
    grid-template-columns: 55px 1fr 25px;
  }

  .timeline-title {
    font-size: 1.5rem;
  }
}
</style>