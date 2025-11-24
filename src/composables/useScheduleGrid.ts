import { ref, computed, type Ref } from 'vue';
import type { Course, VisualCourse, ScheduleConfig } from '../types/schedule';
import { getSubjectColor } from '../constants/colors';

export function useScheduleGrid(courses: Ref<Course[]>) {
  const config = ref<ScheduleConfig>({ startHour: 8, endHour: 18 });

  // แปลงเวลา "08:30" -> Column Index
  const timeToCol = (timeString: string) => {
    const [h, m] = timeString?.split(":").map(Number) || [0, 0];
    if (isNaN(h) || isNaN(m)) return 0;
    // (ชั่วโมง - เริ่มต้น) * 12 ช่อง (ช่องละ 5 นาที) + 13 (offset label ด้านซ้าย)
    const slotsFromStart = ((h - config.value.startHour) * 12) + Math.floor(m / 5);
    return slotsFromStart + 13; 
  };

  // อัลกอริทึมจัดการวิชาที่เวลาชนกัน (Lane Packing)
  const assignVisualRows = (dayCourses: VisualCourse[]) => {
    if (!dayCourses.length) return [];
    // เรียงตามเวลาเริ่มก่อน
    const sorted = [...dayCourses].sort((a, b) => a.startCol - b.startCol || (b.endCol - a.endCol));
    const lanes: number[] = []; 

    return sorted.map(course => {
      let placed = false;
      let laneIndex = 0;
      
      // หาช่องว่างในแต่ละ lane
      for (let i = 0; i < lanes.length; i++) {
        if (lanes[i] <= course.startCol) {
          lanes[i] = course.endCol;
          laneIndex = i;
          placed = true;
          break;
        }
      }
      // ถ้าไม่ว่างเลย ให้สร้าง lane ใหม่
      if (!placed) {
        lanes.push(course.endCol);
        laneIndex = lanes.length - 1;
      }
      return { ...course, stackIndex: laneIndex };
    });
  };

  // คำนวณข้อมูลสำหรับการแสดงผล
  const mappedCourses = computed(() => {
    const grouped: Record<string, VisualCourse[]> = {};
    
    // 1. แปลง Course เป็น VisualCourse (เพิ่มพิกัด Grid)
    courses.value.forEach(course => {
      const dayKey = course.day_w.trim().toUpperCase();
      const startC = timeToCol(course.time_from);
      const endC = timeToCol(course.time_to);

      if (startC > 0) {
        if (!grouped[dayKey]) grouped[dayKey] = [];
        grouped[dayKey].push({
          ...course,
          startCol: startC,
          endCol: endC,
          stackIndex: 0,
          color: getSubjectColor(course.subject_code)
        });
      }
    });

    // 2. คำนวณ Stack Index (ชั้นที่ซ้อนทับ)
    Object.keys(grouped).forEach(day => {
      grouped[day] = assignVisualRows(grouped[day]);
    });

    return grouped;
  });

  const headers = computed(() => {
    const list = ["Day/Time"];
    for (let i = config.value.startHour; i <= config.value.endHour; i++) {
      list.push(`${i}:00`);
    }
    return list;
  });

  const gridStyle = computed(() => {
    const hours = config.value.endHour - config.value.startHour + 1;
    const totalCols = (hours * 12) + 12; 
    return { gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))` };
  });

  const visibleDays = computed(() => {
    const baseDays = ["MON", "TUE", "WED", "THU", "FRI"];
    const hasSat = courses.value.some(c => c.day_w.toUpperCase().trim() === 'SAT');
    const hasSun = courses.value.some(c => c.day_w.toUpperCase().trim() === 'SUN');
    if (hasSat) baseDays.push("SAT");
    if (hasSun) baseDays.push("SUN");
    return baseDays;
  });

  const getMaxRows = (dayKey: string) => {
    const dayCourses = mappedCourses.value[dayKey] || [];
    if (!dayCourses.length) return 1;
    return Math.max(...dayCourses.map(c => c.stackIndex)) + 1;
  };

  return {
    config,
    headers,
    gridStyle,
    visibleDays,
    mappedCourses,
    getMaxRows
  };
}