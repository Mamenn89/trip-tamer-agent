import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const userEmail = process.env.VITE_TEST_USER_EMAIL;
const userPassword = process.env.VITE_TEST_USER_PASSWORD;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryTravelPlansWithAuth() {
  try {
    // First try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session, attempting to sign in...');
      if (!userEmail || !userPassword) {
        console.error('Missing test user credentials in .env file');
        return;
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword
      });

      if (signInError) {
        console.error('Error signing in:', signInError);
        return;
      }
      console.log('Successfully signed in');
    } else {
      console.log('Using existing session');
    }

    // Now query the travel plans
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
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'travel_plans' });
      
    if (!policiesError && policies) {
      console.log('\nActive RLS Policies:', JSON.stringify(policies, null, 2));
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

queryTravelPlansWithAuth(); 