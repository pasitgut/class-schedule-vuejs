
export interface Course {
    id: string;
    subject_code: string;
    subject_name_th: string;
    day_w: string;
    time_from: string;
    time_to: string;
    room_name_th: string;
    section_type_th: "Lecture" | "Lab" | string;
    section_code: string;
}

export interface VisualCourse extends Course {
    startCol: number;
    endCol: number;
    stackIndex: number;
    color?: { bg: string, border: string };
}

export interface ScheduleConfig {
    startHour: number;
    endHour: number;
}