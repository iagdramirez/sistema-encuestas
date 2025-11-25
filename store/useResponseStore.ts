import { defineStore } from 'pinia'
import type { SurveyResponse, SurveyResponseAnswer, SubmitResponseData } from '~/interfaces'

export const useResponseStore = defineStore('response', () => {
  // Estado
  const responses = ref<SurveyResponse[]>([])
  const currentResponse = ref<SurveyResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Supabase client
  const supabase = useSupabase()

  // Acciones
  const submitResponse = async (surveyId: string, responseData: SubmitResponseData) => {
    loading.value = true
    error.value = null
    try {
      // Crear la respuesta
      const { data: response, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: surveyId,
        })
        .select()
        .single()

      if (responseError) throw responseError

      // Crear las respuestas a las preguntas
      const answersData = responseData.answers.map(answer => ({
        response_id: response.id,
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        option_id: answer.option_id,
      }))

      const { error: answersError } = await supabase.from('survey_response_answers').insert(answersData)

      if (answersError) throw answersError

      currentResponse.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al enviar respuesta'
      console.error('Error submitting response:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchResponses = async (surveyId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('survey_responses')
        .select(
          `
          *,
          survey_response_answers (
            *,
            survey_options (
              option_text
            )
          )
        `,
        )
        .eq('survey_id', surveyId)
        .order('submitted_at', { ascending: false })

      if (fetchError) throw fetchError
      responses.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar respuestas'
      console.error('Error fetching responses:', err)
    } finally {
      loading.value = false
    }
  }

  const getResponseCount = async (surveyId: string): Promise<number> => {
    try {
      const { count, error: countError } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_id', surveyId)

      if (countError) throw countError
      return count || 0
    } catch (err) {
      console.error('Error getting response count:', err)
      return 0
    }
  }

  const getResponseStats = async (surveyId: string) => {
    try {
      // First get all question IDs for this survey
      const { data: questions, error: questionsError } = await supabase.from('survey_questions').select('id').eq('survey_id', surveyId)

      if (questionsError) throw questionsError

      const questionIds = questions?.map(q => q.id) || []

      if (questionIds.length === 0) return {}

      // Obtener todas las respuestas con detalles
      const { data, error: fetchError } = await supabase
        .from('survey_response_answers')
        .select(
          `
          *,
          survey_questions (
            question_text,
            type
          ),
          survey_options (
            option_text
          )
        `,
        )
        .in('question_id', questionIds)

      if (fetchError) throw fetchError

      // Procesar estadísticas
      const stats: Record<string, any> = {}

      data?.forEach(answer => {
        const questionId = answer.question_id
        if (!stats[questionId]) {
          stats[questionId] = {
            question: answer.survey_questions?.question_text,
            type: answer.survey_questions?.type,
            answers: [],
          }
        }

        if (answer.survey_questions?.type === 'multiple' && answer.survey_options) {
          stats[questionId].answers.push(answer.survey_options.option_text)
        } else if (answer.answer_text) {
          stats[questionId].answers.push(answer.answer_text)
        }
      })

      return stats
    } catch (err) {
      console.error('Error getting response stats:', err)
      return {}
    }
  }

  return {
    // Estado
    responses: readonly(responses),
    currentResponse: readonly(currentResponse),
    loading: readonly(loading),
    error: readonly(error),

    // Acciones
    submitResponse,
    fetchResponses,
    getResponseCount,
    getResponseStats,
  }
})
