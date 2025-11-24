<script setup lang="ts">
import { ref, onMounted } from "vue";
import html2canvas from "html2canvas";

// Logic & Types
import type { Course, VisualCourse } from "../types/schedule";
import { useScheduleGrid } from "../composables/useScheduleGrid";

// Components
import ScheduleTable from "../components/schedule/ScheduleTable.vue";
import CourseFormModal from "../components/schedule/CourseFormModal.vue";
import CourseDetailModal from "../components/schedule/CourseDetailModal.vue";

// --- State ---
const printRef = ref<HTMLElement | null>(null);
const courses = ref<Course[]>([]);
const periodDate = ref("Semester 1/2025");

// --- Composables ---
const { config, headers, gridStyle, visibleDays, mappedCourses, getMaxRows } = useScheduleGrid(courses);

// --- Modal State ---
const showForm = ref(false);
const showDetail = ref(false);
const selectedCourse = ref<VisualCourse | null>(null);
const editingId = ref<string | null>(null);
const formData = ref<Partial<Course>>({});

// --- Actions: Data ---
const loadSchedule = async () => {
  try {
    const res = await fetch("/schedule.json");
    if(!res.ok) throw new Error("No schedule file");
    const data = await res.json();
    courses.value = data.map((c: any) => ({ ...c, id: c.id || crypto.randomUUID() }));
  } catch (e) {
    console.warn("Using empty schedule (or failed to load):", e);
    courses.value = [];
  }
};

const handleSaveCourse = (courseData: Course) => {
  if (editingId.value) {
    const idx = courses.value.findIndex(c => c.id === editingId.value);
    if (idx !== -1) {
      courses.value[idx] = { ...courseData, id: editingId.value };
      // Trigger reactivity explicit (optional for array replace)
      courses.value = [...courses.value];
    }
  } else {
    courses.value.push({ ...courseData, id: crypto.randomUUID() });
  }
  showForm.value = false;
};

const handleDeleteCourse = (id: string) => {
  if(confirm("Are you sure you want to delete this course?")) {
    courses.value = courses.value.filter(c => c.id !== id);
    showDetail.value = false;
  }
};

// --- Actions: UI ---
const openAddModal = () => {
  editingId.value = null;
  // Default Values
  formData.value = { 
    day_w: "MON", 
    time_from: "08:00", 
    time_to: "10:00", 
    section_type_th: "Lecture", 
    section_code: "1" 
  };
  showForm.value = true;
};

const openDetailModal = (course: VisualCourse) => {
  selectedCourse.value = course;
  showDetail.value = true;
};

const handleEditFromDetail = (course: VisualCourse) => {
  editingId.value = course.id;
  // Copy data to form
  formData.value = { ...course }; 
  showDetail.value = false;
  showForm.value = true;
};

const handleDownload = async () => {
  if (!printRef.value) return;
  const canvas = await html2canvas(printRef.value, { windowWidth: 2560, scale: 3 });
  const link = document.createElement("a");
  link.download = "my-schedule.png";
  link.href = canvas.toDataURL();
  link.click();
};

onMounted(loadSchedule);
</script>

<template>
  <div class="min-h-screen bg-gray-50/30">
    <div class="mx-auto container pt-7 pb-10 px-4">
      
      <div class="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700">Start Time</label>
          <input type="number" v-model="config.startHour" min="6" max="12" class="mt-1 block w-20 border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">End Time</label>
          <input type="number" v-model="config.endHour" min="12" max="22" class="mt-1 block w-20 border rounded px-2 py-1" />
        </div>
        <div class="ml-auto flex gap-2">
          <button 
            class="border border-blue-500 rounded px-3 py-1 text-blue-500 hover:bg-blue-50 text-md font-medium transition"
            @click="openAddModal"
          >
            + Add Course
          </button>
          <button 
            class="border border-green-500 rounded px-3 py-1 text-green-500 hover:bg-green-50 text-md font-medium transition"
            @click="handleDownload"
          >
            Save as PNG
          </button>
        </div>
      </div>

      <div class="mx-2 mb-2">
        <h1 class="text-4xl font-bold mb-2">Schedule</h1>
        <p class="text-sm text-gray-600">Period: {{ periodDate }}</p>
      </div>

      <div ref="printRef">
        <ScheduleTable 
          :headers="headers"
          :visible-days="visibleDays"
          :mapped-courses="mappedCourses"
          :grid-style="gridStyle"
          :config="config"
          :get-max-rows="getMaxRows"
          @click-course="openDetailModal"
        />
      </div>

      <CourseFormModal 
        v-model="showForm" 
        :initial-data="formData" 
        :is-edit="!!editingId"
        @save="handleSaveCourse" 
      />
      
      <CourseDetailModal 
        v-if="selectedCourse"
        v-model="showDetail" 
        :course="selectedCourse" 
        @edit="handleEditFromDetail"
        @delete="handleDeleteCourse" 
      />
    </div>
  </div>
</template>