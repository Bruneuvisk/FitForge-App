import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      trainerId,
      email,
      password,
      fullName,
      height,
      currentWeight,
      goalWeight,
      fitnessGoal,
      activityLevel,
      gender,
      dateOfBirth,
      medicalConditions,
      dietaryRestrictions,
    } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Erro ao criar conta: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuario');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: 'client',
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Erro ao criar perfil: ${profileError.message}`);
    }

    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: authData.user.id,
        trainer_id: trainerId,
        height: height,
        current_weight: currentWeight,
        goal_weight: goalWeight || null,
        fitness_goal: fitnessGoal,
        activity_level: activityLevel,
        gender: gender,
        date_of_birth: dateOfBirth || null,
        medical_conditions: medicalConditions || null,
        dietary_restrictions: dietaryRestrictions || null,
      });

    if (clientError) {
      console.error('Client error:', clientError);
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Erro ao criar cliente: ${clientError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, userId: authData.user.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Add client error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro ao adicionar cliente' }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
