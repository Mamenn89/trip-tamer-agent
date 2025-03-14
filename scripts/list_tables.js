import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    // Using RPC to get table definitions
    const { data, error } = await supabase.rpc('get_tables');

    if (error) {
      // If RPC fails, try querying a known system view
      const { data: schemaData, error: schemaError } = await supabase
        .from('_tables')
        .select('*');

      if (schemaError) {
        console.error('Error fetching tables:', schemaError);
        return;
      }

      console.log('Available tables in your Supabase database:');
      console.log(JSON.stringify(schemaData, null, 2));
      return;
    }

    console.log('Available tables in your Supabase database:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
    
    // As a fallback, let's try to query some known tables
    try {
      console.log('Attempting to list known tables...');
      
      // Try to access some common table names
      const tables = ['travel_plans', 'users', 'profiles'];
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1);
          
        if (!error) {
          console.log(`Table '${table}' exists`);
        }
      }
    } catch (fallbackErr) {
      console.error('Fallback attempt failed:', fallbackErr);
    }
  }
}

listTables(); 