import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Edit, Dumbbell, UtensilsCrossed } from 'lucide-react';
import { Logo } from '../Logo';
import { supabase } from '../../lib/supabase';
import { GenerateWorkoutModal } from './GenerateWorkoutModal';
import { GenerateMealPlanModal } from './GenerateMealPlanModal';
import { WorkoutEditor } from './WorkoutEditor';
import { MealPlanEditor } from './MealPlanEditor';

type Client = {
  id: string;
  user_id: string | null;
  trainer_id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
  activity_level: string;
  gender: string | null;
  medical_conditions: string | null;
  dietary_restrictions: string | null;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
};

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
}

const goalLabels: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
  maintain: 'Manutenção',
  improve_endurance: 'Melhorar Resistência',
};

const activityLabels: Record<string, string> = {
  sedentary: 'Sedentário',
  light: 'Leve',
  moderate: 'Moderado',
  active: 'Ativo',
  very_active: 'Muito Ativo',
};

export function ClientDetails({ client, onBack }: ClientDetailsProps) {
  const [showGenerateWorkout, setShowGenerateWorkout] = useState(false);
  const [showGenerateMealPlan, setShowGenerateMealPlan] = useState(false);
  const [showEditWorkout, setShowEditWorkout] = useState(false);
  const [showEditMealPlan, setShowEditMealPlan] = useState(false);
  const [hasWorkout, setHasWorkout] = useState(false);
  const [hasMealPlan, setHasMealPlan] = useState(false);

  useEffect(() => {
    checkExistingPlans();
  }, [client.id]);

  const checkExistingPlans = async () => {
    const { data: workout } = await supabase
      .from('workouts')
      .select('id')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .maybeSingle();

    const { data: mealPlan } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .maybeSingle();

    setHasWorkout(!!workout);
    setHasMealPlan(!!mealPlan);
  };

  const handleWorkoutGenerated = () => {
    setShowGenerateWorkout(false);
    setHasWorkout(true);
  };

  const handleMealPlanGenerated = () => {
    setShowGenerateMealPlan(false);
    setHasMealPlan(true);
  };

  const handleWorkoutSaved = () => {
    setShowEditWorkout(false);
  };

  const handleMealPlanSaved = () => {
    setShowEditMealPlan(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fadeIn">
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl p-6 mb-6 animate-slideUp">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {client.profiles?.full_name || 'Cliente'}
              </h1>
              <p className="text-gray-400">{client.profiles?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-4 hover:scale-105 transition-transform">
              <p className="text-sm text-emerald-300 mb-1">Altura</p>
              <p className="text-2xl font-bold text-white">{client.height} cm</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 hover:scale-105 transition-transform">
              <p className="text-sm text-blue-300 mb-1">Peso Atual</p>
              <p className="text-2xl font-bold text-white">{client.current_weight} kg</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4 hover:scale-105 transition-transform">
              <p className="text-sm text-purple-300 mb-1">Peso Meta</p>
              <p className="text-2xl font-bold text-white">
                {client.goal_weight ? `${client.goal_weight} kg` : '-'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4 hover:scale-105 transition-transform">
              <p className="text-sm text-orange-300 mb-1">IMC</p>
              <p className="text-2xl font-bold text-white">
                {(client.current_weight / Math.pow(client.height / 100, 2)).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Objetivo</p>
              <p className="text-lg font-semibold text-white">
                {goalLabels[client.fitness_goal] || client.fitness_goal}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Nível de Atividade</p>
              <p className="text-lg font-semibold text-white">
                {activityLabels[client.activity_level] || client.activity_level}
              </p>
            </div>
          </div>

          {(client.medical_conditions || client.dietary_restrictions) && (
            <div className="mt-6 pt-6 border-t border-gray-700 grid md:grid-cols-2 gap-6">
              {client.medical_conditions && (
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">Condições Médicas</p>
                  <p className="text-gray-400">{client.medical_conditions}</p>
                </div>
              )}
              {client.dietary_restrictions && (
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">Restrições Alimentares</p>
                  <p className="text-gray-400">{client.dietary_restrictions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-slideUp">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-2xl border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Dumbbell size={28} />
              <h2 className="text-2xl font-bold">Treino</h2>
            </div>
            <p className="text-emerald-50 mb-6">
              {hasWorkout
                ? 'Cliente ja possui um treino ativo. Voce pode editar ou gerar um novo.'
                : 'Crie um plano de treino personalizado baseado nos objetivos do cliente'}
            </p>
            <div className="flex gap-3">
              {hasWorkout && (
                <button
                  onClick={() => setShowEditWorkout(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
                >
                  <Edit size={18} />
                  Editar
                </button>
              )}
              <button
                onClick={() => setShowGenerateWorkout(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg"
              >
                <Sparkles size={18} />
                {hasWorkout ? 'Novo Treino' : 'Gerar com IA'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-8 text-white shadow-2xl border border-orange-500/30">
            <div className="flex items-center gap-3 mb-3">
              <UtensilsCrossed size={28} />
              <h2 className="text-2xl font-bold">Dieta</h2>
            </div>
            <p className="text-orange-50 mb-6">
              {hasMealPlan
                ? 'Cliente ja possui uma dieta ativa. Voce pode editar ou gerar uma nova.'
                : 'Crie um plano alimentar personalizado com calorias e macronutrientes'}
            </p>
            <div className="flex gap-3">
              {hasMealPlan && (
                <button
                  onClick={() => setShowEditMealPlan(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
                >
                  <Edit size={18} />
                  Editar
                </button>
              )}
              <button
                onClick={() => setShowGenerateMealPlan(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-lg"
              >
                <Sparkles size={18} />
                {hasMealPlan ? 'Nova Dieta' : 'Gerar com IA'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {showGenerateWorkout && (
        <GenerateWorkoutModal
          client={client}
          onClose={() => setShowGenerateWorkout(false)}
          onGenerated={handleWorkoutGenerated}
        />
      )}

      {showGenerateMealPlan && (
        <GenerateMealPlanModal
          client={client}
          onClose={() => setShowGenerateMealPlan(false)}
          onGenerated={handleMealPlanGenerated}
        />
      )}

      {showEditWorkout && (
        <WorkoutEditor
          clientId={client.id}
          onClose={() => setShowEditWorkout(false)}
          onSaved={handleWorkoutSaved}
        />
      )}

      {showEditMealPlan && (
        <MealPlanEditor
          clientId={client.id}
          onClose={() => setShowEditMealPlan(false)}
          onSaved={handleMealPlanSaved}
        />
      )}
    </div>
  );
}
