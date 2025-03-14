import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function queryTravelPlansAsAdmin() {
  try {
    console.log('Querying travel plans with service role...');
    
    // Query the travel plans
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching travel plans:', error);
      return;
    }

    console.log('Travel Plans:', JSON.stringify(data, null, 2));
    
    // Also show the RLS policies for this table
    console.log('\nChecking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('auth.policies')
      .select('*')
      .eq('table', 'travel_plans');
      
    if (policiesError) {
      console.log('Unable to fetch RLS policies:', policiesError);
    } else {
      console.log('RLS Policies:', JSON.stringify(policies, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

queryTravelPlansAsAdmin(); 