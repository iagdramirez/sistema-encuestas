import { defineStore } from 'pinia'
import type { Survey, CreateSurveyData } from '~/interfaces'

export const useSurveyStore = defineStore('survey', () => {
  // Estado
  const surveys = ref<Survey[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Supabase client
  const supabase = useSupabase()

  // Acciones
  const fetchSurveys = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      surveys.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar encuestas'
      console.error('Error fetching surveys:', err)
    } finally {
      loading.value = false
    }
  }

  const createSurvey = async (surveyData: CreateSurveyData) => {
    loading.value = true
    error.value = null
    try {
      const slug = await generateUniqueSlug(surveyData.title)

      const { data, error: insertError } = await supabase
        .from('surveys')
        .insert({
          title: surveyData.title,
          description: surveyData.description,
          slug
        })
        .select()
        .single()

      if (insertError) throw insertError

      surveys.value.unshift(data)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear encuesta'
      console.error('Error creating survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSurvey = async (id: string, surveyData: Partial<CreateSurveyData>) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('surveys')
        .update(surveyData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = surveys.value.findIndex(s => s.id === id)
      if (index !== -1) {
        surveys.value[index] = data
      }

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar encuesta'
      console.error('Error updating survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSurvey = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      surveys.value = surveys.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar encuesta'
      console.error('Error deleting survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSurveyById = async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      return data
    } catch (err) {
      console.error('Error fetching survey by id:', err)
      throw err
    }
  }

  const getSurveyBySlug = async (slug: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('surveys')
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError) throw fetchError
      return data
    } catch (err) {
      console.error('Error fetching survey by slug:', err)
      throw err
    }
  }

  const generateUniqueSlug = async (title: string): Promise<string> => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data } = await supabase
        .from('surveys')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!data) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  return {
    // Estado
    surveys: readonly(surveys),
    loading: readonly(loading),
    error: readonly(error),

    // Acciones
    fetchSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurveyById,
    getSurveyBySlug
  }
})