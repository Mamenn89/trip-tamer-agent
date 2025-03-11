
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://seybwjjfmwllhyqmkqgj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNleWJ3ampmbXdsbGh5cW1rcWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjgyNjQsImV4cCI6MjA1Njg0NDI2NH0.hYjeo8jrKz-6do8PwxhlOF0f1-MMpBOShCtNp94FXIE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
