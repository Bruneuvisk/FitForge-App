import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Flame, Beef, Wheat, Droplets } from 'lucide-react';
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
  isNew?: boolean;
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

interface MealPlanEditorProps {
  clientId: string;
  onClose: () => void;
  onSaved: () => void;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Cafe da Manha',
  snack: 'Lanche',
  lunch: 'Almoco',
  dinner: 'Jantar',
};

export function MealPlanEditor({ clientId, onClose, onSaved }: MealPlanEditorProps) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [deletedMealIds, setDeletedMealIds] = useState<string[]>([]);

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
          setSelectedMeal(mealsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealPlanChange = (field: keyof MealPlan, value: string | number) => {
    if (mealPlan) {
      setMealPlan({ ...mealPlan, [field]: value });
    }
  };

  const handleMealChange = (mealId: string, field: keyof Meal, value: string | number) => {
    setMeals(prev =>
      prev.map(meal =>
        meal.id === mealId ? { ...meal, [field]: value } : meal
      )
    );
  };

  const addMeal = () => {
    const newMeal: Meal = {
      id: `new-${Date.now()}`,
      meal_type: 'snack',
      name: 'Nova Refeicao',
      description: '',
      calories: 0,
      protein_grams: 0,
      carbs_grams: 0,
      fats_grams: 0,
      ingredients: '',
      instructions: '',
      order_index: meals.length,
      isNew: true,
    };
    setMeals([...meals, newMeal]);
    setSelectedMeal(newMeal.id);
  };

  const removeMeal = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal && !meal.isNew) {
      setDeletedMealIds(prev => [...prev, mealId]);
    }
    setMeals(prev => prev.filter(m => m.id !== mealId));
    if (selectedMeal === mealId) {
      const remaining = meals.filter(m => m.id !== mealId);
      setSelectedMeal(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const recalculateTotals = () => {
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (Number(meal.calories) || 0),
        protein: acc.protein + (Number(meal.protein_grams) || 0),
        carbs: acc.carbs + (Number(meal.carbs_grams) || 0),
        fats: acc.fats + (Number(meal.fats_grams) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    if (mealPlan) {
      setMealPlan({
        ...mealPlan,
        daily_calories: totals.calories,
        protein_grams: totals.protein,
        carbs_grams: totals.carbs,
        fats_grams: totals.fats,
      });
    }
  };

  const handleSave = async () => {
    if (!mealPlan) return;

    setSaving(true);
    try {
      const { error: mealPlanError } = await supabase
        .from('meal_plans')
        .update({
          name: mealPlan.name,
          description: mealPlan.description,
          daily_calories: mealPlan.daily_calories,
          protein_grams: mealPlan.protein_grams,
          carbs_grams: mealPlan.carbs_grams,
          fats_grams: mealPlan.fats_grams,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mealPlan.id);

      if (mealPlanError) throw mealPlanError;

      if (deletedMealIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('meals')
          .delete()
          .in('id', deletedMealIds);

        if (deleteError) throw deleteError;
      }

      for (const meal of meals) {
        if (meal.isNew) {
          const { error: insertError } = await supabase
            .from('meals')
            .insert({
              meal_plan_id: mealPlan.id,
              meal_type: meal.meal_type,
              name: meal.name,
              description: meal.description,
              calories: meal.calories,
              protein_grams: meal.protein_grams,
              carbs_grams: meal.carbs_grams,
              fats_grams: meal.fats_grams,
              ingredients: meal.ingredients,
              instructions: meal.instructions,
              order_index: meal.order_index,
            });

          if (insertError) throw insertError;
        } else {
          const { error: updateError } = await supabase
            .from('meals')
            .update({
              meal_type: meal.meal_type,
              name: meal.name,
              description: meal.description,
              calories: meal.calories,
              protein_grams: meal.protein_grams,
              carbs_grams: meal.carbs_grams,
              fats_grams: meal.fats_grams,
              ingredients: meal.ingredients,
              instructions: meal.instructions,
              order_index: meal.order_index,
            })
            .eq('id', meal.id);

          if (updateError) throw updateError;
        }
      }

      onSaved();
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Erro ao salvar dieta');
    } finally {
      setSaving(false);
    }
  };

  const selectedMealData = meals.find(m => m.id === selectedMeal);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md text-center">
          <p className="text-white mb-4">Nenhuma dieta encontrada para este cliente</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar Dieta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Dieta</label>
              <input
                type="text"
                value={mealPlan.name}
                onChange={(e) => handleMealPlanChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descricao</label>
              <input
                type="text"
                value={mealPlan.description}
                onChange={(e) => handleMealPlanChange('description', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3 text-center">
              <Flame className="mx-auto text-orange-400 mb-1" size={20} />
              <p className="text-xl font-bold text-white">{mealPlan.daily_calories}</p>
              <p className="text-xs text-gray-400">Calorias</p>
            </div>
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
              <Beef className="mx-auto text-red-400 mb-1" size={20} />
              <p className="text-xl font-bold text-white">{mealPlan.protein_grams}g</p>
              <p className="text-xs text-gray-400">Proteinas</p>
            </div>
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-3 text-center">
              <Wheat className="mx-auto text-amber-400 mb-1" size={20} />
              <p className="text-xl font-bold text-white">{mealPlan.carbs_grams}g</p>
              <p className="text-xs text-gray-400">Carboidratos</p>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
              <Droplets className="mx-auto text-blue-400 mb-1" size={20} />
              <p className="text-xl font-bold text-white">{mealPlan.fats_grams}g</p>
              <p className="text-xs text-gray-400">Gorduras</p>
            </div>
          </div>

          <button
            onClick={recalculateTotals}
            className="text-sm text-orange-400 hover:text-orange-300"
          >
            Recalcular totais automaticamente
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Refeicoes</h3>
                <button
                  onClick={addMeal}
                  className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300"
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMeal === meal.id
                        ? 'bg-orange-600/20 border border-orange-500/30'
                        : 'bg-gray-700/50 border border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{meal.name}</p>
                      <p className="text-xs text-gray-400">{mealTypeLabels[meal.meal_type]}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMeal(meal.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              {selectedMealData ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nome</label>
                      <input
                        type="text"
                        value={selectedMealData.name}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                      <select
                        value={selectedMealData.meal_type}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'meal_type', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="breakfast">Cafe da Manha</option>
                        <option value="snack">Lanche</option>
                        <option value="lunch">Almoco</option>
                        <option value="dinner">Jantar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Descricao</label>
                    <input
                      type="text"
                      value={selectedMealData.description}
                      onChange={(e) => handleMealChange(selectedMealData.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Calorias</label>
                      <input
                        type="number"
                        value={selectedMealData.calories}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'calories', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Proteina (g)</label>
                      <input
                        type="number"
                        value={selectedMealData.protein_grams}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'protein_grams', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Carbs (g)</label>
                      <input
                        type="number"
                        value={selectedMealData.carbs_grams}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'carbs_grams', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Gordura (g)</label>
                      <input
                        type="number"
                        value={selectedMealData.fats_grams}
                        onChange={(e) => handleMealChange(selectedMealData.id, 'fats_grams', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Ingredientes</label>
                    <textarea
                      value={selectedMealData.ingredients}
                      onChange={(e) => handleMealChange(selectedMealData.id, 'ingredients', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      placeholder="Lista de ingredientes..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Modo de Preparo</label>
                    <textarea
                      value={selectedMealData.instructions}
                      onChange={(e) => handleMealChange(selectedMealData.id, 'instructions', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-orange-500"
                      placeholder="Instrucoes de preparo..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecione uma refeicao para editar
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Alteracoes'}
          </button>
        </div>
      </div>
    </div>
  );
}
