import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Client = {
  id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
  activity_level: string;
  gender: string | null;
  dietary_restrictions: string | null;
  profiles?: {
    full_name: string;
  } | null;
};

interface GenerateMealPlanModalProps {
  client: Client;
  onClose: () => void;
  onGenerated: () => void;
}

export function GenerateMealPlanModal({ client, onClose, onGenerated }: GenerateMealPlanModalProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-meal-plan`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: client.id,
            trainerId: profile!.id,
            clientData: {
              height: client.height,
              weight: client.current_weight,
              goalWeight: client.goal_weight,
              fitnessGoal: client.fitness_goal,
              activityLevel: client.activity_level,
              gender: client.gender,
              dietaryRestrictions: client.dietary_restrictions,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar plano alimentar');
      }

      const result = await response.json();
      console.log('Meal plan generated:', result);
      onGenerated();
    } catch (err: any) {
      console.error('Error generating meal plan:', err);
      setError(err.message || 'Erro ao gerar plano alimentar com IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Sparkles className="text-orange-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Gerar Dieta com IA</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Nossa IA vai criar um plano alimentar personalizado para{' '}
            <span className="font-semibold text-gray-900">
              {client.profiles?.full_name}
            </span>{' '}
            baseado em suas necessidades nutricionais e objetivos.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-900 mb-2">Informações do Cliente:</h3>
            <ul className="space-y-1 text-sm text-orange-800">
              <li>• Peso: {client.current_weight} kg</li>
              <li>• Altura: {client.height} cm</li>
              <li>• Objetivo: {client.fitness_goal}</li>
              <li>• Nível: {client.activity_level}</li>
              {client.dietary_restrictions && (
                <li>• Restrições: {client.dietary_restrictions}</li>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Dieta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
