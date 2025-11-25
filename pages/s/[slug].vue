<template>
  <div class="tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-100 tw-py-8 tw-px-4">
    <div class="tw-max-w-2xl tw-mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="tw-flex tw-justify-center tw-py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" class="tw-mb-6">
        {{ error }}
      </v-alert>

      <!-- Encuesta no encontrada -->
      <div v-else-if="!survey" class="tw-text-center tw-py-12">
        <v-icon size="64" class="tw-text-gray-400 tw-mb-4">mdi-clipboard-text-off</v-icon>
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-700 tw-mb-2">Encuesta no encontrada</h2>
        <p class="tw-text-gray-500">La encuesta que buscas no existe o ha sido eliminada.</p>
      </div>

      <!-- Formulario de respuesta -->
      <div v-else-if="!submitted">
        <v-card class="tw-shadow-xl tw-border-0">
          <v-card-title class="tw-bg-white tw-border-b tw-border-gray-200 tw-rounded-t-lg">
            <div class="tw-text-center tw-w-full">
              <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">{{ survey.title }}</h1>
              <p v-if="survey.description" class="tw-text-gray-600">{{ survey.description }}</p>
            </div>
          </v-card-title>

          <v-card-text class="tw-bg-white tw-p-8">
            <v-form ref="responseForm" @submit.prevent="submitResponse">
              <div v-for="(question, index) in questions" :key="question.id" class="tw-mb-8">
                <div class="tw-flex tw-items-start tw-mb-4">
                  <div class="tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-bold tw-mr-4 tw-flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <div class="tw-flex-1">
                    <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-3">
                      {{ question.question_text }}
                    </h3>

                    <!-- Pregunta Sí/No -->
                    <div v-if="question.type === 'yes_no'" class="tw-ml-4">
                      <v-radio-group
                        v-model="answers[question.id]"
                        :rules="[v => v !== undefined || 'Selecciona una opción']"
                        inline
                      >
                        <v-radio label="Sí" :value="true" color="primary"></v-radio>
                        <v-radio label="No" :value="false" color="primary"></v-radio>
                      </v-radio-group>
                    </div>

                    <!-- Pregunta de texto -->
                    <div v-else-if="question.type === 'text'" class="tw-ml-4">
                      <v-textarea
                        v-model="answers[question.id]"
                        label="Tu respuesta"
                        :rules="[v => !!v || 'Este campo es requerido']"
                        rows="3"
                        variant="outlined"
                        class="tw-max-w-md"
                      ></v-textarea>
                    </div>

                    <!-- Pregunta múltiple -->
                    <div v-else-if="question.type === 'multiple'" class="tw-ml-4">
                      <v-radio-group
                        v-model="answers[question.id]"
                        :rules="[v => !!v || 'Selecciona una opción']"
                      >
                        <v-radio
                          v-for="option in getQuestionOptions(question.id)"
                          :key="option.id"
                          :label="option.option_text"
                          :value="option.id"
                          color="primary"
                          class="tw-mb-2"
                        ></v-radio>
                      </v-radio-group>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tw-text-center tw-mt-8">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  :loading="submitting"
                  class="tw-px-12 tw-py-3"
                >
                  <v-icon left>mdi-send</v-icon>
                  Enviar respuestas
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </div>

      <!-- Pantalla de gracias -->
      <div v-else class="tw-text-center tw-py-12">
        <v-card class="tw-shadow-xl tw-border-0 tw-bg-white">
          <v-card-text class="tw-p-12">
            <v-icon size="80" class="tw-text-green-500 tw-mb-6">mdi-check-circle</v-icon>
            <h2 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-4">¡Gracias por participar!</h2>
            <p class="tw-text-lg tw-text-gray-600 tw-mb-6">
              Tus respuestas han sido registradas exitosamente.
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="resetForm"
              class="tw-mr-4"
            >
              <v-icon left>mdi-refresh</v-icon>
              Responder de nuevo
            </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              @click="$router.push('/')"
            >
              <v-icon left>mdi-home</v-icon>
              Ir al inicio
            </v-btn>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Survey, SurveyQuestion, SurveyOption, SubmitResponseData } from '~/interfaces'
import { useSurveyStore } from '~/store/useSurveyStore'
import { useQuestionStore } from '~/store/useQuestionStore'
import { useResponseStore } from '~/store/useResponseStore'

const route = useRoute()
const router = useRouter()

const surveyStore = useSurveyStore()
const questionStore = useQuestionStore()
const responseStore = useResponseStore()

// Estados
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const submitted = ref(false)
const survey = ref<Survey | null>(null)
const questions = ref<SurveyQuestion[]>([])
const answers = ref<Record<string, any>>({})

// Formulario
const responseForm = ref()

// Funciones
const getQuestionOptions = (questionId: string): SurveyOption[] => {
  return questionStore.options.filter(option => option.question_id === questionId)
}

const submitResponse = async () => {
  const { valid } = await responseForm.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    // Preparar datos de respuesta
    const responseData: SubmitResponseData = {
      answers: questions.value.map(question => {
        const answer = answers.value[question.id]
        return {
          question_id: question.id,
          answer_text: question.type === 'text' ? answer : undefined,
          option_id: question.type === 'multiple' ? answer : undefined
        }
      }).filter(answer => answer.answer_text !== undefined || answer.option_id !== undefined)
    }

    await responseStore.submitResponse(survey.value!.id, responseData)
    submitted.value = true
  } catch (err) {
    console.error('Error submitting response:', err)
    // TODO: Mostrar error al usuario
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  answers.value = {}
  submitted.value = false
  responseForm.value.reset()
}

// Cargar datos
onMounted(async () => {
  try {
    // Cargar encuesta por slug
    const surveyData = await surveyStore.getSurveyBySlug(route.params.slug as string)
    if (!surveyData) {
      throw new Error('Encuesta no encontrada')
    }
    survey.value = surveyData

    // Cargar preguntas
    await questionStore.fetchQuestions(surveyData.id)
    questions.value = [...questionStore.questions]

    // Cargar opciones para preguntas múltiples
    for (const question of questions.value) {
      if (question.type === 'multiple') {
        await questionStore.fetchOptions(question.id)
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar la encuesta'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>