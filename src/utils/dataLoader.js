// 模拟数据生成
const generateTimeSeriesData = (educationLevel = 'all', region = 'all') => {
  const data = []
  const regionFactor = { all: 1, east: 1.1, central: 0.95, west: 0.9 }
  const eduFactor = { all: 1, undergraduate: 1, graduate: 1.3 }

  for (let year = 2004; year <= 2024; year++) {
    const baseRate = 70 + Math.sin(year * 0.2) * 5 + Math.random() * 3
    const baseSalary = 2000 + (year - 2004) * 500 + Math.random() * 1000

    data.push({
      year,
      employmentRate: Math.min(98, Math.max(60, baseRate * regionFactor[region] * eduFactor[educationLevel])),
      averageSalary: Math.round(baseSalary * regionFactor[region] * eduFactor[educationLevel])
    })
  }
  return data
}

const generateRiverChartData = (educationLevel = 'all', region = 'all') => {
  const majors = ['工学', '理学', '文学', '经济学', '管理学', '医学', '法学', '教育学']
  const data = []

  const regionAdjust = { all: 0, east: 2, central: -1, west: -1 }
  const eduAdjust = { all: 0, undergraduate: 0, graduate: -3 }

  for (let year = 2004; year <= 2024; year++) {
    let total = 0
    const yearData = []

    majors.forEach(major => {
      let basePercentage
      switch (major) {
        case '工学':
          basePercentage = 30 + Math.sin(year * 0.1) * 5 + regionAdjust[region] + eduAdjust[educationLevel]
          break
        case '理学':
          basePercentage = 15 - Math.cos(year * 0.15) * 3
          break
        case '文学':
          basePercentage = 12 - Math.sin(year * 0.2) * 2
          break
        case '经济学':
          basePercentage = 10 + Math.cos(year * 0.1) * 3
          break
        case '管理学':
          basePercentage = 18 + Math.sin(year * 0.15) * 4
          break
        case '医学':
          basePercentage = 8 + Math.cos(year * 0.2) * 2
          break
        case '法学':
          basePercentage = 5 + Math.sin(year * 0.25) * 1
          break
        case '教育学':
          basePercentage = 2 + Math.cos(year * 0.3) * 1
          break
        default:
          basePercentage = 5
      }
      yearData.push({ major, percentage: Math.max(1, basePercentage) })
      total += Math.max(1, basePercentage)
    })

    yearData.forEach(item => {
      item.percentage = (item.percentage / total) * 100
      data.push({ year, ...item })
    })
  }

  return data
}

const generateAIMatrixData = (educationLevel = 'all', region = 'all') => {
  const majors = [
    { name: '计算机科学与技术', category: '工学', baseRisk: 30, basePotential: 90 },
    { name: '英语', category: '文学', baseRisk: 70, basePotential: 60 },
    { name: '机械工程', category: '工学', baseRisk: 50, basePotential: 70 },
    { name: '金融学', category: '经济学', baseRisk: 60, basePotential: 80 },
    { name: '市场营销', category: '管理学', baseRisk: 40, basePotential: 65 },
    { name: '临床医学', category: '医学', baseRisk: 20, basePotential: 50 },
    { name: '法学', category: '法学', baseRisk: 55, basePotential: 45 },
    { name: '教育学', category: '教育学', baseRisk: 45, basePotential: 60 }
  ]

  const regionFactor = { all: 1, east: 1.05, central: 0.95, west: 0.9 }

  const data = []
  for (let year = 2004; year <= 2024; year++) {
    majors.forEach(major => {
      const yearFactor = (year - 2004) / 20
      const aiRisk = (major.baseRisk + yearFactor * 20 + Math.random() * 5) * regionFactor[region]
      const aiPotential = (major.basePotential + yearFactor * 10 + Math.random() * 5) * regionFactor[region]

      data.push({
        year,
        major: major.name,
        majorCategory: major.category,
        aiRisk: Math.min(100, Math.max(0, aiRisk)),
        aiPotential: Math.min(100, Math.max(0, aiPotential)),
        graduateSize: Math.floor((5000 + Math.floor(Math.random() * 10000)) * regionFactor[region])
      })
    })
  }

  return data
}

const generateSankeyData = (educationLevel = 'all', region = 'all') => {
  const majors = ['计算机科学与技术', '英语', '机械工程', '金融学', '市场营销']
  const industries = ['IT/互联网', '金融', '教育', '制造业', '咨询', '其他']

  const regionFactor = { all: 1, east: 1.2, central: 0.9, west: 0.8 }
  const eduFactor = { all: 1, undergraduate: 0.8, graduate: 1.2 }

  const data = []
  for (let year = 2004; year <= 2024; year++) {
    majors.forEach(major => {
      let industryDistribution

      switch (major) {
        case '计算机科学与技术':
          industryDistribution = {
            'IT/互联网': 60 + Math.sin(year * 0.1) * 10,
            '金融': 15 + Math.cos(year * 0.15) * 5,
            '制造业': 10 - Math.sin(year * 0.2) * 3,
            '咨询': 10 + Math.cos(year * 0.25) * 2,
            '其他': 5
          }
          break
        case '英语':
          industryDistribution = {
            '教育': 40 + Math.sin(year * 0.1) * 5,
            'IT/互联网': 20 + Math.cos(year * 0.15) * 5,
            '金融': 15 + Math.sin(year * 0.2) * 3,
            '咨询': 15 - Math.cos(year * 0.25) * 2,
            '其他': 10
          }
          break
        case '机械工程':
          industryDistribution = {
            '制造业': 60 + Math.sin(year * 0.1) * 10,
            'IT/互联网': 15 + Math.cos(year * 0.15) * 5,
            '咨询': 10 - Math.sin(year * 0.2) * 3,
            '其他': 15
          }
          break
        case '金融学':
          industryDistribution = {
            '金融': 70 + Math.sin(year * 0.1) * 10,
            'IT/互联网': 15 + Math.cos(year * 0.15) * 5,
            '咨询': 10 - Math.sin(year * 0.2) * 3,
            '其他': 5
          }
          break
        case '市场营销':
          industryDistribution = {
            '咨询': 30 + Math.sin(year * 0.1) * 5,
            'IT/互联网': 25 + Math.cos(year * 0.15) * 5,
            '金融': 20 + Math.sin(year * 0.2) * 3,
            '教育': 10 - Math.cos(year * 0.25) * 2,
            '其他': 15
          }
          break
        default:
          industryDistribution = {
            '其他': 100
          }
      }

      const totalCount = Math.floor((5000 + Math.floor(Math.random() * 10000)) * regionFactor[region] * eduFactor[educationLevel])

      Object.entries(industryDistribution).forEach(([industry, percentage]) => {
        data.push({
          year,
          major,
          industry,
          count: Math.floor(totalCount * percentage / 100)
        })
      })
    })
  }

  return data
}

const generateMajorDetails = (educationLevel = 'all', region = 'all') => {
  const regionFactor = { all: 1, east: 1.15, central: 0.95, west: 0.85 }
  const eduFactor = { all: 1, undergraduate: 0.85, graduate: 1.4 }
  const rf = regionFactor[region]
  const ef = eduFactor[educationLevel]

  return {
    '工学': {
      major: '工学',
      employmentRate: 89.7,
      averageSalary: Math.round(11000 * rf * ef),
      graduateSize: Math.round(200000 * ef),
      aiRisk: 50,
      aiPotential: 80,
      aiImpactIndex: 50,
      topIndustries: [
        { name: '制造业', percentage: 40 },
        { name: 'IT/互联网', percentage: 30 },
        { name: '咨询', percentage: 15 },
        { name: '其他', percentage: 15 }
      ],
      employmentAdvice: '建议学习人工智能、智能制造等前沿技术，提升与AI协作的能力。同时关注行业数字化转型，培养系统集成和项目管理技能。'
    },
    '理学': {
      major: '理学',
      employmentRate: 85.3,
      averageSalary: Math.round(9500 * rf * ef),
      graduateSize: Math.round(120000 * ef),
      aiRisk: 45,
      aiPotential: 75,
      aiImpactIndex: 45,
      topIndustries: [
        { name: '教育', percentage: 35 },
        { name: 'IT/互联网', percentage: 30 },
        { name: '科研', percentage: 20 },
        { name: '其他', percentage: 15 }
      ],
      employmentAdvice: '建议结合AI技术进行交叉学科研究，如数据科学、计算生物学等。培养数学建模和算法设计能力，这些是AI时代的核心竞争力。'
    },
    '文学': {
      major: '文学',
      employmentRate: 82.5,
      averageSalary: Math.round(8000 * rf * ef),
      graduateSize: Math.round(150000 * ef),
      aiRisk: 70,
      aiPotential: 60,
      aiImpactIndex: 30,
      topIndustries: [
        { name: '教育', percentage: 35 },
        { name: 'IT/互联网', percentage: 25 },
        { name: '咨询', percentage: 20 },
        { name: '其他', percentage: 20 }
      ],
      employmentAdvice: '建议结合AI工具提升语言处理和内容创作能力，同时发展跨文化沟通、创意写作等AI难以替代的技能。可考虑向内容策划、文化传播等领域转型。'
    },
    '经济学': {
      major: '经济学',
      employmentRate: 88.2,
      averageSalary: Math.round(12000 * rf * ef),
      graduateSize: Math.round(100000 * ef),
      aiRisk: 65,
      aiPotential: 85,
      aiImpactIndex: 40,
      topIndustries: [
        { name: '金融', percentage: 45 },
        { name: 'IT/互联网', percentage: 25 },
        { name: '咨询', percentage: 20 },
        { name: '其他', percentage: 10 }
      ],
      employmentAdvice: '建议学习金融科技、量化分析等领域，掌握AI在经济预测和风险管理中的应用。同时培养经济洞察力和政策分析能力，这些是AI难以替代的。'
    },
    '管理学': {
      major: '管理学',
      employmentRate: 86.8,
      averageSalary: Math.round(9800 * rf * ef),
      graduateSize: Math.round(180000 * ef),
      aiRisk: 40,
      aiPotential: 70,
      aiImpactIndex: 55,
      topIndustries: [
        { name: '咨询', percentage: 35 },
        { name: 'IT/互联网', percentage: 30 },
        { name: '金融', percentage: 20 },
        { name: '其他', percentage: 15 }
      ],
      employmentAdvice: '建议学习数字管理、项目管理等领域，利用AI工具提升管理效率。同时培养领导力、团队协作和战略思维能力，这些是AI难以复制的核心管理技能。'
    },
    '医学': {
      major: '医学',
      employmentRate: 92.1,
      averageSalary: Math.round(10500 * rf * ef),
      graduateSize: Math.round(90000 * ef),
      aiRisk: 25,
      aiPotential: 60,
      aiImpactIndex: 70,
      topIndustries: [
        { name: '医疗', percentage: 80 },
        { name: '科研', percentage: 10 },
        { name: '教育', percentage: 5 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议学习医学AI、精准医疗等前沿领域，掌握AI辅助诊断和治疗技术。同时培养临床思维、医患沟通和人文关怀能力，这些是AI无法替代的。'
    },
    '法学': {
      major: '法学',
      employmentRate: 83.7,
      averageSalary: Math.round(9000 * rf * ef),
      graduateSize: Math.round(80000 * ef),
      aiRisk: 55,
      aiPotential: 50,
      aiImpactIndex: 45,
      topIndustries: [
        { name: '法律', percentage: 70 },
        { name: '咨询', percentage: 15 },
        { name: '金融', percentage: 10 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议学习法律科技、智能合约等新兴领域，掌握AI在法律检索和案例分析中的应用。同时培养法律思维、辩论能力和伦理判断能力，这些是AI难以替代的。'
    },
    '教育学': {
      major: '教育学',
      employmentRate: 87.4,
      averageSalary: Math.round(7500 * rf * ef),
      graduateSize: Math.round(70000 * ef),
      aiRisk: 45,
      aiPotential: 65,
      aiImpactIndex: 55,
      topIndustries: [
        { name: '教育', percentage: 85 },
        { name: '咨询', percentage: 10 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议学习教育科技、智能教育等领域，掌握AI在个性化教学中的应用。同时培养教学设计、情感教育和育人能力，这些是AI无法替代的核心教育技能。'
    },
    '计算机科学与技术': {
      major: '计算机科学与技术',
      employmentRate: 92.5,
      averageSalary: Math.round(15000 * rf * ef),
      graduateSize: Math.round(150000 * ef),
      aiRisk: 35,
      aiPotential: 95,
      aiImpactIndex: 60,
      topIndustries: [
        { name: 'IT/互联网', percentage: 65 },
        { name: '金融', percentage: 15 },
        { name: '制造业', percentage: 10 },
        { name: '咨询', percentage: 5 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议深入学习AI相关技术，如机器学习、深度学习和大语言模型。同时培养跨领域能力，如数据分析、产品设计等，以适应AI时代的需求。'
    },
    '英语': {
      major: '英语',
      employmentRate: 85.2,
      averageSalary: Math.round(8000 * rf * ef),
      graduateSize: Math.round(100000 * ef),
      aiRisk: 75,
      aiPotential: 65,
      aiImpactIndex: 20,
      topIndustries: [
        { name: '教育', percentage: 40 },
        { name: 'IT/互联网', percentage: 25 },
        { name: '金融', percentage: 15 },
        { name: '咨询', percentage: 10 },
        { name: '其他', percentage: 10 }
      ],
      employmentAdvice: '建议结合AI工具提升翻译和语言处理能力，同时发展跨文化沟通、内容创作等AI难以替代的技能。可考虑向教育、国际商务等领域转型。'
    },
    '机械工程': {
      major: '机械工程',
      employmentRate: 88.7,
      averageSalary: Math.round(9500 * rf * ef),
      graduateSize: Math.round(80000 * ef),
      aiRisk: 55,
      aiPotential: 75,
      aiImpactIndex: 40,
      topIndustries: [
        { name: '制造业', percentage: 60 },
        { name: 'IT/互联网', percentage: 20 },
        { name: '咨询', percentage: 10 },
        { name: '其他', percentage: 10 }
      ],
      employmentAdvice: '建议学习智能制造、工业机器人、数字孪生等前沿技术，提升与AI协作的能力。同时关注行业数字化转型，培养系统集成和项目管理技能。'
    },
    '金融学': {
      major: '金融学',
      employmentRate: 90.1,
      averageSalary: Math.round(12000 * rf * ef),
      graduateSize: Math.round(90000 * ef),
      aiRisk: 65,
      aiPotential: 85,
      aiImpactIndex: 30,
      topIndustries: [
        { name: '金融', percentage: 70 },
        { name: 'IT/互联网', percentage: 15 },
        { name: '咨询', percentage: 10 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议学习金融科技、量化分析等领域，掌握AI在金融风险管理、投资决策中的应用。同时培养人际沟通和客户服务能力，这些是AI难以替代的。'
    },
    '市场营销': {
      major: '市场营销',
      employmentRate: 86.5,
      averageSalary: Math.round(9000 * rf * ef),
      graduateSize: Math.round(70000 * ef),
      aiRisk: 45,
      aiPotential: 70,
      aiImpactIndex: 45,
      topIndustries: [
        { name: '咨询', percentage: 35 },
        { name: 'IT/互联网', percentage: 30 },
        { name: '金融', percentage: 20 },
        { name: '其他', percentage: 15 }
      ],
      employmentAdvice: '建议学习数字营销、数据分析和内容创作，利用AI工具提升营销效果。同时培养品牌策略、用户洞察等创造性思维能力，这些是AI难以复制的。'
    },
    '临床医学': {
      major: '临床医学',
      employmentRate: 94.3,
      averageSalary: Math.round(11000 * rf * ef),
      graduateSize: Math.round(60000 * ef),
      aiRisk: 20,
      aiPotential: 65,
      aiImpactIndex: 75,
      topIndustries: [
        { name: '医疗', percentage: 90 },
        { name: '科研', percentage: 5 },
        { name: '其他', percentage: 5 }
      ],
      employmentAdvice: '建议学习医学AI、精准医疗等前沿领域，掌握AI辅助诊断和治疗技术。同时培养临床思维、手术技能和人文关怀能力，这些是AI无法替代的。'
    }
  }
}

// 加载数据
export const loadData = (educationLevel = 'all', region = 'all') => {
  return Promise.resolve({
    timeSeries: generateTimeSeriesData(educationLevel, region),
    riverChart: generateRiverChartData(educationLevel, region),
    aiMatrix: generateAIMatrixData(educationLevel, region),
    sankey: generateSankeyData(educationLevel, region),
    majorDetails: generateMajorDetails(educationLevel, region)
  })
}