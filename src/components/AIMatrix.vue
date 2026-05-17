<template>
  <div class="ai-matrix-container">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-400">年份：</label>
        <input 
          type="range" 
          min="2004" 
          max="2024" 
          step="1" 
          v-model.number="year" 
          class="w-64"
          @input="updateYear"
        />
        <span class="text-sm font-medium">{{ year }}</span>
      </div>
    </div>
    <div ref="chartRef" class="w-full h-96"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  selectedYear: {
    type: Number,
    default: 2024
  },
  selectedMajor: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['major-select'])

const chartRef = ref(null)
const year = ref(props.selectedYear)
let svg, xScale, yScale, xAxis, yAxis, bubble

const updateYear = () => {
  initChart()
}

const initChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  // 清除旧图表
  d3.select(chartRef.value).selectAll('*').remove()

  const margin = { top: 50, right: 120, bottom: 60, left: 60 }
  const width = chartRef.value.clientWidth - margin.left - margin.right
  const height = chartRef.value.clientHeight - margin.top - margin.bottom

  // 创建SVG
  svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // 筛选当前年份的数据
  const yearData = props.data.filter(d => d.year === year.value)

  if (yearData.length === 0) return

  // 定义比例尺
  xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])

  yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0])

  // 定义气泡大小比例尺
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(yearData, d => d.graduateSize)])
    .range([5, 30])

  // 定义颜色比例尺
  const colorScale = d3.scaleOrdinal()
    .domain([...new Set(yearData.map(d => d.majorCategory))])
    .range(d3.schemeCategory10)

  // 定义轴
  xAxis = d3.axisBottom(xScale).ticks(5)
  yAxis = d3.axisLeft(yScale).ticks(5)

  // 添加轴
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '11px')

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', '11px')

  // 添加象限划分线
  svg.append('line')
    .attr('x1', xScale(50))
    .attr('y1', 0)
    .attr('x2', xScale(50))
    .attr('y2', height)
    .attr('stroke', '#999')
    .attr('stroke-dasharray', '5,5')

  svg.append('line')
    .attr('x1', 0)
    .attr('y1', yScale(50))
    .attr('x2', width)
    .attr('y2', yScale(50))
    .attr('stroke', '#999')
    .attr('stroke-dasharray', '5,5')

  // 添加象限标签
  svg.append('text')
    .attr('x', xScale(25))
    .attr('y', yScale(25) + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .text('低风险低潜力')

  svg.append('text')
    .attr('x', xScale(75))
    .attr('y', yScale(25) + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .text('高风险低潜力')

  svg.append('text')
    .attr('x', xScale(25))
    .attr('y', yScale(75) + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .text('低风险高潜力')

  svg.append('text')
    .attr('x', xScale(75))
    .attr('y', yScale(75) + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('font-size', '11px')
    .text('高风险高潜力')

  // 添加气泡
  const bubbles = svg.selectAll('.bubble')
    .data(yearData)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('cx', d => xScale(d.aiRisk))
    .attr('cy', d => yScale(d.aiPotential))
    .attr('r', d => sizeScale(d.graduateSize))
    .attr('fill', d => colorScale(d.majorCategory))
    .attr('opacity', 0.7)
    .on('mouseover', function(event, d) {
      d3.select(this).attr('opacity', 1)
      showTooltip(event, d)
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 0.7)
      hideTooltip()
    })
    .on('click', function(event, d) {
      emit('major-select', d.major)
    })

  // 高亮选中的专业
  if (props.selectedMajor) {
    bubbles.filter(d => d.major === props.selectedMajor)
      .attr('opacity', 1)
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
  }

  // 添加图例
  const legend = svg.append('g')
    .attr('transform', `translate(${width + 10}, 0)`)

  const categories = [...new Set(yearData.map(d => d.majorCategory))]
  categories.forEach((category, i) => {
    legend.append('rect')
      .attr('x', 0)
      .attr('y', i * 18)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', colorScale(category))

    legend.append('text')
      .attr('x', 16)
      .attr('y', i * 18 + 10)
      .attr('fill', '#333')
      .attr('font-size', '10px')
      .text(category)
  })

  // 添加轴标签
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '12px')
    .text('AI 替代风险')

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '12px')
    .text('AI 互补潜力')

  // 添加标题
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', -25)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(`${year.value}年 AI 影响矩阵`)
}

const showTooltip = (event, d) => {
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)

  tooltip.html(`
    <div>专业: ${d.major}</div>
    <div>AI 替代风险: ${d.aiRisk.toFixed(1)}</div>
    <div>AI 互补潜力: ${d.aiPotential.toFixed(1)}</div>
    <div>毕业生规模: ${d.graduateSize}</div>
  `)
}

const hideTooltip = () => {
  d3.selectAll('.tooltip').remove()
}

// 监听数据变化
watch(() => props.data, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

watch(() => props.selectedMajor, () => {
  nextTick(() => {
    initChart()
  })
})

watch(() => props.selectedYear, (newYear) => {
  year.value = newYear
  nextTick(() => {
    initChart()
  })
})

// 监听窗口大小变化
onMounted(() => {
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', () => {
    nextTick(() => {
      initChart()
    })
  })
})
</script>

<style scoped>
.ai-matrix-container {
  width: 100%;
  height: 100%;
}
</style>