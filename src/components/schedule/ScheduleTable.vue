<script setup lang="ts">
import type { VisualCourse } from '../../types/schedule';

defineProps<{
  headers: string[];
  visibleDays: string[];
  mappedCourses: Record<string, VisualCourse[]>;
  gridStyle: any;
  config: { startHour: number; endHour: number };
  getMaxRows: (day: string) => number;
}>();

const emit = defineEmits<{
  (e: 'click-course', course: VisualCourse): void
}>();
</script>

<template>
  <div class="overflow-x-auto border mt-4 rounded-lg bg-white shadow-sm scrollbar-hide">
    <div class="time-grid" :style="gridStyle">
      <div 
        v-for="(header, idx) in headers" 
        :key="`h-${idx}`"
        class="border py-1 px-1 font-bold bg-gray-200 z-10 text-xs md:text-sm flex items-center justify-center whitespace-nowrap"
        style="grid-column: span 12;"
      >
        {{ header }}
      </div>
    </div>

    <div 
      v-for="day in visibleDays" 
      :key="day" 
      class="time-grid border-b relative"
      :style="{ ...gridStyle, gridAutoRows: 'minmax(4.5rem, auto)' }"
    >
      
      <div 
        class="p-2 border-r-2 bg-gray-100 font-bold z-10 flex items-center justify-center text-sm"
        :style="{ gridColumn: 'span 12', gridRow: `1 / span ${getMaxRows(day)}` }"
      >
        {{ day }}
      </div>

      <div 
        class="absolute inset-0 w-full h-full pointer-events-none grid-lines"
        :style="{ display: 'grid', gridTemplateColumns: gridStyle.gridTemplateColumns, gridRow: `1 / span ${getMaxRows(day)}` }"
      >
        <div 
          v-for="h in (config.endHour - config.startHour + 2)" 
          :key="`line-${h}`"
          class="border-l border-gray-100 h-full" 
          style="grid-column: span 12;"
        ></div>
      </div>

      <div 
        v-for="course in mappedCourses[day]" 
        :key="course.id"
        @click="emit('click-course', course)"
        class="p-1 text-[10px] md:text-xs rounded flex flex-col justify-between overflow-hidden z-10 hover:brightness-95 hover:scale-[1.01] transition cursor-pointer shadow-sm relative group h-full"
        :style="{
          gridColumnStart: course.startCol,
          gridColumnEnd: course.endCol,
          gridRow: (course.stackIndex + 1),
          backgroundColor: course.color?.bg,
          borderColor: course.color?.border,
          borderWidth: '1px', 
          borderLeftWidth: '4px', 
          borderStyle: 'solid', 
          margin: '1px'
        }"
      >
        <div class="mb-1 leading-tight">
          <p class="font-bold truncate">{{ course.subject_code }}</p>
          <p>{{ course.time_from }} - {{ course.time_to }}</p>
        </div>
        <div class="leading-tight">
          <p class="truncate font-medium">{{ course.subject_name_th }}</p>
          <p class="truncate text-gray-600 mt-1">{{ course.room_name_th }} ({{ course.section_type_th }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-grid {
  display: grid;
  /* grid-template-columns is dynamic via inline style */
}
.grid-lines > div:first-child {
  border-left: none; 
}
</style>