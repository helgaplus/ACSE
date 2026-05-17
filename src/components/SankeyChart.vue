<template>
  <div class="sankey-chart-container">
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">年份：</label>
        <input
          type="range"
          :min="minYear"
          :max="maxYear"
          step="1"
          v-model.number="localYear"
          class="w-64"
          @input="handleYearChange"
        />
        <span class="text-sm font-medium">{{ selectedYear }}</span>
      </div>
    </div>
    <div ref="chartRef" class="w-full h-96"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

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

const emit = defineEmits(['year-change'])

const chartRef = ref(null)
const localYear = ref(props.selectedYear)
let svg

const minYear = computed(() => {
  if (!props.data || props.data.length === 0) return 2004
  return Math.min(...props.data.map(d => d.year))
})

const maxYear = computed(() => {
  if (!props.data || props.data.length === 0) return 2024
  return Math.max(...props.data.map(d => d.year))
})

const handleYearChange = () => {
  emit('year-change', localYear.value)
}

watch(() => props.selectedYear, (newYear) => {
  localYear.value = newYear
})

const initChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) {
    console.log('SankeyChart: No data or container not ready')
    return
  }

  // 清除旧图表
  d3.select(chartRef.value).selectAll('*').remove()

  const containerWidth = chartRef.value.clientWidth
  const containerHeight = chartRef.value.clientHeight

  if (containerWidth === 0 || containerHeight === 0) {
    console.log('SankeyChart: Container has no dimensions')
    return
  }

  const margin = { top: 50, right: 140, bottom: 40, left: 140 }
  const width = containerWidth - margin.left - margin.right
  const height = containerHeight - margin.top - margin.bottom

  if (width <= 0 || height <= 0) return

  // 创建SVG
  svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // 筛选当前年份的数据
  const yearData = props.data.filter(d => d.year === props.selectedYear)

  if (yearData.length === 0) {
    console.log('SankeyChart: No data for year', props.selectedYear)
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(`暂无 ${props.selectedYear} 年数据`)
    return
  }

  // 准备桑基图数据
  const nodeMap = new Map()
  const nodes = []
  const links = []

  // 提取专业和行业节点
  const majors = [...new Set(yearData.map(d => d.major))]
  const industries = [...new Set(yearData.map(d => d.industry))]

  majors.forEach((major, i) => {
    const node = { name: major, type: 'major', index: i }
    nodes.push(node)
    nodeMap.set(major, i)
  })

  industries.forEach((industry, i) => {
    const node = { name: industry, type: 'industry', index: majors.length + i }
    nodes.push(node)
    nodeMap.set(industry, majors.length + i)
  })

  // 提取链接数据 - 使用索引引用
  yearData.forEach(d => {
    const sourceIndex = nodeMap.get(d.major)
    const targetIndex = nodeMap.get(d.industry)
    if (sourceIndex !== undefined && targetIndex !== undefined) {
      links.push({
        source: sourceIndex,
        target: targetIndex,
        value: Math.max(1, d.count)
      })
    }
  })

  if (nodes.length === 0 || links.length === 0) {
    console.log('SankeyChart: No nodes or links')
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text('暂无有效的流向数据')
    return
  }

  try {
    // 使用 d3-sankey 布局
    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(15)
      .extent([[1, 1], [width - 1, height - 6]])

    // 计算节点和链接位置
    const graph = sankeyLayout({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    })

    // 定义颜色比例尺
    const colorScale = d3.scaleOrdinal()
      .domain(industries)
      .range(d3.schemeCategory10)

    // 定义路径生成器
    const path = sankeyLinkHorizontal()

    // 添加链接
    svg.append('g')
      .selectAll('path')
      .data(graph.links)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d.target.name))
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('opacity', 0.6)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1)
        showTooltip(event, d)
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.6)
        hideTooltip()
      })

    // 添加节点
    svg.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .enter()
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.type === 'major' ? '#94a3b8' : colorScale(d.name))
      .attr('stroke', '#000')

    // 添加节点标签
    svg.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .attr('font-size', '10px')
      .text(d => d.name)

    // 添加标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(`${props.selectedYear}年专业毕业生行业流向`)
  } catch (error) {
    console.error('SankeyChart error:', error)
    // 显示错误信息
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#ef4444')
      .text('无法加载桑基图数据')
  }
}

const showTooltip = (event, d) => {
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)

  tooltip.html(`
    <div>专业: ${d.source.name}</div>
    <div>行业: ${d.target.name}</div>
    <div>人数: ${d.value}</div>
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

watch(() => props.selectedYear, () => {
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
.sankey-chart-container {
  width: 100%;
  height: 100%;
}
</style>