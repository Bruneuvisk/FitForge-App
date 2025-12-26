import { useState, useEffect } from 'react';
import { Dumbbell, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Exercise = {
  id: string;
  day_of_week: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string | null;
  order_index: number;
};

type Workout = {
  id: string;
  name: string;
  description: string;
  goal: string;
  duration_weeks: number;
};

interface WorkoutViewProps {
  clientId: string;
}

const dayNames: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
};

export function WorkoutView({ clientId }: WorkoutViewProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<number[]>([]);

  useEffect(() => {
    loadWorkout();
  }, [clientId]);

  const loadWorkout = async () => {
    try {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .maybeSingle();

      if (workoutError) throw workoutError;
      setWorkout(workoutData);

      if (workoutData) {
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('workout_id', workoutData.id)
          .order('day_of_week')
          .order('order_index');

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData || []);

        const days = [...new Set(exercisesData?.map(e => e.day_of_week) || [])];
        setExpandedDays(days.slice(0, 1));
      }
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const exercisesByDay = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.day_of_week]) {
      acc[exercise.day_of_week] = [];
    }
    acc[exercise.day_of_week].push(exercise);
    return acc;
  }, {} as Record<number, Exercise[]>);

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

  if (!workout) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
        <Dumbbell className="mx-auto text-gray-500 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Nenhum treino disponível</h3>
        <p className="text-gray-400">Seu treinador ainda não criou um treino para você</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-600/30 rounded-lg">
            <Dumbbell className="text-emerald-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
        </div>
        <p className="text-gray-400">{workout.description}</p>
        <div className="flex gap-4 mt-4">
          <span className="text-sm text-emerald-400 bg-emerald-600/20 px-3 py-1 rounded-full">
            {workout.duration_weeks} semanas
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {Object.entries(exercisesByDay)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, dayExercises]) => (
            <div key={day} className="border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleDay(Number(day))}
                className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
              >
                <span className="font-semibold text-white">{dayNames[Number(day)]}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{dayExercises.length} exercícios</span>
                  {expandedDays.includes(Number(day)) ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>
              </button>

              {expandedDays.includes(Number(day)) && (
                <div className="p-4 space-y-3">
                  {dayExercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-600/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{exercise.exercise_name}</h4>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-gray-400">
                            <span className="text-emerald-400">{exercise.sets}</span> séries
                          </span>
                          <span className="text-gray-400">
                            <span className="text-emerald-400">{exercise.reps}</span> reps
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock size={14} />
                            {exercise.rest_seconds}s descanso
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">{exercise.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
