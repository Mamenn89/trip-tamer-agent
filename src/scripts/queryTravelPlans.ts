import { supabase } from '../integrations/supabase/client';

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