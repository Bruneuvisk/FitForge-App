import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Clock, GripVertical } from 'lucide-react';
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
  isNew?: boolean;
};

type Workout = {
  id: string;
  name: string;
  description: string;
  goal: string;
  duration_weeks: number;
};

interface WorkoutEditorProps {
  clientId: string;
  onClose: () => void;
  onSaved: () => void;
}

const dayNames: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terca-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sabado',
};

export function WorkoutEditor({ clientId, onClose, onSaved }: WorkoutEditorProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [deletedExerciseIds, setDeletedExerciseIds] = useState<string[]>([]);

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
        if (days.length > 0) {
          setSelectedDay(days[0]);
        }
      }
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutChange = (field: keyof Workout, value: string | number) => {
    if (workout) {
      setWorkout({ ...workout, [field]: value });
    }
  };

  const handleExerciseChange = (exerciseId: string, field: keyof Exercise, value: string | number) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    );
  };

  const addExercise = () => {
    const dayExercises = exercises.filter(ex => ex.day_of_week === selectedDay);
    const newExercise: Exercise = {
      id: `new-${Date.now()}`,
      day_of_week: selectedDay,
      exercise_name: '',
      sets: 3,
      reps: '10-12',
      rest_seconds: 60,
      notes: null,
      order_index: dayExercises.length,
      isNew: true,
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise && !exercise.isNew) {
      setDeletedExerciseIds(prev => [...prev, exerciseId]);
    }
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const addDay = () => {
    const existingDays = [...new Set(exercises.map(ex => ex.day_of_week))];
    const availableDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !existingDays.includes(d));
    if (availableDays.length > 0) {
      const newDay = availableDays[0];
      const newExercise: Exercise = {
        id: `new-${Date.now()}`,
        day_of_week: newDay,
        exercise_name: '',
        sets: 3,
        reps: '10-12',
        rest_seconds: 60,
        notes: null,
        order_index: 0,
        isNew: true,
      };
      setExercises([...exercises, newExercise]);
      setSelectedDay(newDay);
    }
  };

  const handleSave = async () => {
    if (!workout) return;

    setSaving(true);
    try {
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({
          name: workout.name,
          description: workout.description,
          duration_weeks: workout.duration_weeks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workout.id);

      if (workoutError) throw workoutError;

      if (deletedExerciseIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('exercises')
          .delete()
          .in('id', deletedExerciseIds);

        if (deleteError) throw deleteError;
      }

      for (const exercise of exercises) {
        if (exercise.isNew) {
          const { error: insertError } = await supabase
            .from('exercises')
            .insert({
              workout_id: workout.id,
              day_of_week: exercise.day_of_week,
              exercise_name: exercise.exercise_name,
              sets: exercise.sets,
              reps: exercise.reps,
              rest_seconds: exercise.rest_seconds,
              notes: exercise.notes,
              order_index: exercise.order_index,
            });

          if (insertError) throw insertError;
        } else {
          const { error: updateError } = await supabase
            .from('exercises')
            .update({
              exercise_name: exercise.exercise_name,
              sets: exercise.sets,
              reps: exercise.reps,
              rest_seconds: exercise.rest_seconds,
              notes: exercise.notes,
              order_index: exercise.order_index,
            })
            .eq('id', exercise.id);

          if (updateError) throw updateError;
        }
      }

      onSaved();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Erro ao salvar treino');
    } finally {
      setSaving(false);
    }
  };

  const existingDays = [...new Set(exercises.map(ex => ex.day_of_week))].sort((a, b) => a - b);
  const dayExercises = exercises
    .filter(ex => ex.day_of_week === selectedDay)
    .sort((a, b) => a.order_index - b.order_index);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md text-center">
          <p className="text-white mb-4">Nenhum treino encontrado para este cliente</p>
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
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar Treino</h2>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Treino</label>
              <input
                type="text"
                value={workout.name}
                onChange={(e) => handleWorkoutChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duracao (semanas)</label>
              <input
                type="number"
                value={workout.duration_weeks}
                onChange={(e) => handleWorkoutChange('duration_weeks', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descricao</label>
            <textarea
              value={workout.description}
              onChange={(e) => handleWorkoutChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-300">Dias de Treino</label>
              <button
                onClick={addDay}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300"
              >
                <Plus size={16} />
                Adicionar Dia
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {existingDays.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {dayNames[day]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{dayNames[selectedDay]}</h3>
              <button
                onClick={addExercise}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
              >
                <Plus size={16} />
                Adicionar Exercicio
              </button>
            </div>

            {dayExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-2 text-gray-500 cursor-move">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1 grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Exercicio</label>
                      <input
                        type="text"
                        value={exercise.exercise_name}
                        onChange={(e) => handleExerciseChange(exercise.id, 'exercise_name', e.target.value)}
                        placeholder="Nome do exercicio"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Series</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(exercise.id, 'sets', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Reps</label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                        placeholder="10-12"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Descanso (s)</label>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <input
                          type="number"
                          value={exercise.rest_seconds}
                          onChange={(e) => handleExerciseChange(exercise.id, 'rest_seconds', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-gray-400 mb-1">Notas (opcional)</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) => handleExerciseChange(exercise.id, 'notes', e.target.value || null)}
                        placeholder="Dicas ou observacoes"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(exercise.id)}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {dayExercises.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum exercicio neste dia. Clique em "Adicionar Exercicio" para comecar.
              </div>
            )}
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
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Alteracoes'}
          </button>
        </div>
      </div>
    </div>
  );
}
