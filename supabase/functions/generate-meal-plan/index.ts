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

    const mealPlanData = generateMealPlan(clientData);

    const { data: mealPlan, error: mealPlanError } = await supabase
      .from('meal_plans')
      .insert({
        client_id: clientId,
        trainer_id: trainerId,
        name: mealPlanData.name,
        description: mealPlanData.description,
        daily_calories: mealPlanData.dailyCalories,
        protein_grams: mealPlanData.protein,
        carbs_grams: mealPlanData.carbs,
        fats_grams: mealPlanData.fats,
        ai_generated: true,
        is_active: true,
      })
      .select()
      .single();

    if (mealPlanError) throw mealPlanError;

    const mealsData = mealPlanData.meals.map((meal: any) => ({
      meal_plan_id: mealPlan.id,
      meal_type: meal.type,
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      protein_grams: meal.protein,
      carbs_grams: meal.carbs,
      fats_grams: meal.fats,
      ingredients: meal.ingredients,
      instructions: meal.instructions,
      order_index: meal.order,
    }));

    const { error: mealsError } = await supabase
      .from('meals')
      .insert(mealsData);

    if (mealsError) throw mealsError;

    return new Response(
      JSON.stringify({ success: true, mealPlan }),
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

function calculateCalories(clientData: any) {
  const { weight, height, gender, activityLevel, fitnessGoal } = clientData;
  
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * 30 + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * 30 - 161;
  }

  const activityMultipliers: any = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  if (fitnessGoal === 'lose_weight') {
    tdee -= 500;
  } else if (fitnessGoal === 'gain_muscle') {
    tdee += 300;
  }

  return Math.round(tdee);
}

function generateMealPlan(clientData: any) {
  const dailyCalories = calculateCalories(clientData);
  const protein = Math.round(clientData.weight * 2);
  const fats = Math.round(dailyCalories * 0.25 / 9);
  const carbs = Math.round((dailyCalories - (protein * 4) - (fats * 9)) / 4);

  const { fitnessGoal, dietaryRestrictions } = clientData;

  const planName = fitnessGoal === 'lose_weight' 
    ? 'Plano de Emagrecimento'
    : fitnessGoal === 'gain_muscle'
    ? 'Plano de Ganho de Massa'
    : 'Plano Balanceado';

  const meals = [
    {
      type: 'breakfast',
      name: 'Café da Manhã Completo',
      description: 'Refeição energizante para começar o dia',
      calories: Math.round(dailyCalories * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.3),
      fats: Math.round(fats * 0.25),
      ingredients: '- 2 ovos mexidos\n- 2 fatias de pão integral\n- 1 banana\n- 1 col. sopa de pasta de amendoim\n- 1 xícara de café com leite desnatado',
      instructions: 'Preparar os ovos mexidos com pouco óleo. Torrar o pão integral. Amassar a banana e misturar com pasta de amendoim para passar no pão.',
      order: 0,
    },
    {
      type: 'snack',
      name: 'Lanche da Manhã',
      description: 'Snack proteico e energético',
      calories: Math.round(dailyCalories * 0.1),
      protein: Math.round(protein * 0.15),
      carbs: Math.round(carbs * 0.1),
      fats: Math.round(fats * 0.1),
      ingredients: '- 1 iogurte grego natural\n- 30g de granola\n- Frutas vermelhas a gosto',
      instructions: 'Misturar todos os ingredientes em uma tigela.',
      order: 1,
    },
    {
      type: 'lunch',
      name: 'Almoço Balanceado',
      description: 'Refeição principal com todos os macronutrientes',
      calories: Math.round(dailyCalories * 0.35),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.35),
      fats: Math.round(fats * 0.3),
      ingredients: '- 150g de peito de frango grelhado\n- 4 col. sopa de arroz integral\n- 3 col. sopa de feijão\n- Salada verde à vontade\n- 1 col. sopa de azeite',
      instructions: 'Grelhar o frango temperado com ervas. Cozinhar arroz e feijão normalmente. Preparar salada fresca e temperar com azeite e limão.',
      order: 2,
    },
    {
      type: 'snack',
      name: 'Lanche da Tarde',
      description: 'Snack pré-treino ou entre refeições',
      calories: Math.round(dailyCalories * 0.1),
      protein: Math.round(protein * 0.1),
      carbs: Math.round(carbs * 0.15),
      fats: Math.round(fats * 0.1),
      ingredients: '- 1 maçã\n- 30g de amêndoas\n- 1 fatia de queijo branco',
      instructions: 'Consumir os alimentos como snack rápido.',
      order: 3,
    },
    {
      type: 'dinner',
      name: 'Jantar Leve',
      description: 'Refeição noturna nutritiva e de fácil digestão',
      calories: Math.round(dailyCalories * 0.2),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.1),
      fats: Math.round(fats * 0.25),
      ingredients: '- 120g de peixe (tilapia ou salmão)\n- Legumes assados (brócolis, cenoura, abobrinha)\n- Salada verde\n- 1 batata doce pequena',
      instructions: 'Assar o peixe com limão e ervas. Assar os legumes no forno com um fio de azeite. Servir com salada fresca.',
      order: 4,
    },
  ];

  return {
    name: planName,
    description: `Plano alimentar personalizado com ${dailyCalories} calorias diárias`,
    dailyCalories,
    protein,
    carbs,
    fats,
    meals,
  };
}
