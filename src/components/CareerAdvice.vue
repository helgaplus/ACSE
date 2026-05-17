<template>
  <div class="career-advice-container">
    <div class="advice-header">
      <h2 class="advice-title">
        <span class="advice-icon">💡</span>
        就业指导建议
      </h2>
      <p class="advice-subtitle">选择专业获取个性化就业指导</p>
    </div>

    <div class="major-selector">
      <label class="selector-label">选择专业</label>
      <select v-model="selectedMajor" class="major-select">
        <option value="">请选择专业...</option>
        <option v-for="major in majors" :key="major.name" :value="major.name">
          {{ major.name }} ({{ major.category }})
        </option>
      </select>
    </div>

    <div v-if="selectedMajor" class="advice-content">
      <div class="advice-card main-advice">
        <div class="card-header">
          <span class="card-icon">🎯</span>
          <h3>综合评估</h3>
        </div>
        <div class="card-body">
          <div class="major-badge">
            {{ currentMajorData.category }}
          </div>
          <p class="overall-assessment">{{ currentMajorData.overallAssessment }}</p>
        </div>
      </div>

      <div class="advice-grid">
        <div class="advice-card">
          <div class="card-header">
            <span class="card-icon">🤖</span>
            <h3>AI替代风险</h3>
          </div>
          <div class="card-body">
            <div class="risk-indicator">
              <div class="risk-bar">
                <div
                  class="risk-fill"
                  :class="getRiskClass(currentMajorData.aiRisk)"
                  :style="{ width: currentMajorData.aiRisk + '%' }"
                ></div>
              </div>
              <span class="risk-value">
                {{ currentMajorData.aiRisk }}%
              </span>
            </div>
            <p class="risk-description">{{ currentMajorData.aiRiskDescription }}</p>
          </div>
        </div>

        <div class="advice-card">
          <div class="card-header">
            <span class="card-icon">📈</span>
            <h3>发展前景</h3>
          </div>
          <div class="card-body">
            <div class="prospect-stars">
              <span
                v-for="i in 5"
                :key="i"
                class="star"
                :class="{ active: i <= currentMajorData.prospectLevel }"
              >★</span>
            </div>
            <p class="prospect-description">{{ currentMajorData.prospectDescription }}</p>
          </div>
        </div>

        <div class="advice-card">
          <div class="card-header">
            <span class="card-icon">💰</span>
            <h3>薪资水平</h3>
          </div>
          <div class="card-body">
            <div class="salary-range">
              <span class="salary-label">应届生起薪</span>
              <span class="salary-value">{{ currentMajorData.salaryRange }}</span>
            </div>
            <p class="salary-description">{{ currentMajorData.salaryDescription }}</p>
          </div>
        </div>

        <div class="advice-card">
          <div class="card-header">
            <span class="card-icon">🚀</span>
            <h3>就业竞争力</h3>
          </div>
          <div class="card-body">
            <div class="competitiveness-score">
              <span class="score-value">{{ currentMajorData.competitiveness }}</span>
              <span class="score-max">/10</span>
            </div>
            <p class="competitiveness-description">{{ currentMajorData.competitivenessDescription }}</p>
          </div>
        </div>
      </div>

      <div class="advice-card recommendations">
        <div class="card-header">
          <span class="card-icon">📝</span>
          <h3>发展建议</h3>
        </div>
        <div class="card-body">
          <ul class="recommendations-list">
            <li v-for="(rec, index) in currentMajorData.recommendations" :key="index">
              <span class="rec-number">{{ index + 1 }}</span>
              <span class="rec-text">{{ rec }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="advice-card skills">
        <div class="card-header">
          <span class="card-icon">🔧</span>
          <h3>核心技能</h3>
        </div>
        <div class="card-body">
          <div class="skills-tags">
            <span
              v-for="skill in currentMajorData.coreSkills"
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🎓</div>
      <p class="empty-text">请从上方选择专业</p>
      <p class="empty-hint">系统将根据该专业的就业趋势和AI影响程度提供个性化建议</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const selectedMajor = ref('')

const majors = [
  { name: '计算机科学与技术', category: '工学' },
  { name: '软件工程', category: '工学' },
  { name: '人工智能', category: '工学' },
  { name: '数据科学与大数据技术', category: '工学' },
  { name: '机械工程', category: '工学' },
  { name: '电子信息工程', category: '工学' },
  { name: '土木工程', category: '工学' },
  { name: '英语', category: '文学' },
  { name: '汉语言文学', category: '文学' },
  { name: '新闻学', category: '文学' },
  { name: '金融学', category: '经济学' },
  { name: '国际经济与贸易', category: '经济学' },
  { name: '会计学', category: '管理学' },
  { name: '工商管理', category: '管理学' },
  { name: '市场营销', category: '管理学' },
  { name: '临床医学', category: '医学' },
  { name: '药学', category: '医学' },
  { name: '法学', category: '法学' },
  { name: '教育学', category: '教育学' }
]

const majorAdviceData = {
  '计算机科学与技术': {
    category: '工学',
    overallAssessment: '计算机科学与技术是当前就业市场最热门专业之一，AI时代需求持续增长。建议重点关注人工智能、云计算、大数据等前沿方向，同时培养良好的数学基础和算法能力。',
    aiRisk: 25,
    aiRiskDescription: 'AI将辅助而非替代该专业岗位，反而会创造更多开发、运维、AI应用等就业机会。',
    prospectLevel: 5,
    prospectDescription: '数字化转型推动下，IT人才需求将长期保持高位，薪资增速领先其他行业。',
    salaryRange: '12-25万/年',
    salaryDescription: '一线城市大厂应届生可达30万以上，二三线城市薪资相对较低但增速稳定。',
    competitiveness: 9,
    competitivenessDescription: '专业性强、技术门槛高，在就业市场具有较强议价能力和职业发展空间。',
    recommendations: [
      '扎实掌握数据结构与算法，这是程序员的核心竞争力',
      '尽早接触AI/ML领域知识，向AI工程师方向发展',
      '积极参与开源项目，积累实战经验和行业人脉',
      '培养产品思维，从单纯技术实现向解决方案设计转型',
      '持续学习新技术，保持技术敏感度和竞争力'
    ],
    coreSkills: ['编程语言', '算法数据结构', '数据库', '操作系统', '计算机网络', 'AI/ML基础']
  },
  '软件工程': {
    category: '工学',
    overallAssessment: '软件工程专业注重工程实践能力培养，毕业生主要从事软件开发、测试、项目管理等岗位。AI辅助编程工具的兴起正在改变该行业的开发模式。',
    aiRisk: 30,
    aiRiskDescription: 'AI代码生成工具将承担更多基础编码工作，但高级系统设计和架构能力仍不可替代。',
    prospectLevel: 5,
    prospectDescription: '企业数字化转型持续推进，软件人才需求稳定，但需向更高阶技术方向升级。',
    salaryRange: '10-22万/年',
    salaryDescription: '互联网行业薪资较高，传统行业软件岗位薪资相对平稳。',
    competitiveness: 8,
    competitivenessDescription: '实用性强、就业面广，但从业者众多，需通过差异化技能提升竞争力。',
    recommendations: [
      '掌握AI辅助编程工具（如Copilot），提升开发效率',
      '深入理解软件工程全流程，从开发向架构设计延伸',
      '培养领域业务理解能力，成为既懂技术又懂业务的复合型人才',
      '重视代码质量和工程规范，养成良好编码习惯',
      '积累大型项目实战经验，提升问题解决能力'
    ],
    coreSkills: ['软件开发', '软件测试', '项目管理', '版本控制', '敏捷开发', 'AI辅助编程']
  },
  '人工智能': {
    category: '工学',
    overallAssessment: '人工智能是当今最前沿的学科之一，直接对接AI技术研发和应用的核心领域。该专业人才稀缺但要求极高，需具备扎实的数学功底和持续学习能力。',
    aiRisk: 15,
    aiRiskDescription: '作为AI技术的创造者，该专业就业安全指数最高，职业发展路径广阔。',
    prospectLevel: 5,
    prospectDescription: 'AI行业爆发式增长，人才缺口巨大，未来10年仍是黄金发展期。',
    salaryRange: '20-40万/年',
    salaryDescription: '头部AI公司和独角兽企业开出高薪争抢人才，顶尖毕业生可获50万+offer。',
    competitiveness: 10,
    competitivenessDescription: '专业壁垒极高，从业者数量有限，在就业市场具有绝对稀缺性和话语权。',
    recommendations: [
      '深耕机器学习、深度学习核心算法原理，不可只会调库',
      '关注大模型发展动态，掌握Prompt Engineering等新技能',
      '参与顶级会议论文发表或国际竞赛，提升学术影响力',
      '积累大模型训练和部署经验，这是当前最热门的方向',
      '培养跨学科思维，AI+X将创造更多职业可能性'
    ],
    coreSkills: ['机器学习', '深度学习', '自然语言处理', '计算机视觉', '大模型技术', '数学基础']
  },
  '数据科学与大数据技术': {
    category: '工学',
    overallAssessment: '数据科学是AI时代的基础设施学科，培养数据分析和挖掘人才。企业数字化转型带来海量数据处理需求，该专业就业前景广阔。',
    aiRisk: 35,
    aiRiskDescription: 'AI可以辅助数据分析工作，但业务理解和数据洞察能力仍需人类专家。',
    prospectLevel: 5,
    prospectDescription: '数据驱动决策已成企业标配，数据人才需求持续增长。',
    salaryRange: '15-30万/年',
    salaryDescription: '互联网和金融行业数据岗位薪资领先，传统行业正在加速数字化转型。',
    competitiveness: 9,
    competitivenessDescription: '复合型人才稀缺，既懂技术又懂业务的数据科学家供不应求。',
    recommendations: [
      '精通Python数据分析生态（Pandas、NumPy、Scikit-learn）',
      '学习大数据技术栈（Hadoop、Spark、Flink）',
      '培养业务理解能力，让数据真正转化为商业价值',
      '掌握数据可视化技能，善于讲好数据故事',
      '关注AIGC和大模型应用，探索数据与AI结合的新方向'
    ],
    coreSkills: ['Python', '数据分析', '机器学习', '大数据技术', '数据可视化', '统计学']
  },
  '机械工程': {
    category: '工学',
    overallAssessment: '机械工程是传统工科基础专业，就业面广但竞争激烈。智能制造和工业4.0为该专业带来新机遇，传统机械人才需向智能化方向转型。',
    aiRisk: 55,
    aiRiskDescription: '自动化生产线将替代部分传统机械岗位，但高端设计和研发岗位需求稳定。',
    prospectLevel: 3,
    prospectDescription: '传统机械行业增长放缓，智能制造、新能源汽车等新兴领域带来新机会。',
    salaryRange: '8-15万/年',
    salaryDescription: '传统机械行业薪资一般，新能源、智能制造等新兴方向薪资可达20万+。',
    competitiveness: 6,
    competitivenessDescription: '开设院校多、从业者众，需通过考研或考取专业证书提升竞争力。',
    recommendations: [
      '学习CAD/CAE等设计软件，掌握数字化设计能力',
      '了解智能制造、工业机器人等新兴技术方向',
      '向机电一体化、智能装备等交叉领域发展',
      '考取工程师职称或专业资格证书',
      '关注新能源汽车、航空航天等国家重点发展领域'
    ],
    coreSkills: ['机械设计', '制造工艺', 'CAD/CAM', '材料力学', '机电一体化', '智能制造']
  },
  '电子信息工程': {
    category: '工学',
    overallAssessment: '电子信息工程是信息技术产业的核心专业之一，5G、物联网、智能硬件等领域发展迅速，为该专业毕业生提供了广阔的发展空间。',
    aiRisk: 40,
    aiRiskDescription: '硬件设计相对抗AI替代，但芯片设计自动化和嵌入式AI正在改变行业形态。',
    prospectLevel: 4,
    prospectDescription: '半导体、芯片、5G通信、智能硬件等领域政策支持力度大，发展前景良好。',
    salaryRange: '12-25万/年',
    salaryDescription: '半导体和芯片行业薪资增长迅速，人工智能芯片方向尤为稀缺。',
    competitiveness: 8,
    competitivenessDescription: '专业门槛较高，从业者相对有限，国产替代浪潮带来新机遇。',
    recommendations: [
      '夯实电路、信号处理等基础知识',
      '学习嵌入式系统和物联网技术',
      '关注半导体和芯片设计方向，这是国家战略重点',
      '掌握PCB设计和硬件调试能力',
      '结合AI发展智能硬件、边缘计算等新方向'
    ],
    coreSkills: ['电路分析', '信号处理', '嵌入式系统', '物联网技术', 'PCB设计', '硬件调试']
  },
  '土木工程': {
    category: '工学',
    overallAssessment: '土木工程是传统优势专业，但房地产市场调整对就业造成影响。新基建、城市更新、绿色建筑等领域正在成为新的增长点。',
    aiRisk: 60,
    aiRiskDescription: 'BIM、AI设计工具将替代部分绘图和预算工作，但现场管理仍需人类完成。',
    prospectLevel: 2,
    prospectDescription: '房地产行业进入调整期，新基建和城市更新带来结构性机会。',
    salaryRange: '8-18万/年',
    salaryDescription: '施工一线薪资尚可，设计院和地产公司薪资相对较高但竞争激烈。',
    competitiveness: 5,
    competitivenessDescription: '开设院校众多，毕业生就业压力大，需向高端咨询和管理方向发展。',
    recommendations: [
      '掌握BIM技术，这是行业数字化转型的基础',
      '学习绿色建筑和智能建造等新兴技术',
      '考取一级建造师等执业资格证书',
      '向工程咨询、项目管理等方向拓展',
      '关注新基建、城市更新等政策热点领域'
    ],
    coreSkills: ['结构设计', '施工技术', '项目管理', 'BIM技术', '工程力学', '工程经济']
  },
  '英语': {
    category: '文学',
    overallAssessment: '英语专业培养语言能力和跨文化交际能力，但AI翻译技术的进步对该专业造成冲击。建议向翻译+专业、语言+技术的复合方向发展。',
    aiRisk: 65,
    aiRiskDescription: 'AI翻译已能胜任大部分日常翻译场景，专业翻译面临较大替代压力。',
    prospectLevel: 2,
    prospectDescription: '纯语言服务需求下降，但国际化背景下英语作为工作语言仍不可或缺。',
    salaryRange: '6-12万/年',
    salaryDescription: '传统翻译和教学岗位薪资偏低，跨境电商、国际贸易等方向薪资更优。',
    competitiveness: 5,
    competitivenessDescription: '英语专业性强但替代性也在增强，需与行业专业结合才能提升竞争力。',
    recommendations: [
      '发展AI无法替代的核心能力：跨文化沟通、创意写作、批判性思维',
      '考取CATTI翻译资格证书，提升专业认可度',
      '学习法律、金融、科技等垂直领域的专业英语',
      '向国际商务、跨境电商、新媒体运营等方向转型',
      '培养双外语能力，增强不可替代性'
    ],
    coreSkills: ['英语听说读写', '翻译', '跨文化交际', '商务英语', '文案写作', '第二外语']
  },
  '汉语言文学': {
    category: '文学',
    overallAssessment: '汉语言文学专业培养文学素养和文字功底，就业方向包括教育、媒体、出版、文秘等。AI内容生成技术正在重塑内容创作行业。',
    aiRisk: 55,
    aiRiskDescription: 'AI可辅助内容创作，但原创文学、深度评论、情感表达等仍需人类完成。',
    prospectLevel: 3,
    prospectDescription: '新媒体和文化产业快速发展，内容创作需求旺盛，但竞争也日趋激烈。',
    salaryRange: '6-15万/年',
    salaryDescription: '传统媒体和出版业薪资偏低，新媒体和内容创业可能带来更高回报。',
    competitiveness: 6,
    competitivenessDescription: '培养人文素养但技能门槛相对较低，需通过差异化定位提升竞争力。',
    recommendations: [
      '培养AI时代稀缺的原创思维和深度思考能力',
      '学习新媒体运营和数字内容创作技能',
      '发展文案策划、品牌故事等商业写作能力',
      '积累作品集，展示写作能力和创意思维',
      '关注文化产业、新媒体等新兴领域机会'
    ],
    coreSkills: ['文学鉴赏', '创意写作', '文案策划', '新媒体运营', '编辑出版', '文化研究']
  },
  '新闻学': {
    category: '文学',
    overallAssessment: '新闻学专业培养新闻采编和传播能力，但媒体行业正在经历深刻变革。短视频、自媒体崛起改变了新闻传播格局，也带来了新机遇。',
    aiRisk: 70,
    aiRiskDescription: 'AI新闻写作已应用于财经、体育等领域基础报道，但深度调查和评论仍不可替代。',
    prospectLevel: 2,
    prospectDescription: '传统媒体就业承压，但新媒体、MCN机构、企业品牌传播等领域需求增长。',
    salaryRange: '6-12万/年',
    salaryDescription: '传统媒体薪资有限，头部新媒体和自媒体可能获得更高收入。',
    competitiveness: 5,
    competitivenessDescription: '门槛不高但优秀人才稀缺，需具备全媒体技能和独特视角。',
    recommendations: [
      '掌握全媒体技能：文字、图片、短视频、数据新闻',
      '培养独特新闻敏感性和深度调查能力',
      '学习数据分析和可视化叙事技能',
      '积累自媒体运营经验，建立个人IP',
      '关注企业内容营销和品牌传播领域机会'
    ],
    coreSkills: ['新闻采编', '内容创作', '多媒体制作', '数据分析', '社交媒体运营', '传播学理论']
  },
  '金融学': {
    category: '经济学',
    overallAssessment: '金融学是热门专业之一，银行、证券、基金、保险等金融机构是主要就业方向。金融科技正在改变传统金融业，对复合型人才需求增加。',
    aiRisk: 50,
    aiRiskDescription: 'AI风控、智能投顾、自动化客服等正在替代部分金融岗位，但高端分析仍需人类。',
    prospectLevel: 4,
    prospectDescription: '金融行业仍是高薪行业，但需向金融科技方向转型以适应数字化趋势。',
    salaryRange: '12-25万/年',
    salaryDescription: '证券、基金行业薪资较高，银行相对稳定，差异化明显。',
    competitiveness: 8,
    competitivenessDescription: '名校背景和资格证书（如CFA）能显著提升竞争力。',
    recommendations: [
      '考取CFA、FRM等专业资格证书',
      '学习编程和数据分析技能，向金融科技方向发展',
      '了解区块链、数字货币等新兴金融领域',
      '积累券商、投行实习经验',
      '培养宏观分析能力和风险意识'
    ],
    coreSkills: ['金融理论', '投资分析', '风险管理', '财务报表分析', '金融科技', '宏观经济学']
  },
  '国际经济与贸易': {
    category: '经济学',
    overallAssessment: '国贸专业涉及国际贸易理论和实务，但全球化遇阻和贸易摩擦对该专业就业造成影响。跨境电商成为新的增长点。',
    aiRisk: 55,
    aiRiskDescription: 'AI可处理订单、通关等标准化流程，但贸易谈判和市场开拓仍需人类。',
    prospectLevel: 3,
    prospectDescription: '跨境电商和数字贸易带来新机遇，但传统外贸行业竞争激烈。',
    salaryRange: '8-18万/年',
    salaryDescription: '沿海城市和外贸发达地区薪资较高，跨境电商运营岗位需求旺盛。',
    competitiveness: 6,
    competitivenessDescription: '英语能力和国际贸易实务经验是核心竞争力。',
    recommendations: [
      '提升英语商务沟通能力',
      '学习跨境电商平台运营（亚马逊、Shopee等）',
      '了解进出口报关和跨境物流实务',
      '关注RCEP、一带一路等政策机遇',
      '培养外贸单证和风险管理能力'
    ],
    coreSkills: ['国际贸易理论', '商务英语', '跨境电商', '进出口实务', '报关报检', '外贸函电']
  },
  '会计学': {
    category: '管理学',
    overallAssessment: '会计是商业通用语言，企业、政府机关、非营利组织都需要会计人才。财务数字化和AI正在改变传统会计工作模式。',
    aiRisk: 60,
    aiRiskDescription: 'AI可完成基础记账、报税、报表等工作，但财务分析和决策支持仍需人类。',
    prospectLevel: 3,
    prospectDescription: '传统会计岗位需求减少，财务分析、税务筹划、管理会计等方向前景更好。',
    salaryRange: '8-15万/年',
    salaryDescription: '四大和知名企业会计岗位薪资较高，基层会计薪资一般。',
    competitiveness: 7,
    competitivenessDescription: '从业者众多，需通过CPA等证书和经验积累提升竞争力。',
    recommendations: [
      '考取CPA或ACCA等专业资格证书',
      '学习财务数字化工具和ERP系统',
      '向管理会计、财务分析方向发展',
      '培养业财融合能力，理解业务逻辑',
      '关注企业风险管理和内部控制领域'
    ],
    coreSkills: ['财务会计', '成本会计', '财务管理', '审计', '税法', '财务软件']
  },
  '工商管理': {
    category: '管理学',
    overallAssessment: '工商管理专业知识面广但深度有限，适合培养管理潜质。毕业生多从基层做起，需在实践中积累管理经验。',
    aiRisk: 50,
    aiRiskDescription: 'AI可辅助市场分析、运营优化等管理工作，但综合管理决策仍需人类主导。',
    prospectLevel: 3,
    prospectDescription: '就业面广但起薪一般，需通过MBA或多年经验积累向管理层发展。',
    salaryRange: '8-20万/年',
    salaryDescription: '管理培训生项目薪资较高，企业中高层管理者收入可观。',
    competitiveness: 6,
    competitivenessDescription: '专业门槛较低，实践经验和个人素质对职业发展影响更大。',
    recommendations: [
      '尽早确定感兴趣的管理方向：营销、人力、运营等',
      '积累实习和实践经验，管理能力需要在实践中培养',
      '培养商业思维和数据分析能力',
      '考取相关职业资格证书',
      '建立人脉资源，管理岗位往往更看重人脉'
    ],
    coreSkills: ['企业管理', '市场营销', '人力资源', '运营管理', '战略管理', '商业分析']
  },
  '市场营销': {
    category: '管理学',
    overallAssessment: '市场营销是企业经营的核心职能之一，电商、直播带货等新营销模式创造了大量就业机会。',
    aiRisk: 45,
    aiRiskDescription: 'AI可辅助数据分析、广告投放优化等工作，但创意策划和用户洞察仍不可替代。',
    prospectLevel: 4,
    prospectDescription: '数字营销、私域运营、直播电商等领域需求旺盛。',
    salaryRange: '8-20万/年',
    salaryDescription: '电商和互联网公司营销岗位薪资较高，头部达人收入可观。',
    competitiveness: 7,
    competitivenessDescription: '门槛不高但顶尖营销人才稀缺，效果营销和用户增长方向炙手可热。',
    recommendations: [
      '掌握数字营销工具和数据分析技能',
      '学习电商运营和直播带货技巧',
      '培养用户洞察和创意策划能力',
      '积累实际营销案例和项目经验',
      '关注私域运营、社群营销等新兴领域'
    ],
    coreSkills: ['市场营销', '数字营销', '消费者行为', '品牌管理', '电商运营', '数据分析']
  },
  '临床医学': {
    category: '医学',
    overallAssessment: '临床医学是高度专业化的学科，医生的培养周期长、门槛高、就业稳定。AI辅助诊断正在成为趋势，但不会替代医生。',
    aiRisk: 25,
    aiRiskDescription: 'AI可辅助影像诊断、病历分析等，但临床诊断和患者沟通必须由医生完成。',
    prospectLevel: 5,
    prospectDescription: '医疗需求持续增长，老龄化社会带来更多机会，但竞争激烈。',
    salaryRange: '10-25万/年',
    salaryDescription: '不同科室和医院等级差异较大，顶尖医院和热门科室收入可观。',
    competitiveness: 9,
    competitivenessDescription: '专业壁垒极高，培养周期长，是最稳定的职业之一。',
    recommendations: [
      '扎实掌握医学基础知识和解剖学',
      '注重临床实习和实践经验积累',
      '关注AI辅助医疗等新技术发展方向',
      '培养医患沟通能力和职业素养',
      '考虑继续深造或出国进修'
    ],
    coreSkills: ['临床诊断', '医学知识', '患者沟通', '病例分析', '外科操作', '医学伦理']
  },
  '药学': {
    category: '医学',
    overallAssessment: '药学专业涉及药物研发、生产、流通、使用等环节。创新药研发和医药电商是行业发展方向。',
    aiRisk: 45,
    aiRiskDescription: 'AI可加速药物分子设计，但临床用药指导和新药研发仍需专业药师。',
    prospectLevel: 4,
    prospectDescription: '创新药和生物医药受到政策支持，发展前景良好。',
    salaryRange: '8-18万/年',
    salaryDescription: '研发和注册岗位薪资较高，药店和医院药房相对稳定。',
    competitiveness: 7,
    competitivenessDescription: '专业性较强，执业药师资格证是核心竞争力。',
    recommendations: [
      '考取执业药师资格证书',
      '了解创新药研发流程和法规',
      '学习药物分析和质量控制技术',
      '关注医药电商和互联网医疗方向',
      '培养临床药学服务能力'
    ],
    coreSkills: ['药物化学', '药理学', '药剂学', '药物分析', '药品法规', '临床药学']
  },
  '法学': {
    category: '法学',
    overallAssessment: '法学专业培养法律专业人才，通过法律职业资格考试是成为律师、法官的基础。AI法律工具正在辅助法律工作。',
    aiRisk: 45,
    aiRiskDescription: 'AI可辅助法律检索、合同审查等，但诉讼代理和法律咨询仍需律师完成。',
    prospectLevel: 4,
    prospectDescription: '法律服务需求持续增长，AI时代更需要高端法律人才。',
    salaryRange: '8-30万/年',
    salaryDescription: '律师收入差异极大，红圈所律师薪资丰厚，基层律师起步较难。',
    competitiveness: 8,
    competitivenessDescription: '通过法考是基本门槛，名校背景和实务经验决定职业高度。',
    recommendations: [
      '尽早通过法律职业资格考试',
      '选择感兴趣的法律专业方向：民商法、刑法、知识产权等',
      '积累律所实习经验，了解律师执业实务',
      '培养法律检索和文书写作能力',
      '关注科技法、跨境法律服务等新兴领域'
    ],
    coreSkills: ['法律知识', '法律文书', '法律检索', '诉讼实务', '合同审查', '法律逻辑']
  },
  '教育学': {
    category: '教育学',
    overallAssessment: '教育学专业涉及教育理论、教学方法、教育管理等方面。教育培训行业经历调整，但教育数字化带来新机遇。',
    aiRisk: 50,
    aiRiskDescription: 'AI可辅助作业批改、知识讲解等，但教育和心理引导仍需教师完成。',
    prospectLevel: 3,
    prospectDescription: '双减政策影响教培行业，但职业教育、在线教育、教育科技方向仍有空间。',
    salaryRange: '6-15万/年',
    salaryDescription: '学校和公立教育机构薪资稳定，教培机构差异较大。',
    competitiveness: 6,
    competitivenessDescription: '教师资格证是基本要求，名校背景和专业方向影响就业。',
    recommendations: [
      '考取教师资格证书',
      '关注教育数字化和智慧教育方向',
      '培养在线教学和教育科技应用能力',
      '了解职业教育、技能培训等新兴领域',
      '培养教育研究和课程设计能力'
    ],
    coreSkills: ['教育理论', '教学设计', '教育心理学', '课程开发', '在线教育', '教育技术']
  }
}

const currentMajorData = computed(() => {
  if (!selectedMajor.value) return null
  return majorAdviceData[selectedMajor.value] || {
    category: '未知',
    overallAssessment: '暂无该专业的数据',
    aiRisk: 50,
    aiRiskDescription: '',
    prospectLevel: 3,
    prospectDescription: '',
    salaryRange: '待定',
    salaryDescription: '',
    competitiveness: 5,
    competitivenessDescription: '',
    recommendations: [],
    coreSkills: []
  }
})

const getRiskClass = (risk) => {
  if (risk < 30) return 'low'
  if (risk < 50) return 'medium'
  return 'high'
}
</script>

<style scoped>
.career-advice-container {
  background: transparent;
  padding: 0;
}

.advice-header {
  margin-bottom: 1.25rem;
}

.advice-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.375rem;
}

.advice-icon {
  font-size: 1.125rem;
}

.advice-subtitle {
  font-size: 0.8125rem;
  color: #888;
  margin: 0;
}

.major-selector {
  margin-bottom: 1.25rem;
}

.selector-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
}

.major-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #000;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.major-select:hover {
  border-color: #000;
}

.major-select:focus {
  outline: none;
  border-color: #000;
}

.advice-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.advice-card {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #eee;
}

.advice-card.main-advice {
  background: #000;
  color: #fff;
  border-color: #000;
}

.advice-card.main-advice .card-header h3 {
  color: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.card-icon {
  font-size: 1rem;
}

.card-body {
  color: #555;
}

.major-badge {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #000;
  background: #fff;
  margin-bottom: 0.5rem;
}

.overall-assessment {
  font-size: 0.8125rem;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.risk-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.risk-bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.risk-fill.low {
  background: #888;
}

.risk-fill.medium {
  background: #555;
}

.risk-fill.high {
  background: #333;
}

.risk-value {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 35px;
  color: #000;
}

.risk-description,
.prospect-description,
.salary-description,
.competitiveness-description {
  font-size: 0.75rem;
  line-height: 1.5;
  margin: 0;
}

.prospect-stars {
  display: flex;
  gap: 0.125rem;
  margin-bottom: 0.5rem;
}

.star {
  font-size: 0.875rem;
  color: #ddd;
}

.star.active {
  color: #000;
}

.salary-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: #fafafa;
  border-radius: 4px;
}

.salary-label {
  font-size: 0.6875rem;
  color: #888;
}

.salary-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #000;
}

.competitiveness-score {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
}

.score-max {
  font-size: 0.75rem;
  color: #999;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendations-list li {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.recommendations-list li:last-child {
  border-bottom: none;
}

.rec-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  font-size: 0.625rem;
  font-weight: 700;
  flex-shrink: 0;
}

.rec-text {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #444;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.skill-tag {
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.6875rem;
  color: #666;
}

.skill-tag:hover {
  background: #e0e0e0;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.empty-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #444;
  margin: 0 0 0.375rem 0;
}

.empty-hint {
  font-size: 0.75rem;
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .advice-grid {
    grid-template-columns: 1fr;
  }
}
</style>