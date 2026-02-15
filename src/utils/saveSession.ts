import { supabase } from './supabase';
import { getDeviceId } from './deviceId';
import type { AnswerRecord } from '../types';

interface SaveSessionParams {
  csvFile: string;
  mode: string;
  correctCount: number;
  total: number;
  answers: AnswerRecord[];
}

export async function saveSessionToDb(params: SaveSessionParams): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const deviceId = getDeviceId();

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      device_id: deviceId,
      csv_file: params.csvFile,
      mode: params.mode,
      correct_count: params.correctCount,
      total_count: params.total,
    })
    .select('id')
    .single();

  if (sessionError) {
    throw sessionError;
  }

  const records = params.answers.map((a) => ({
    session_id: session.id,
    question_text: a.questionText,
    correct_answer: a.correctAnswer,
    is_correct: a.correct,
  }));

  const { error: recordsError } = await supabase
    .from('answer_records')
    .insert(records);

  if (recordsError) {
    throw recordsError;
  }
}
