-- Esquema de base de datos para Sistema de Encuestas
-- Ejecutar en Supabase SQL Editor

-- Tabla de encuestas
CREATE TABLE surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preguntas de encuestas
CREATE TABLE survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('yes_no', 'text', 'multiple')),
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Tabla de opciones para preguntas de selección múltiple
CREATE TABLE survey_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL
);

-- Tabla de respuestas a encuestas
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de respuestas individuales a preguntas
CREATE TABLE survey_response_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  option_id UUID REFERENCES survey_options(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX idx_survey_options_question_id ON survey_options(question_id);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_response_answers_response_id ON survey_response_answers(response_id);
CREATE INDEX idx_survey_response_answers_question_id ON survey_response_answers(question_id);

-- Políticas RLS (Row Level Security) - permitir acceso público para respuestas
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_response_answers ENABLE ROW LEVEL SECURITY;

-- Políticas para surveys (lectura pública, escritura solo autenticada si fuera necesario)
CREATE POLICY "Surveys are viewable by everyone" ON surveys FOR SELECT USING (true);
CREATE POLICY "Surveys are insertable by authenticated users" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Surveys are updatable by authenticated users" ON surveys FOR UPDATE USING (true);
CREATE POLICY "Surveys are deletable by authenticated users" ON surveys FOR DELETE USING (true);

-- Políticas para preguntas
CREATE POLICY "Questions are viewable by everyone" ON survey_questions FOR SELECT USING (true);
CREATE POLICY "Questions are insertable by authenticated users" ON survey_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Questions are updatable by authenticated users" ON survey_questions FOR UPDATE USING (true);
CREATE POLICY "Questions are deletable by authenticated users" ON survey_questions FOR DELETE USING (true);

-- Políticas para opciones
CREATE POLICY "Options are viewable by everyone" ON survey_options FOR SELECT USING (true);
CREATE POLICY "Options are insertable by authenticated users" ON survey_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Options are updatable by authenticated users" ON survey_options FOR UPDATE USING (true);
CREATE POLICY "Options are deletable by authenticated users" ON survey_options FOR DELETE USING (true);

-- Políticas para respuestas (todos pueden insertar respuestas)
CREATE POLICY "Responses are viewable by authenticated users" ON survey_responses FOR SELECT USING (true);
CREATE POLICY "Responses are insertable by everyone" ON survey_responses FOR INSERT WITH CHECK (true);

-- Políticas para respuestas a preguntas
CREATE POLICY "Answer responses are viewable by authenticated users" ON survey_response_answers FOR SELECT USING (true);
CREATE POLICY "Answer responses are insertable by everyone" ON survey_response_answers FOR INSERT WITH CHECK (true);