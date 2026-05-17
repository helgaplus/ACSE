<template>
  <div class="time-series-container">
    <div ref="chartRef" class="w-full h-80"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  selectedYear: {
    type: Number,
    default: 2024
  }
})

const emit = defineEmits(['year-change', 'time-range-change', 'hover-year'])

const chartRef = ref(null)
let svg, xScale, y1Scale, y2Scale, xAxis, y1Axis, y2Axis, line1, line2, brush
let hoveredYear = ref(null)

const initChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  d3.select(chartRef.value).selectAll('*').remove()

  const margin = { top: 20, right: 160, bottom: 50, left: 60 }
  const width = chartRef.value.clientWidth - margin.left - margin.right
  const height = chartRef.value.clientHeight - margin.top - margin.bottom

  svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const years = props.data.map(d => d.year)

  xScale = d3.scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width])

  y1Scale = d3.scaleLinear()
    .domain([0, Math.max(100, d3.max(props.data, d => d.employmentRate) * 1.2)])
    .range([height, 0])
    .nice()

  y2Scale = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.averageSalary) * 1.2])
    .range([height, 0])
    .nice()

  xAxis = d3.axisBottom(xScale).tickFormat(d => d).ticks(8)
  y1Axis = d3.axisLeft(y1Scale).tickFormat(d => `${d}%`).ticks(5)
  y2Axis = d3.axisRight(y2Scale).tickFormat(d => `¥${(d/1000).toFixed(0)}k`).ticks(5)

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '11px')

  svg.append('g')
    .attr('class', 'y1-axis')
    .call(y1Axis)
    .selectAll('text')
    .attr('font-size', '10px')

  svg.append('g')
    .attr('class', 'y2-axis')
    .attr('transform', `translate(${width},0)`)
    .call(y2Axis)
    .selectAll('text')
    .attr('font-size', '10px')

  line1 = d3.line()
    .x(d => xScale(d.year))
    .y(d => y1Scale(d.employmentRate))
    .curve(d3.curveMonotoneX)

  line2 = d3.line()
    .x(d => xScale(d.year))
    .y(d => y2Scale(d.averageSalary))
    .curve(d3.curveMonotoneX)

  svg.append('path')
    .datum(props.data)
    .attr('class', 'employment-line')
    .attr('fill', 'none')
    .attr('stroke', '#3b82f6')
    .attr('stroke-width', 2.5)
    .attr('d', line1)

  svg.append('path')
    .datum(props.data)
    .attr('class', 'salary-line')
    .attr('fill', 'none')
    .attr('stroke', '#f97316')
    .attr('stroke-width', 2.5)
    .attr('d', line2)

  svg.selectAll('.employment-point')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('class', 'employment-point')
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => y1Scale(d.employmentRate))
    .attr('r', 4)
    .attr('fill', '#3b82f6')
    .on('mouseover', function(event, d) {
      hoveredYear.value = d.year
      emit('hover-year', d.year)
      showTooltip(event, d, 'employment')
    })
    .on('mouseout', function() {
      hoveredYear.value = null
      hideTooltip()
    })

  svg.selectAll('.salary-point')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('class', 'salary-point')
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => y2Scale(d.averageSalary))
    .attr('r', 4)
    .attr('fill', '#f97316')
    .on('mouseover', function(event, d) {
      hoveredYear.value = d.year
      emit('hover-year', d.year)
      showTooltip(event, d, 'salary')
    })
    .on('mouseout', function() {
      hoveredYear.value = null
      hideTooltip()
    })

  const events = [
    { year: 2012, name: '深度学习兴起' },
    { year: 2018, name: '移动互联网普及' },
    { year: 2022, name: '大模型爆发' }
  ]

  events.forEach(event => {
    if (event.year >= d3.min(years) && event.year <= d3.max(years)) {
      svg.append('line')
        .attr('x1', xScale(event.year))
        .attr('y1', 0)
        .attr('x2', xScale(event.year))
        .attr('y2', height)
        .attr('stroke', '#ef4444')
        .attr('stroke-dasharray', '5,5')

      svg.append('text')
        .attr('x', xScale(event.year))
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ef4444')
        .attr('font-size', '10px')
        .text(event.name)
    }
  })

  brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('end', brushEnd)

  svg.append('g')
    .attr('class', 'brush')
    .call(brush)

  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .on('mousemove', function(event) {
      const [mouseX] = d3.pointer(event)
      const year = Math.round(xScale.invert(mouseX))
      const yearData = props.data.find(d => d.year === year)
      if (yearData && hoveredYear.value !== year) {
        hoveredYear.value = year
        emit('hover-year', year)
        showTooltipForYear(event, yearData)
      }
    })
    .on('mouseout', function() {
      hoveredYear.value = null
      hideTooltip()
    })

  const legend = svg.append('g')
    .attr('transform', `translate(10, 0)`)

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 8)
    .attr('x2', 20)
    .attr('y2', 8)
    .attr('stroke', '#3b82f6')
    .attr('stroke-width', 2.5)

  legend.append('text')
    .attr('x', 25)
    .attr('y', 12)
    .attr('fill', '#3b82f6')
    .attr('font-size', '10px')
    .text('就业率')

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 28)
    .attr('x2', 20)
    .attr('y2', 28)
    .attr('stroke', '#f97316')
    .attr('stroke-width', 2.5)

  legend.append('text')
    .attr('x', 25)
    .attr('y', 32)
    .attr('fill', '#f97316')
    .attr('font-size', '10px')
    .text('平均薪资')

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 35)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '11px')
    .text('年份')

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '11px')
    .attr('fill', '#3b82f6')
    .text('就业率 (%)')

  svg.append('text')
    .attr('transform', 'rotate(90)')
    .attr('x', height / 2)
    .attr('y', -(width + 130))
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '11px')
    .attr('fill', '#f97316')
    .text('平均薪资 (元)')
}

const showTooltip = (event, d, type) => {
  hideTooltip()
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)

  if (type === 'employment') {
    tooltip.html(`
      <div>年份: ${d.year}</div>
      <div>就业率: ${d.employmentRate.toFixed(1)}%</div>
    `)
  } else {
    tooltip.html(`
      <div>年份: ${d.year}</div>
      <div>平均薪资: ¥${Math.round(d.averageSalary)}</div>
    `)
  }
}

const showTooltipForYear = (event, d) => {
  hideTooltip()
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)

  tooltip.html(`
    <div>年份: ${d.year}</div>
    <div>就业率: ${d.employmentRate.toFixed(1)}%</div>
    <div>平均薪资: ¥${Math.round(d.averageSalary)}</div>
  `)
}

const hideTooltip = () => {
  d3.selectAll('.tooltip').remove()
}

const brushEnd = (event) => {
  if (!event.selection) return

  const [x0, x1] = event.selection
  const startYear = Math.round(xScale.invert(x0))
  const endYear = Math.round(xScale.invert(x1))

  emit('time-range-change', { start: startYear, end: endYear })
}

watch(() => props.data, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

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
.time-series-container {
  width: 100%;
  height: 100%;
}
</style>