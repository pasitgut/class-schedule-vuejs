<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import html2canvas from "html2canvas";
import type { Options } from "html2canvas";

const printcontent = ref<HTMLElement>(null!);
const courses = ref<any[]>([]);
const loading = ref(false);
const peroid_date = ref("");

const headers = ref([
  "Day/Time",
  "8:00", "9:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
]);

const orderedDate = computed(() => ["MON", "TUE", "WED", "THU", "FRI"]);

// ✅ Custom color palette
const colorPalette = [
  { base: 'pink',   bg: '#FDD8EE', border: '#C7117F' },
  { base: 'yellow', bg: '#FFF2C4', border: '#EB9C03' },
  { base: 'blue',   bg: '#DAEFFE', border: '#0C5A93' },
  { base: 'green',  bg: '#D1FEB6', border: '#4B991C' },
  { base: 'orange', bg: '#FFE2BF', border: '#D67F19' },
  { base: 'purple', bg: '#F3D6FD', border: '#681A83' },
];

const subjectColorMap = ref<Record<string, { bg: string; border: string }>>({});

const assignColorsToSubjects = () => {
  const used = new Set<string>();
  let index = 0;
  for (const course of courses.value) {
    const code = course.subject_code;
    if (!used.has(code)) {
      subjectColorMap.value[code] = colorPalette[index % colorPalette.length];
      used.add(code);
      index++;
    }
  }
};

const mappedCourses = computed(() => {
  if (!Array.isArray(courses.value)) return {};
  return courses.value.reduce((acc, course) => {
    const dayKey = course.day_w.trim();
    const mappedCourse = {
      startCol: timeToCol(course.time_from),
      endCol: timeToCol(course.time_to),
      ...course,
    };
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(mappedCourse);
    return acc;
  }, {} as Record<string, any[]>);
});

const timeToCol = (timeString: string) => {
  const [h, m] = timeString?.split(":").map(Number) || [];
  if (isNaN(h) || isNaN(m)) return 0;
  return ((h - 8) * 12 + Math.floor(m / 5)) + 12 + 1;
};

const savePhoto = (base64: string) => {
  const link = document.createElement("a");
  link.setAttribute("download", "kku-table.png");
  link.setAttribute("href", base64);
  link.click();
};

const download = async () => {
  const options: Partial<Options> = {
    windowWidth: 2560,
    scale: 3,
  };
  const printCanvas = await html2canvas(printcontent.value, options);
  savePhoto(printCanvas.toDataURL());
};

// const getSchedule = async () => {
//   loading.value = true;
//   courses.value = [
//     { day_w: "MON", time_from: "10:30", time_to: "12:00", subject_code: "SC403602", subject_name_th: "NUMERICAL METHODS FOR COMPUTER SCIENCE", room_name_th: "SC08", section_type_th: "Lecture", section_code: "1" },
//     { day_w: "WED", time_from: "10:30", time_to: "12:00", subject_code: "SC403602", subject_name_th: "NUMERICAL METHODS FOR COMPUTER SCIENCE", room_name_th: "SC8305", section_type_th: "Lecture", section_code: "1" },
//     { day_w: "FRI", time_from: "08:30", time_to: "10:30", subject_code: "CP353001", subject_name_th: "Operating Systems", room_name_th: "SC9226", section_type_th: "Lab", section_code: "1" },
//     { day_w: "FRI", time_from: "13:00", time_to: "15:00", subject_code: "CP353001", subject_name_th: "Operating Systems", room_name_th: "SC6201", section_type_th: "Lecture", section_code: "1" },
//     { day_w: "FRI", time_from: "16:00", time_to: "19:00", subject_code: "GE362785", subject_name_th: "CREATIVE THINKING", room_name_th: "-", section_type_th: "Lecture", section_code: "16" },
//     { day_w: "TUE", time_from: "15:00", time_to: "17:00", subject_code: "CP353002", subject_name_th: "Software Design", room_name_th: "SC9525", section_type_th: "Lecture", section_code: "1" },
//     { day_w: "WED", time_from: "13:00", time_to: "15:00", subject_code: "CP353002", subject_name_th: "Software Design", room_name_th: "SC9228", section_type_th: "Lab", section_code: "1" },
//     { day_w: "MON", time_from: "12:30", time_to: "14:30", subject_code: "CP353003", subject_name_th: "Artificial Intelligence", room_name_th: "SC9226 or SC9227", section_type_th: "Lecture", section_code: "1" },
//     { day_w: "MON", time_from: "14:30", time_to: "16:30", subject_code: "CP353003", subject_name_th: "Artificial Intelligence", room_name_th: "SC9226 or SC9227", section_type_th: "Lab", section_code: "1" },
//     { day_w: "THU", time_from: "13:00", time_to: "15:00", subject_code: "CP353761", subject_name_th: "Seminar", room_name_th: "SC9525", section_type_th: "Lecture", section_code: "1" },
//   ];
//   assignColorsToSubjects();
//   loading.value = false;
// };
const getSchedule = async () => {
  loading.value= true;
  try {
    const res = await fetch("/schedule.json");
    const data = await res.json();
    courses.value = data;
    assignColorsToSubjects();
  } catch (err) {
    console.error("Failed to load schedule: ", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getSchedule();
});
</script>

<template>
  <div>
    <div class="mx-auto container pt-7 pb-10">
      <div class="mx-2 flex flex-wrap justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2">Schedule</h1>
          <p class="text-sm text-gray-600">Period: {{ peroid_date }}</p>
        </div>
        <button
          class="border border-green-500 rounded px-3 py-1 text-green-500 hover:bg-gray-100 text-md"
          @click.prevent="download"
        >
          Save as PNG
        </button>
      </div>

      <div
        id="print-content"
        ref="printcontent"
        class="overflow-x-auto border mt-4 rounded-lg"
      >
        <!-- Header row -->
<div class="time-grid">
  <div
    v-for="(header, headerIndex) in headers"
    :key="`header-${headerIndex}`"
    class="border py-1 pl-1 col-span-12 font-bold bg-gray-200 z-10"
  >
    {{ header }}
  </div>
</div>

<!-- Data rows -->
<div
  v-for="(date, dateIndex) in orderedDate"
  :key="`date-${dateIndex}`"
  class="time-grid min-h-16 border"
>
  <div class="p-2 col-span-12 border-r-2 bg-gray-100 font-bold z-10">
    {{ date }}
  </div>

  <div
    v-for="(course, courseIndex) in mappedCourses[date]"
    :key="`course-${courseIndex}`"
    class="p-2 text-xs md:text-sm rounded flex flex-col justify-between overflow-hidden z-10"
    :class="`col-start-${course.startCol} col-end-${course.endCol}`"
    :style="{
      backgroundColor: subjectColorMap[course.subject_code]?.bg,
      borderColor: subjectColorMap[course.subject_code]?.border,
      borderWidth: '2px',
      margin: '2px',
      borderStyle: 'solid'
    }"
  >
    <div class="mb-1">
      <p class="truncate">[{{ course.time_from }} - {{ course.time_to }}]</p>
      <p class="truncate">{{ course.subject_code }}</p>
    </div>
    <p class="truncate">{{ course.subject_name_th }}</p>
    <p class="truncate text-gray-700 text-xs">
      {{ course.room_name_th }} | {{ course.section_type_th }} {{ course.section_code }}
    </p>
  </div>
</div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.table-w {
  min-width: 1000px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(156, minmax(0, 1fr));
  position: relative;
}

.time-grid::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(13, 1fr); /* 13 ชั่วโมง */
}

.time-grid::before > * {
  border-left: 1px solid rgba(0, 0, 0, 0.1); /* เส้นแบ่งทุก 1 ชม. */
}

</style>
