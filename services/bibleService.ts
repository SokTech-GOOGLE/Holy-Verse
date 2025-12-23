
import { BibleChapter } from '../types';

const API_BASE = 'https://bible-api.com';

export const fetchChapter = async (book: string, chapter: number, translation: string = 'kjv'): Promise<BibleChapter | null> => {
  try {
    const response = await fetch(`${API_BASE}/${book}+${chapter}?translation=${translation}`);
    if (!response.ok) throw new Error('Failed to fetch chapter');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return null;
  }
};

export const fetchVerse = async (reference: string, translation: string = 'kjv'): Promise<BibleChapter | null> => {
  try {
    const response = await fetch(`${API_BASE}/${reference}?translation=${translation}`);
    if (!response.ok) throw new Error('Failed to fetch verse');
    return await response.json();
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
};

export const searchVerses = async (query: string, translation: string = 'kjv'): Promise<BibleChapter | null> => {
  try {
    const response = await fetch(`${API_BASE}/${query}?translation=${translation}`);
    if (!response.ok) throw new Error('Failed to search');
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
};

export const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];
