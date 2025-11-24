<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Course } from '../../types/schedule';

const props = defineProps<{
  modelValue: boolean;
  initialData: Partial<Course>;
  isEdit: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', course: Course): void;
}>();

const form = ref<Partial<Course>>({});

watch(() => props.modelValue, (val) => {
  if (val) {
    // Clone data to avoid reference issues
    form.value = { ...props.initialData };
  }
});

const closeModal = () => emit('update:modelValue', false);

const handleSubmit = () => {
  if (!form.value.subject_code || !form.value.subject_name_th) {
    alert("Please fill in Subject Code and Name");
    return;
  }
  emit('save', form.value as Course);
};
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
      <div class="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
        <h3 class="font-bold text-lg">{{ isEdit ? 'Edit Course' : 'Add New Course' }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Subject Code</label>
            <input v-model="form.subject_code" type="text" class="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. CP123" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Subject Name</label>
            <input v-model="form.subject_name_th" type="text" class="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. Computer Programming" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Day</label>
            <select v-model="form.day_w" class="w-full border rounded px-3 py-2 text-sm">
              <option v-for="d in ['MON','TUE','WED','THU','FRI','SAT','SUN']" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Start</label>
            <input v-model="form.time_from" type="time" class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">End</label>
            <input v-model="form.time_to" type="time" class="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Room</label>
            <input v-model="form.room_name_th" type="text" class="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. SC123" />
          </div>
          <div class="grid grid-cols-2 gap-2">
             <div>
                <label class="block text-sm font-medium mb-1">Type</label>
                <select v-model="form.section_type_th" class="w-full border rounded px-2 py-2 text-sm">
                  <option value="Lecture">Lec</option>
                  <option value="Lab">Lab</option>
                </select>
             </div>
             <div>
                <label class="block text-sm font-medium mb-1">Sec</label>
                <input v-model="form.section_code" type="text" class="w-full border rounded px-3 py-2 text-sm" placeholder="1" />
             </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t">
        <button @click="closeModal" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
        <button @click="handleSubmit" class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded font-medium">
           {{ isEdit ? 'Update' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>