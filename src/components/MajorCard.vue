<template>
  <div class="major-card">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ data.major }}</h3>
      <button 
        @click="$emit('close')" 
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ×
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 基本信息 -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">基本信息</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">就业率：</span>
            <span class="font-medium">{{ data.employmentRate }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">平均起薪：</span>
            <span class="font-medium">¥{{ data.averageSalary }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">毕业生规模：</span>
            <span class="font-medium">{{ data.graduateSize }}</span>
          </div>
        </div>
      </div>

      <!-- AI 影响 -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">AI 影响</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">AI 替代风险：</span>
            <span class="font-medium">{{ data.aiRisk }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">AI 互补潜力：</span>
            <span class="font-medium">{{ data.aiPotential }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">AI 影响指数：</span>
            <span class="font-medium">{{ data.aiImpactIndex }}</span>
          </div>
        </div>
      </div>

      <!-- 行业流向 -->
      <div class="md:col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">行业流向 Top5</h4>
        <div class="space-y-2">
          <div v-for="(industry, index) in data.topIndustries" :key="index" class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ industry.name }}：</span>
            <span class="font-medium">{{ industry.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- 就业指导 -->
      <div class="md:col-span-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">就业指导</h4>
        <p class="text-gray-700 dark:text-gray-300">{{ data.employmentAdvice }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])
</script>

<style scoped>
.major-card {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>