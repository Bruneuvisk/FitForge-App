import { useState, useEffect } from 'react';
import { LogOut, TrendingUp, Plus, Target, Dumbbell, UtensilsCrossed, Activity, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { AddMeasurementModal } from './client/AddMeasurementModal';
import { ProgressCharts } from './client/ProgressCharts';
import { WorkoutView } from './client/WorkoutView';
import { MealPlanView } from './client/MealPlanView';

type ClientData = {
  id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
};

type Measurement = {
  id: string;
  weight: number;
  body_fat_percentage: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  measured_at: string;
};

type TabType = 'progress' | 'workout' | 'diet';

export function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('progress');

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (error) throw error;
      setClientData(client);

      if (client) {
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('measurements')
          .select('*')
          .eq('client_id', client.id)
          .order('measured_at', { ascending: false });

        if (measurementsError) throw measurementsError;
        setMeasurements(measurementsData || []);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementAdded = () => {
    loadClientData();
    setShowAddMeasurement(false);
  };

  const goalLabels: Record<string, string> = {
    lose_weight: 'Perder Peso',
    gain_muscle: 'Ganhar Massa',
    maintain: 'Manutenção',
    improve_endurance: 'Melhorar Resistência',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-12 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Perfil não encontrado
          </h2>
          <p className="text-gray-400 mb-6">
            Seu treinador precisa criar seu perfil
          </p>
          <button
            onClick={signOut}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-emerald-900/50"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const bmi = clientData.current_weight / Math.pow(clientData.height / 100, 2);
  const latestMeasurement = measurements[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Olá, <span className="font-semibold text-white">{profile?.full_name}</span>
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-600/30 rounded-lg">
                <TrendingUp className="text-emerald-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-emerald-300 mb-1">Peso Atual</p>
            <p className="text-3xl font-bold text-white">{clientData.current_weight} kg</p>
            {latestMeasurement && latestMeasurement.weight !== clientData.current_weight && (
              <p className="text-xs text-emerald-400 mt-2">
                Ultima medicao: {latestMeasurement.weight} kg
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600/30 rounded-lg">
                <Target className="text-blue-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-blue-300 mb-1">Peso Meta</p>
            <p className="text-3xl font-bold text-white">
              {clientData.goal_weight ? `${clientData.goal_weight} kg` : '-'}
            </p>
            {clientData.goal_weight && (
              <p className="text-xs text-blue-400 mt-2">
                Faltam {(clientData.current_weight - clientData.goal_weight).toFixed(1)} kg
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-600/30 rounded-lg">
                <Activity className="text-orange-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-orange-300 mb-1">IMC</p>
            <p className="text-3xl font-bold text-white">{bmi.toFixed(1)}</p>
            <p className="text-xs text-orange-400 mt-2">
              {bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidade'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-600/30 rounded-lg">
                <Dumbbell className="text-teal-400" size={24} />
              </div>
            </div>
            <p className="text-sm text-teal-300 mb-1">Objetivo</p>
            <p className="text-lg font-bold text-white">
              {goalLabels[clientData.fitness_goal] || clientData.fitness_goal}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'progress'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <BarChart3 size={18} />
            Progresso
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'workout'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Dumbbell size={18} />
            Meu Treino
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'diet'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <UtensilsCrossed size={18} />
            Minha Dieta
          </button>
        </div>

        {activeTab === 'progress' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Historico de Medicoes</h2>
                <p className="text-gray-400">Acompanhe sua evolucao</p>
              </div>
              <button
                onClick={() => setShowAddMeasurement(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-emerald-900/50"
              >
                <Plus size={20} />
                Adicionar Medicao
              </button>
            </div>
            <ProgressCharts measurements={measurements} goalWeight={clientData.goal_weight} />
          </div>
        )}

        {activeTab === 'workout' && <WorkoutView clientId={clientData.id} />}

        {activeTab === 'diet' && <MealPlanView clientId={clientData.id} />}
      </main>

      {showAddMeasurement && (
        <AddMeasurementModal
          clientId={clientData.id}
          onClose={() => setShowAddMeasurement(false)}
          onMeasurementAdded={handleMeasurementAdded}
        />
      )}
    </div>
  );
}
