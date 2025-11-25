export interface Survey {
  id: string
  title: string
  description: string
  slug: string
  created_at: string
}

export interface SurveyQuestion {
  id: string
  survey_id: string
  question_text: string
  type: 'yes_no' | 'text' | 'multiple'
  order_index: number
}

export interface SurveyOption {
  id: string
  question_id: string
  option_text: string
}

export interface SurveyResponse {
  id: string
  survey_id: string
  submitted_at: string
}

export interface SurveyResponseAnswer {
  id: string
  response_id: string
  question_id: string
  answer_text?: string
  option_id?: string
}

// Tipos para formularios
export interface CreateSurveyData {
  title: string
  description: string
}

export interface CreateQuestionData {
  question_text: string
  type: 'yes_no' | 'text' | 'multiple'
  options?: string[]
}

export interface SubmitResponseData {
  answers: {
    question_id: string
    answer_text?: string
    option_id?: string
  }[]
}