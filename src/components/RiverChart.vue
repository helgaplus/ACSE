<template>
  <div class="river-chart-container">
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
  selectedMajor: {
    type: String,
    default: null
  },
  timeRange: {
    type: Object,
    default: () => ({ start: 2004, end: 2024 })
  }
})

const emit = defineEmits(['major-select'])

const chartRef = ref(null)
let svg, xScale, yScale, colorScale, years, majors, stackedData, dataByYear
let margin = { top: 20, right: 120, bottom: 50, left: 50 }

const initChart = () => {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  d3.select(chartRef.value).selectAll('*').remove()

  const width = chartRef.value.clientWidth - margin.left - margin.right
  const height = chartRef.value.clientHeight - margin.top - margin.bottom

  svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  years = [...new Set(props.data.map(d => d.year))].sort((a, b) => a - b)
  majors = [...new Set(props.data.map(d => d.major))]

  if (years.length === 0 || majors.length === 0) return

  dataByYear = years.map(year => {
    const yearData = { year }
    majors.forEach(major => {
      const majorData = props.data.find(item => item.year === year && item.major === major)
      yearData[major] = majorData ? majorData.percentage : 0
    })
    return yearData
  })

  stackedData = d3.stack()
    .keys(majors)
    (dataByYear)

  xScale = d3.scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width])

  yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0])

  const xAxis = d3.axisBottom(xScale).tickFormat(d => d).ticks(8)
  const yAxis = d3.axisLeft(yScale).tickFormat(d => `${d}%`).ticks(5)

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '10px')

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', '10px')

  colorScale = d3.scaleOrdinal()
    .domain(majors)
    .range(d3.schemeCategory10)

  const area = d3.area()
    .x(d => xScale(d.data.year))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveBasis)

  const areas = svg.selectAll('.area')
    .data(stackedData)
    .enter()
    .append('path')
    .attr('class', 'area')
    .attr('d', area)
    .attr('fill', d => colorScale(d.key))
    .attr('opacity', 0.8)
    .on('mouseover', function(event, d) {
      d3.select(this).attr('opacity', 1)
      const coords = d3.pointer(event, svg.node())
      const year = getYearFromX(coords[0])
      showTooltip(event, d, year)
    })
    .on('mousemove', function(event, d) {
      const coords = d3.pointer(event, svg.node())
      const year = getYearFromX(coords[0])
      updateTooltipPosition(event, year)
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 0.8)
      hideTooltip()
    })
    .on('click', function(event, d) {
      emit('major-select', d.key)
    })

  if (props.selectedMajor) {
    areas.filter(d => d.key === props.selectedMajor)
      .attr('opacity', 1)
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
  }

  const legend = svg.append('g')
    .attr('transform', `translate(${width + 10}, 0)`)

  majors.forEach((major, i) => {
    legend.append('rect')
      .attr('x', 0)
      .attr('y', i * 16)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', colorScale(major))

    legend.append('text')
      .attr('x', 14)
      .attr('y', i * 16 + 9)
      .attr('fill', '#333')
      .attr('font-size', '9px')
      .text(major)
  })

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
    .attr('y', -38)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .attr('font-size', '11px')
    .text('毕业生人数占比')
}

const getYearFromX = (x) => {
  if (!xScale || !years || years.length === 0) return null
  const inverted = xScale.invert(x)
  let year = Math.round(inverted)
  year = Math.max(years[0], Math.min(years[years.length - 1], year))
  return year
}

const getMajorPercentage = (year, major) => {
  if (!dataByYear) return 0
  const yearData = dataByYear.find(d => d.year === year)
  return yearData ? (yearData[major] || 0) : 0
}

const getAllMajorsPercentage = (year) => {
  if (!dataByYear) return []
  const yearData = dataByYear.find(d => d.year === year)
  if (!yearData) return []
  return majors.map(major => ({
    major,
    percentage: yearData[major] || 0
  }))
}

let tooltip = null
let currentYear = null
let currentData = null

const showTooltip = (event, d, year) => {
  hideTooltip()
  currentYear = year
  currentData = d

  tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)
    .style('background', 'rgba(45, 55, 72, 0.95)')
    .style('border', '1px solid rgba(255, 255, 255, 0.2)')
    .style('border-radius', '10px')
    .style('padding', '14px')
    .style('box-shadow', '0 8px 24px rgba(0,0,0,0.3)')
    .style('font-size', '12px')
    .style('color', '#f7fafc')
    .style('z-index', '9999')
    .style('pointer-events', 'none')
    .style('min-width', '180px')

  updateTooltipContent()
}

const updateTooltipPosition = (event, year) => {
  if (!tooltip) return
  tooltip
    .style('left', `${event.pageX + 10}px`)
    .style('top', `${event.pageY - 30}px`)

  if (year !== currentYear) {
    currentYear = year
    updateTooltipContent()
  }
}

const updateTooltipContent = () => {
  if (!tooltip || !currentData || !currentYear) return

  const majorPercentage = getMajorPercentage(currentYear, currentData.key)
  const allMajors = getAllMajorsPercentage(currentYear)

  let html = `<div style="font-weight: bold; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); color: ${colorScale(currentData.key)}; font-size: 14px;">${currentData.key}</div>`
  html += `<div style="margin-bottom: 6px; color: #a0aec0;">年份: <span style="color: #f7fafc; font-weight: 600;">${currentYear}</span></div>`
  html += `<div style="margin-bottom: 10px; color: #a0aec0;">该专业占比: <span style="color: ${colorScale(currentData.key)}; font-weight: 700; font-size: 16px;">${majorPercentage.toFixed(1)}%</span></div>`
  html += `<div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px; margin-top: 6px;">`
  html += `<div style="margin-bottom: 6px; font-size: 11px; color: #718096; text-transform: uppercase; letter-spacing: 0.5px;">各专业占比</div>`

  allMajors.forEach(item => {
    const isSelected = item.major === currentData.key
    const displayColor = isSelected ? colorScale(item.major) : '#e2e8f0'
    html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; ${isSelected ? 'font-weight: 600;' : ''}">
      <span style="color: ${displayColor};">${item.major}</span>
      <span style="color: ${isSelected ? colorScale(item.major) : '#cbd5e0'};">${item.percentage.toFixed(1)}%</span>
    </div>`
  })

  html += `</div>`

  tooltip.html(html)
}

const hideTooltip = () => {
  if (tooltip) {
    tooltip.remove()
    tooltip = null
  }
  currentYear = null
  currentData = null
  d3.selectAll('.tooltip').remove()
}

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
.river-chart-container {
  width: 100%;
  height: 100%;
}
</style>