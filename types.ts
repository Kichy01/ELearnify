export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  isAssessment: boolean;
  content?: string; // Content is optional for just-in-time loading
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  imageUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  modules?: Module[]; // Modules are optional as they are AI-generated
  moduleImagePool?: string[]; // Pool of reliable images for the AI to use
}


// For detailed progress tracking
export interface CourseProgressDetail {
    completedLessons: Set<string>;
    totalLessons: number;
}
export type CourseProgress = Record<string, CourseProgressDetail>;
