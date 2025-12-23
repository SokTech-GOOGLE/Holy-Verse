
export interface BibleVerse {
  chapter: number;
  verse: number;
  text: string;
  book_id: string;
  book_name: string;
}

export interface BibleChapter {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
}

export interface Devotional {
  title: string;
  scripture: string;
  reflection: string;
  prayer: string;
  application: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Bookmark {
  id: string;
  reference: string;
  text: string;
  timestamp: number;
  notes?: string;
}

export enum AppRoute {
  HOME = 'home',
  READER = 'reader',
  COUNSELOR = 'counselor',
  EXPLAINER = 'explainer',
  DEVOTIONAL = 'devotional',
  PRAYER = 'prayer',
  QUIZ = 'quiz',
  BOOKMARKS = 'bookmarks',
  SEARCH = 'search',
  TOPICS = 'topics',
  CHRISTMAS = 'christmas'
}
