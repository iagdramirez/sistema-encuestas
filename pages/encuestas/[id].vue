<template>
  <div class="tw-bg-[#18171d] tw-min-h-[94vh] tw-rounded-2xl tw-text-white tw-py-6 tw-px-4 xs:tw-px-16 tw-mx-2 xs:tw-mx-0">
    <v-container fluid class="tw-py-6">
      <!-- Loading -->
      <div v-if="loading" class="tw-flex tw-justify-center tw-py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" class="tw-mb-4">
        {{ error }}
      </v-alert>

      <!-- Contenido principal -->
      <div v-else>
        <!-- Header -->
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <div>
            <h1 class="tw-text-3xl tw-font-bold tw-mb-2">Editar Encuesta</h1>
            <v-btn variant="text" color="primary" @click="$router.push('/')">
              <v-icon left>mdi-arrow-left</v-icon>
              Volver al listado
            </v-btn>
          </div>
          <div class="tw-flex tw-gap-2">
            <v-btn
              color="primary"
              variant="outlined"
              @click="copyLink(survey.slug)"
            >
              <v-icon left>mdi-content-copy</v-icon>
              Copiar enlace
            </v-btn>
            <v-btn
              color="secondary"
              variant="outlined"
              @click="showQRDialog(survey.slug)"
            >
              <v-icon left>mdi-qrcode</v-icon>
              QR
            </v-btn>
          </div>
        </div>

        <!-- Formulario de encuesta -->
        <v-card class="tw-bg-[#1e1e24] tw-border tw-border-gray-700 tw-mb-6">
          <v-card-title class="tw-text-white">
            <v-icon left>mdi-clipboard-text</v-icon>
            Información de la Encuesta
          </v-card-title>
          <v-card-text>
            <v-form ref="surveyForm">
              <v-text-field
                v-model="survey.title"
                label="Título"
                required
                class="tw-mb-4"
                :rules="[v => !!v || 'El título es requerido']"
                @input="updateSurvey"
              ></v-text-field>
              <v-textarea
                v-model="survey.description"
                label="Descripción (opcional)"
                rows="3"
                @input="updateSurvey"
              ></v-textarea>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Preguntas -->
        <v-card class="tw-bg-[#1e1e24] tw-border tw-border-gray-700">
          <v-card-title class="tw-text-white tw-flex tw-justify-between tw-items-center">
            <span>
              <v-icon left>mdi-help-circle</v-icon>
              Preguntas
            </span>
            <v-btn color="primary" @click="showAddQuestionDialog = true">
              <v-icon left>mdi-plus</v-icon>
              Agregar Pregunta
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="questionStore.questions.length === 0" class="tw-text-center tw-py-8">
              <v-icon size="48" class="tw-text-gray-500 tw-mb-4">mdi-help-circle-outline</v-icon>
              <p class="tw-text-gray-400">No hay preguntas en esta encuesta</p>
              <v-btn color="primary" variant="outlined" @click="showAddQuestionDialog = true" class="tw-mt-4">
                Agregar primera pregunta
              </v-btn>
            </div>

            <div v-else>
              <draggable
                v-model="localQuestions"
                item-key="id"
                handle=".drag-handle"
                @end="reorderQuestions"
              >
                <template #item="{ element: question }">
                  <v-card
                    :key="question.id"
                    class="tw-bg-[#25252b] tw-border tw-border-gray-600 tw-mb-3"
                  >
                    <v-card-title class="tw-text-white tw-flex tw-justify-between tw-items-center">
                      <div class="tw-flex tw-items-center">
                        <v-icon class="drag-handle tw-cursor-move tw-mr-2">mdi-drag</v-icon>
                        <span>{{ question.question_text }}</span>
                      </div>
                      <div class="tw-flex tw-items-center tw-gap-2">
                        <v-chip
                          :color="getQuestionTypeColor(question.type)"
                          size="small"
                          variant="flat"
                        >
                          {{ getQuestionTypeLabel(question.type) }}
                        </v-chip>
                        <v-btn
                          icon
                          size="small"
                          color="warning"
                          @click="editQuestion(question)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          @click="confirmDeleteQuestion(question)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card-title>

                    <!-- Mostrar opciones para preguntas múltiples -->
                    <v-card-text v-if="question.type === 'multiple'">
                      <div class="tw-ml-8">
                        <p class="tw-text-gray-400 tw-text-sm tw-mb-2">Opciones:</p>
                        <v-chip
                          v-for="option in getQuestionOptions(question.id)"
                          :key="option.id"
                          class="tw-mr-2 tw-mb-2"
                          variant="outlined"
                        >
                          {{ option.option_text }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </template>
              </draggable>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Diálogo agregar/editar pregunta -->
    <v-dialog v-model="showAddQuestionDialog" max-width="600px">
      <v-card class="tw-bg-[#1e1e24]">
        <v-card-title class="tw-text-white">
          <v-icon left>{{ editingQuestion ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="questionForm" @submit.prevent="saveQuestion">
            <v-text-field
              v-model="questionData.question_text"
              label="Texto de la pregunta"
              required
              class="tw-mb-4"
              :rules="[v => !!v || 'El texto de la pregunta es requerido']"
            ></v-text-field>

            <v-select
              v-model="questionData.type"
              :items="questionTypes"
              label="Tipo de pregunta"
              required
              class="tw-mb-4"
              :rules="[v => !!v || 'El tipo de pregunta es requerido']"
            ></v-select>

            <!-- Opciones para preguntas múltiples -->
            <div v-if="questionData.type === 'multiple'" class="tw-mb-4">
              <v-text-field
                v-model="newOption"
                label="Nueva opción"
                @keydown.enter="addOption"
                class="tw-mb-2"
              >
                <template #append>
                  <v-btn icon @click="addOption">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <div class="tw-flex tw-flex-wrap tw-gap-2">
                <v-chip
                  v-for="(option, index) in questionData.options"
                  :key="index"
                  closable
                  @click:close="removeOption(index)"
                >
                  {{ option }}
                </v-chip>
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeQuestionDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveQuestion">
            {{ editingQuestion ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo QR -->
    <v-dialog v-model="showQRCodeDialog" max-width="400px">
      <v-card class="tw-bg-[#1e1e24] tw-text-center">
        <v-card-title class="tw-text-white">
          Código QR de la Encuesta
        </v-card-title>
        <v-card-text>
          <QRCode :text="qrUrl" :size="256" class="tw-mx-auto" />
          <p class="tw-text-gray-300 tw-mt-4">{{ qrUrl }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showQRCodeDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo confirmar eliminación de pregunta -->
    <v-dialog v-model="showDeleteQuestionDialog" max-width="400px">
      <v-card class="tw-bg-[#1e1e24]">
        <v-card-title class="tw-text-white">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="tw-text-gray-300">
          ¿Estás seguro de que quieres eliminar la pregunta "{{ questionToDelete?.question_text }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteQuestionDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteQuestion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import draggable from 'vuedraggable'
import type { Survey, SurveyQuestion } from '~/interfaces'
import { useSurveyStore } from '~/store/useSurveyStore'
import { useQuestionStore } from '~/store/useQuestionStore'

const route = useRoute()
const router = useRouter()

const surveyStore = useSurveyStore()
const questionStore = useQuestionStore()

// Estados
const loading = ref(true)
const error = ref('')
const survey = ref<Survey | null>(null)
const localQuestions = ref<SurveyQuestion[]>([])

// Estados para diálogos
const showAddQuestionDialog = ref(false)
const showQRCodeDialog = ref(false)
const showDeleteQuestionDialog = ref(false)
const editingQuestion = ref<SurveyQuestion | null>(null)
const questionToDelete = ref<SurveyQuestion | null>(null)
const qrUrl = ref('')

// Formularios
const surveyForm = ref()
const questionForm = ref()

// Datos de pregunta
const questionData = ref({
  question_text: '',
  type: 'text' as 'yes_no' | 'text' | 'multiple',
  options: [] as string[]
})

const newOption = ref('')

// Tipos de pregunta
const questionTypes = [
  { title: 'Sí/No', value: 'yes_no' },
  { title: 'Respuesta en texto', value: 'text' },
  { title: 'Selección múltiple', value: 'multiple' }
]

// Funciones
const getQuestionTypeLabel = (type: string) => {
  const labels = {
    yes_no: 'Sí/No',
    text: 'Texto',
    multiple: 'Múltiple'
  }
  return labels[type as keyof typeof labels] || type
}

const getQuestionTypeColor = (type: string) => {
  const colors = {
    yes_no: 'success',
    text: 'primary',
    multiple: 'warning'
  }
  return colors[type as keyof typeof colors] || 'grey'
}

const getQuestionOptions = (questionId: string) => {
  return questionStore.options.filter(option => option.question_id === questionId)
}

const updateSurvey = async () => {
  if (!survey.value) return
  try {
    await surveyStore.updateSurvey(survey.value.id, {
      title: survey.value.title,
      description: survey.value.description
    })
  } catch (err) {
    console.error('Error updating survey:', err)
  }
}

const copyLink = async (slug: string) => {
  const url = `${useRuntimeConfig().public.appUrl}/s/${slug}`
  await navigator.clipboard.writeText(url)
  // TODO: Mostrar notificación
}

const showQRDialog = (slug: string) => {
  qrUrl.value = `${useRuntimeConfig().public.appUrl}/s/${slug}`
  showQRCodeDialog.value = true
}

const editQuestion = (question: SurveyQuestion) => {
  editingQuestion.value = question
  questionData.value = {
    question_text: question.question_text,
    type: question.type,
    options: getQuestionOptions(question.id).map(opt => opt.option_text)
  }
  showAddQuestionDialog.value = true
}

const confirmDeleteQuestion = (question: SurveyQuestion) => {
  questionToDelete.value = question
  showDeleteQuestionDialog.value = true
}

const deleteQuestion = async () => {
  if (!questionToDelete.value) return

  try {
    await questionStore.deleteQuestion(questionToDelete.value.id)
    showDeleteQuestionDialog.value = false
    questionToDelete.value = null
  } catch (error) {
    console.error('Error deleting question:', error)
  }
}

const addOption = () => {
  if (newOption.value.trim()) {
    questionData.value.options.push(newOption.value.trim())
    newOption.value = ''
  }
}

const removeOption = (index: number) => {
  questionData.value.options.splice(index, 1)
}

const saveQuestion = async () => {
  const { valid } = await questionForm.value.validate()
  if (!valid) return

  try {
    if (editingQuestion.value) {
      await questionStore.updateQuestion(editingQuestion.value.id, questionData.value)
    } else {
      await questionStore.createQuestion(route.params.id as string, questionData.value)
    }
    // Recargar preguntas para asegurar que se refresque la lista
    await questionStore.fetchQuestions(route.params.id as string)
    closeQuestionDialog()
  } catch (error) {
    console.error('Error saving question:', error)
  }
}

const closeQuestionDialog = () => {
  showAddQuestionDialog.value = false
  editingQuestion.value = null
  questionData.value = {
    question_text: '',
    type: 'text',
    options: []
  }
  newOption.value = ''
}

const reorderQuestions = async () => {
  const questionIds = localQuestions.value.map(q => q.id)
  try {
    await questionStore.reorderQuestions(route.params.id as string, questionIds)
  } catch (error) {
    console.error('Error reordering questions:', error)
  }
}

// Watchers
watch(() => questionStore.questions, (newQuestions) => {
  localQuestions.value = [...newQuestions]
}, { immediate: true })

// Cargar datos
onMounted(async () => {
  try {
    // Cargar encuesta
    const surveyData = await surveyStore.getSurveyById(route.params.id as string)
    if (!surveyData) {
      throw new Error('Encuesta no encontrada')
    }
    survey.value = surveyData

    // Cargar preguntas
    await questionStore.fetchQuestions(surveyData.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar la encuesta'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>