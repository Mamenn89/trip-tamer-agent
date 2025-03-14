import { supabase } from '@/integrations/supabase/client';
import { TravelPlan } from '../types';

export const saveTravelPlan = async (userId: string, travelPlan: TravelPlan) => {
  try {
    console.log('Saving travel plan for user:', userId);
    console.log('Travel plan data to save:', JSON.stringify({
      destination: travelPlan.destination,
      origin: travelPlan.source,
      flights: travelPlan.flights,
      hotels: travelPlan.hotels,
      dayPlans: travelPlan.dayPlans
    }, null, 2));
    
    // Validate UUID format
    if (!userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      throw new Error('Invalid user ID format - must be a valid UUID');
    }

    // Prepare the data object
    const travelPlanData = {
      user_id: userId,
      destination: travelPlan.destination,
      origin: travelPlan.source,
      start_date: travelPlan.startDate ? new Date(travelPlan.startDate).toISOString() : null,
      end_date: travelPlan.endDate ? new Date(travelPlan.endDate).toISOString() : null,
      duration: travelPlan.duration,
      total_budget: travelPlan.totalBudget,
      summary: travelPlan.summary,
      hotels: travelPlan.hotels || [],
      flights: travelPlan.flights || [], // Store all flights
      day_plans: travelPlan.dayPlans || [],
      tips: travelPlan.tips || [],
      created_at: new Date().toISOString()
    };

    console.log('Formatted data for Supabase:', JSON.stringify(travelPlanData, null, 2));

    // First, try to update the schema if needed
    try {
      const { error: schemaError } = await supabase
        .rpc('update_travel_plans_schema', {
          old_column: 'flight',
          new_column: 'flights'
        });

      if (schemaError) {
        console.log('Schema update not needed or already completed');
      }
    } catch (schemaError) {
      console.log('Schema update not needed or already completed');
    }

    // Insert the travel plan
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([travelPlanData])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to save to database: ${error.message}`);
    }
    
    console.log('Successfully saved travel plan:', data);
    return data;
  } catch (error) {
    console.error('Error saving travel plan:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}; 