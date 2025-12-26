import { useState, useEffect } from 'react';
import { UtensilsCrossed, Flame, Beef, Wheat, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Meal = {
  id: string;
  meal_type: string;
  name: string;
  description: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  ingredients: string;
  instructions: string;
  order_index: number;
};

type MealPlan = {
  id: string;
  name: string;
  description: string;
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
};

interface MealPlanViewProps {
  clientId: string;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Cafe da Manha',
  snack: 'Lanche',
  lunch: 'Almoco',
  dinner: 'Jantar',
};

const mealTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  breakfast: { bg: 'bg-amber-600/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  snack: { bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  lunch: { bg: 'bg-emerald-600/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  dinner: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export function MealPlanView({ clientId }: MealPlanViewProps) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);

  useEffect(() => {
    loadMealPlan();
  }, [clientId]);

  const loadMealPlan = async () => {
    try {
      const { data: mealPlanData, error: mealPlanError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .maybeSingle();

      if (mealPlanError) throw mealPlanError;
      setMealPlan(mealPlanData);

      if (mealPlanData) {
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('meal_plan_id', mealPlanData.id)
          .order('order_index');

        if (mealsError) throw mealsError;
        setMeals(mealsData || []);

        if (mealsData && mealsData.length > 0) {
          setExpandedMeals([mealsData[0].id]);
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMeal = (mealId: string) => {
    setExpandedMeals(prev =>
      prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
        <UtensilsCrossed className="mx-auto text-gray-500 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Nenhuma dieta disponivel</h3>
        <p className="text-gray-400">Seu treinador ainda nao criou uma dieta para voce</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-600/30 rounded-lg">
            <UtensilsCrossed className="text-orange-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">{mealPlan.name}</h2>
        </div>
        <p className="text-gray-400 mb-4">{mealPlan.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <Flame className="mx-auto text-orange-400 mb-1" size={20} />
            <p className="text-2xl font-bold text-white">{mealPlan.daily_calories}</p>
            <p className="text-xs text-gray-400">Calorias</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <Beef className="mx-auto text-red-400 mb-1" size={20} />
            <p className="text-2xl font-bold text-white">{mealPlan.protein_grams}g</p>
            <p className="text-xs text-gray-400">Proteinas</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <Wheat className="mx-auto text-amber-400 mb-1" size={20} />
            <p className="text-2xl font-bold text-white">{mealPlan.carbs_grams}g</p>
            <p className="text-xs text-gray-400">Carboidratos</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center">
            <Droplets className="mx-auto text-blue-400 mb-1" size={20} />
            <p className="text-2xl font-bold text-white">{mealPlan.fats_grams}g</p>
            <p className="text-xs text-gray-400">Gorduras</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {meals.map((meal) => {
          const colors = mealTypeColors[meal.meal_type] || mealTypeColors.snack;
          const isExpanded = expandedMeals.includes(meal.id);

          return (
            <div key={meal.id} className={`border ${colors.border} rounded-xl overflow-hidden`}>
              <button
                onClick={() => toggleMeal(meal.id)}
                className={`w-full flex items-center justify-between p-4 ${colors.bg} hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${colors.text} ${colors.bg} px-2 py-1 rounded`}>
                    {mealTypeLabels[meal.meal_type] || meal.meal_type}
                  </span>
                  <span className="font-semibold text-white">{meal.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{meal.calories} kcal</span>
                  {isExpanded ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 bg-gray-700/20">
                  <p className="text-gray-400 text-sm">{meal.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-400">
                      <span className="text-red-400 font-semibold">{meal.protein_grams}g</span> proteina
                    </span>
                    <span className="text-gray-400">
                      <span className="text-amber-400 font-semibold">{meal.carbs_grams}g</span> carbs
                    </span>
                    <span className="text-gray-400">
                      <span className="text-blue-400 font-semibold">{meal.fats_grams}g</span> gordura
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Ingredientes</h4>
                    <div className="text-sm text-gray-400 whitespace-pre-line bg-gray-700/30 p-3 rounded-lg">
                      {meal.ingredients}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Modo de Preparo</h4>
                    <div className="text-sm text-gray-400 bg-gray-700/30 p-3 rounded-lg">
                      {meal.instructions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
