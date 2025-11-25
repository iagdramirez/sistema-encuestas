import { defineStore } from 'pinia'
import type { SurveyQuestion, SurveyOption, CreateQuestionData } from '~/interfaces'

export const useQuestionStore = defineStore('question', () => {
  // Estado
  const questions = ref<SurveyQuestion[]>([])
  const options = ref<SurveyOption[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Supabase client
  const supabase = useSupabase()

  // Acciones
  const fetchQuestions = async (surveyId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_index', { ascending: true })

      if (fetchError) throw fetchError
      questions.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar preguntas'
      console.error('Error fetching questions:', err)
    } finally {
      loading.value = false
    }
  }

  const createQuestion = async (surveyId: string, questionData: CreateQuestionData) => {
    loading.value = true
    error.value = null
    try {
      // Obtener el último order_index
      const { data: lastQuestion } = await supabase
        .from('survey_questions')
        .select('order_index')
        .eq('survey_id', surveyId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      const orderIndex = lastQuestion ? lastQuestion.order_index + 1 : 0

      const { data, error: insertError } = await supabase
        .from('survey_questions')
        .insert({
          survey_id: surveyId,
          question_text: questionData.question_text,
          type: questionData.type,
          order_index: orderIndex
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Si es selección múltiple, crear opciones
      if (questionData.type === 'multiple' && questionData.options) {
        const optionsData = questionData.options.map(optionText => ({
          question_id: data.id,
          option_text: optionText
        }))

        const { error: optionsError } = await supabase
          .from('survey_options')
          .insert(optionsData)

        if (optionsError) throw optionsError
      }

      questions.value.push(data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear pregunta'
      console.error('Error creating question:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuestion = async (id: string, questionData: Partial<CreateQuestionData>) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('survey_questions')
        .update(questionData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = questions.value.findIndex(q => q.id === id)
      if (index !== -1) {
        questions.value[index] = data
      }

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar pregunta'
      console.error('Error updating question:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteQuestion = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('survey_questions')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      questions.value = questions.value.filter(q => q.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar pregunta'
      console.error('Error deleting question:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOptions = async (questionId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('survey_options')
        .select('*')
        .eq('question_id', questionId)

      if (fetchError) throw fetchError
      return data || []
    } catch (err) {
      console.error('Error fetching options:', err)
      throw err
    }
  }

  const reorderQuestions = async (surveyId: string, questionIds: string[]) => {
    loading.value = true
    error.value = null
    try {
      const updates = questionIds.map((id, index) => ({
        id,
        order_index: index
      }))

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('survey_questions')
          .update({ order_index: update.order_index })
          .eq('id', update.id)

        if (updateError) throw updateError
      }

      // Reordenar localmente
      questions.value.sort((a, b) => a.order_index - b.order_index)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al reordenar preguntas'
      console.error('Error reordering questions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    questions: readonly(questions),
    options: readonly(options),
    loading: readonly(loading),
    error: readonly(error),

    // Acciones
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    fetchOptions,
    reorderQuestions
  }
})