import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryTravelPlans() {
  try {
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching travel plans:', error);
      return;
    }

    console.log('Travel Plans:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

queryTravelPlans(); 