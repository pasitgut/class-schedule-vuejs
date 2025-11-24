<script setup lang="ts">
import type { VisualCourse } from '../../types/schedule';

defineProps<{
  modelValue: boolean;
  course: VisualCourse;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'edit', course: VisualCourse): void;
  (e: 'delete', id: string): void;
}>();
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden relative p-6">
      
      <button 
        @click="emit('update:modelValue', false)" 
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="mb-4 pr-6">
        <h3 class="text-2xl font-bold text-gray-800">{{ course.subject_code }}</h3>
        <p class="text-lg text-gray-600 leading-tight">{{ course.subject_name_th }}</p>
      </div>
      
      <div class="space-y-3 text-sm md:text-base">
        <div class="flex items-start">
          <span class="font-semibold w-24 text-gray-500">Time:</span>
          <span class="font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {{ course.day_w }} {{ course.time_from }} - {{ course.time_to }}
          </span>
        </div>
        <div class="flex items-start">
          <span class="font-semibold w-24 text-gray-500">Room:</span>
          <span>{{ course.room_name_th || '-' }}</span>
        </div>
        <div class="flex items-start">
          <span class="font-semibold w-24 text-gray-500">Type:</span>
          <span>{{ course.section_type_th }} (Sec {{ course.section_code }})</span>
        </div>
      </div>

      <div class="mt-8 flex gap-3 pt-4 border-t">
        <button 
          @click="emit('delete', course.id)"
          class="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 font-medium"
        >
          Delete
        </button>
        <button 
          @click="emit('edit', course)"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Edit
        </button>
      </div>

    </div>
  </div>
</template>