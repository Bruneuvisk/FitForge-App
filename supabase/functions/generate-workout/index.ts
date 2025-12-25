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
    const { clientId, trainerId, clientData } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const workoutPlan = generateWorkoutPlan(clientData);

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        client_id: clientId,
        trainer_id: trainerId,
        name: workoutPlan.name,
        description: workoutPlan.description,
        goal: clientData.fitnessGoal,
        duration_weeks: 12,
        ai_generated: true,
        is_active: true,
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    const exercisesData = workoutPlan.exercises.map((exercise: any) => ({
      workout_id: workout.id,
      day_of_week: exercise.day,
      exercise_name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest_seconds: exercise.rest,
      notes: exercise.notes,
      order_index: exercise.order,
    }));

    const { error: exercisesError } = await supabase
      .from('exercises')
      .insert(exercisesData);

    if (exercisesError) throw exercisesError;

    return new Response(
      JSON.stringify({ success: true, workout }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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

function generateWorkoutPlan(clientData: any) {
  const { fitnessGoal, activityLevel } = clientData;

  const goals: any = {
    lose_weight: {
      name: 'Plano de Emagrecimento',
      description: 'Treino focado em queima de gordura com exercícios cardiovasculares e resistência',
      exercises: [
        { day: 1, name: 'Corrida na Esteira', sets: 1, reps: '30 min', rest: 60, notes: 'Manter ritmo moderado', order: 0 },
        { day: 1, name: 'Agachamento Livre', sets: 4, reps: '15-20', rest: 60, notes: 'Foco na técnica', order: 1 },
        { day: 1, name: 'Flexão de Braço', sets: 3, reps: '12-15', rest: 45, notes: null, order: 2 },
        { day: 1, name: 'Prancha Abdominal', sets: 3, reps: '45 seg', rest: 30, notes: null, order: 3 },
        { day: 3, name: 'Bicicleta Ergométrica', sets: 1, reps: '40 min', rest: 60, notes: 'Intensidade variável', order: 0 },
        { day: 3, name: 'Leg Press', sets: 4, reps: '15-20', rest: 60, notes: null, order: 1 },
        { day: 3, name: 'Remada Sentada', sets: 3, reps: '12-15', rest: 45, notes: null, order: 2 },
        { day: 3, name: 'Burpees', sets: 3, reps: '10-12', rest: 60, notes: 'Exercício completo', order: 3 },
        { day: 5, name: 'Elíptico', sets: 1, reps: '35 min', rest: 60, notes: null, order: 0 },
        { day: 5, name: 'Afundo Alternado', sets: 3, reps: '12-15 cada', rest: 60, notes: null, order: 1 },
        { day: 5, name: 'Supino Reto', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 5, name: 'Mountain Climbers', sets: 3, reps: '30 seg', rest: 45, notes: 'Alta intensidade', order: 3 },
      ],
    },
    gain_muscle: {
      name: 'Plano de Hipertrofia',
      description: 'Treino focado em ganho de massa muscular com cargas progressivas',
      exercises: [
        { day: 1, name: 'Supino Reto', sets: 4, reps: '8-12', rest: 90, notes: 'Carga progressiva', order: 0 },
        { day: 1, name: 'Supino Inclinado', sets: 3, reps: '10-12', rest: 75, notes: null, order: 1 },
        { day: 1, name: 'Crucifixo', sets: 3, reps: '12-15', rest: 60, notes: 'Alongar bem o músculo', order: 2 },
        { day: 1, name: 'Tríceps Pulley', sets: 3, reps: '12-15', rest: 60, notes: null, order: 3 },
        { day: 2, name: 'Agachamento Livre', sets: 4, reps: '8-12', rest: 120, notes: 'Exercício principal', order: 0 },
        { day: 2, name: 'Leg Press 45°', sets: 4, reps: '10-12', rest: 90, notes: null, order: 1 },
        { day: 2, name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 2, name: 'Mesa Flexora', sets: 3, reps: '12-15', rest: 60, notes: null, order: 3 },
        { day: 4, name: 'Barra Fixa', sets: 4, reps: '8-12', rest: 90, notes: 'Use auxílio se necessário', order: 0 },
        { day: 4, name: 'Remada Curvada', sets: 4, reps: '10-12', rest: 75, notes: null, order: 1 },
        { day: 4, name: 'Puxada Frontal', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 4, name: 'Rosca Direta', sets: 3, reps: '12-15', rest: 60, notes: null, order: 3 },
        { day: 5, name: 'Desenvolvimento Militar', sets: 4, reps: '8-12', rest: 90, notes: null, order: 0 },
        { day: 5, name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: 60, notes: null, order: 1 },
        { day: 5, name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 5, name: 'Encolhimento', sets: 3, reps: '15-20', rest: 60, notes: null, order: 3 },
      ],
    },
    maintain: {
      name: 'Plano de Manutenção',
      description: 'Treino balanceado para manter a forma física atual',
      exercises: [
        { day: 1, name: 'Supino Reto', sets: 3, reps: '10-12', rest: 75, notes: null, order: 0 },
        { day: 1, name: 'Desenvolvimento', sets: 3, reps: '10-12', rest: 75, notes: null, order: 1 },
        { day: 1, name: 'Tríceps Testa', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 1, name: 'Abdominal Crunch', sets: 3, reps: '15-20', rest: 45, notes: null, order: 3 },
        { day: 3, name: 'Agachamento', sets: 3, reps: '12-15', rest: 90, notes: null, order: 0 },
        { day: 3, name: 'Leg Press', sets: 3, reps: '12-15', rest: 75, notes: null, order: 1 },
        { day: 3, name: 'Stiff', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 3, name: 'Panturrilha', sets: 3, reps: '15-20', rest: 45, notes: null, order: 3 },
        { day: 5, name: 'Remada Curvada', sets: 3, reps: '10-12', rest: 75, notes: null, order: 0 },
        { day: 5, name: 'Puxada Frontal', sets: 3, reps: '10-12', rest: 75, notes: null, order: 1 },
        { day: 5, name: 'Rosca Direta', sets: 3, reps: '12-15', rest: 60, notes: null, order: 2 },
        { day: 5, name: 'Prancha', sets: 3, reps: '45 seg', rest: 45, notes: null, order: 3 },
      ],
    },
    improve_endurance: {
      name: 'Plano de Resistência',
      description: 'Treino focado em melhorar capacidade cardiovascular e resistência muscular',
      exercises: [
        { day: 1, name: 'Corrida Intervalada', sets: 1, reps: '35 min', rest: 60, notes: 'Alternar intensidade a cada 3 min', order: 0 },
        { day: 1, name: 'Agachamento com Salto', sets: 4, reps: '15-20', rest: 60, notes: null, order: 1 },
        { day: 1, name: 'Flexão de Braço', sets: 4, reps: '15-20', rest: 45, notes: null, order: 2 },
        { day: 1, name: 'Abdominal Bicicleta', sets: 3, reps: '20-25', rest: 30, notes: null, order: 3 },
        { day: 2, name: 'Natação', sets: 1, reps: '45 min', rest: 60, notes: 'Diversos estilos', order: 0 },
        { day: 3, name: 'Bicicleta (HIIT)', sets: 1, reps: '30 min', rest: 60, notes: 'Alta intensidade intervalada', order: 0 },
        { day: 3, name: 'Leg Press', sets: 4, reps: '20-25', rest: 60, notes: 'Carga moderada', order: 1 },
        { day: 3, name: 'Remada', sets: 4, reps: '20-25', rest: 60, notes: null, order: 2 },
        { day: 3, name: 'Burpees', sets: 4, reps: '15-20', rest: 60, notes: null, order: 3 },
        { day: 5, name: 'Circuito Funcional', sets: 4, reps: '12 min', rest: 120, notes: 'Múltiplos exercícios sem pausa', order: 0 },
        { day: 5, name: 'Box Jump', sets: 4, reps: '15-20', rest: 60, notes: 'Aterrissar suave', order: 1 },
        { day: 5, name: 'Kettlebell Swing', sets: 4, reps: '20-25', rest: 60, notes: null, order: 2 },
        { day: 5, name: 'Prancha Lateral', sets: 3, reps: '45 seg cada', rest: 45, notes: null, order: 3 },
      ],
    },
  };

  return goals[fitnessGoal] || goals.maintain;
}
