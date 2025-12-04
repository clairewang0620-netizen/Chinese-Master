export enum ContentType {
  VOCABULARY = 'VOCABULARY',
  DIALOGUE = 'DIALOGUE',
  QUIZ = 'QUIZ'
}

export interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  exampleSentence?: string;
  exampleMeaning?: string;
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  hanzi: string;
  pinyin: string;
  meaning: string;
  avatar: string;
}

export interface Dialogue {
  id: string;
  title: string;
  lines: DialogueLine[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: ContentType;
  isLocked: boolean; // For "premium" feel
  content: Word[] | Dialogue | QuizQuestion[];
}

export interface Mistake {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}
