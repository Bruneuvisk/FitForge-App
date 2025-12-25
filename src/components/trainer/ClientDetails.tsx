import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Logo } from '../Logo';
import { GenerateWorkoutModal } from './GenerateWorkoutModal';
import { GenerateMealPlanModal } from './GenerateMealPlanModal';

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

  const handleWorkoutGenerated = () => {
    setShowGenerateWorkout(false);
    alert('Treino gerado com sucesso! O cliente já pode visualizar no painel dele.');
  };

  const handleMealPlanGenerated = () => {
    setShowGenerateMealPlan(false);
    alert('Plano alimentar gerado com sucesso! O cliente já pode visualizar no painel dele.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {client.profiles?.full_name || 'Cliente'}
              </h1>
              <p className="text-gray-600">{client.profiles?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-700 mb-1">Altura</p>
              <p className="text-2xl font-bold text-emerald-900">{client.height} cm</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-1">Peso Atual</p>
              <p className="text-2xl font-bold text-blue-900">{client.current_weight} kg</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-700 mb-1">Peso Meta</p>
              <p className="text-2xl font-bold text-purple-900">
                {client.goal_weight ? `${client.goal_weight} kg` : '-'}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-700 mb-1">IMC</p>
              <p className="text-2xl font-bold text-orange-900">
                {(client.current_weight / Math.pow(client.height / 100, 2)).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Objetivo</p>
              <p className="text-lg font-semibold text-gray-900">
                {goalLabels[client.fitness_goal] || client.fitness_goal}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Nível de Atividade</p>
              <p className="text-lg font-semibold text-gray-900">
                {activityLabels[client.activity_level] || client.activity_level}
              </p>
            </div>
          </div>

          {(client.medical_conditions || client.dietary_restrictions) && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-6">
              {client.medical_conditions && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Condições Médicas</p>
                  <p className="text-gray-600">{client.medical_conditions}</p>
                </div>
              )}
              {client.dietary_restrictions && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Restrições Alimentares</p>
                  <p className="text-gray-600">{client.dietary_restrictions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-3">Gerar Treino com IA</h2>
            <p className="text-emerald-50 mb-6">
              Crie um plano de treino personalizado baseado nos objetivos e características do cliente
            </p>
            <button
              onClick={() => setShowGenerateWorkout(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Sparkles size={20} />
              Gerar Treino
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-3">Gerar Dieta com IA</h2>
            <p className="text-orange-50 mb-6">
              Crie um plano alimentar personalizado com calorias e macronutrientes calculados
            </p>
            <button
              onClick={() => setShowGenerateMealPlan(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              <Sparkles size={20} />
              Gerar Dieta
            </button>
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
    </div>
  );
}
