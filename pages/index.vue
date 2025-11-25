<template>
  <div class="tw-bg-[#18171d] tw-min-h-[94vh] tw-rounded-2xl tw-text-white tw-py-6 tw-px-4 xs:tw-px-16 tw-mx-2 xs:tw-mx-0">
    <v-container fluid class="tw-py-6">
      <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h1 class="tw-text-3xl tw-font-bold">Sistema de Encuestas</h1>
        <v-btn color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Nueva Encuesta
        </v-btn>
      </div>

      <!-- Loading -->
      <div v-if="surveyStore.loading" class="tw-flex tw-justify-center tw-py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <!-- Error -->
      <v-alert v-if="surveyStore.error" type="error" class="tw-mb-4">
        {{ surveyStore.error }}
      </v-alert>

      <!-- Lista de encuestas -->
      <v-row v-if="!surveyStore.loading">
        <v-col
          v-for="survey in surveyStore.surveys"
          :key="survey.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="tw-bg-[#1e1e24] tw-border tw-border-gray-700">
            <v-card-title class="tw-text-white">
              {{ survey.title }}
            </v-card-title>
            <v-card-text class="tw-text-gray-300">
              <p v-if="survey.description">{{ survey.description }}</p>
              <p class="tw-text-sm tw-text-gray-500">
                Creada: {{ formatDate(survey.created_at) }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="copyLink(survey.slug)"
              >
                <v-icon left>mdi-content-copy</v-icon>
                Copiar enlace
              </v-btn>
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                @click="showQRDialog(survey.slug)"
              >
                <v-icon left>mdi-qrcode</v-icon>
                QR
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                variant="text"
                size="small"
                :to="`/encuestas/${survey.id}`"
              >
                <v-icon left>mdi-pencil</v-icon>
                Editar
              </v-btn>
              <v-btn
                color="error"
                variant="text"
                size="small"
                @click="confirmDelete(survey)"
              >
                <v-icon left>mdi-delete</v-icon>
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Mensaje cuando no hay encuestas -->
      <div v-if="!surveyStore.loading && surveyStore.surveys.length === 0" class="tw-text-center tw-py-12">
        <v-icon size="64" class="tw-text-gray-500 tw-mb-4">mdi-clipboard-text-outline</v-icon>
        <h3 class="tw-text-xl tw-text-gray-400 tw-mb-2">No hay encuestas</h3>
        <p class="tw-text-gray-500 tw-mb-4">Crea tu primera encuesta para comenzar</p>
        <v-btn color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Crear primera encuesta
        </v-btn>
      </div>
    </v-container>

    <!-- Diálogo crear encuesta -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card class="tw-bg-[#1e1e24]">
        <v-card-title class="tw-text-white">
          <v-icon left>mdi-plus</v-icon>
          Nueva Encuesta
        </v-card-title>
        <v-card-text>
          <v-form ref="createForm" @submit.prevent="createSurvey">
            <v-text-field
              v-model="newSurvey.title"
              label="Título"
              required
              class="tw-mb-4"
              :rules="[v => !!v || 'El título es requerido']"
            ></v-text-field>
            <v-textarea
              v-model="newSurvey.description"
              label="Descripción (opcional)"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showCreateDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createSurvey">Crear</v-btn>
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

    <!-- Diálogo confirmar eliminación -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card class="tw-bg-[#1e1e24]">
        <v-card-title class="tw-text-white">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="tw-text-gray-300">
          ¿Estás seguro de que quieres eliminar la encuesta "{{ surveyToDelete?.title }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteSurvey">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Survey } from '~/interfaces'
import { useSurveyStore } from '~/store/useSurveyStore'

const surveyStore = useSurveyStore()
const createForm = ref()

// Estados locales
const showCreateDialog = ref(false)
const showQRCodeDialog = ref(false)
const showDeleteDialog = ref(false)
const surveyToDelete = ref<Survey | null>(null)
const qrUrl = ref('')

// Datos del formulario
const newSurvey = ref({
  title: '',
  description: ''
})

// Funciones
const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })
}

const createSurvey = async () => {
  const { valid } = await createForm.value.validate()
  if (!valid) return

  try {
    await surveyStore.createSurvey(newSurvey.value)
    showCreateDialog.value = false
    newSurvey.value = { title: '', description: '' }
  } catch (error) {
    console.error('Error creating survey:', error)
  }
}

const copyLink = async (slug: string) => {
  const url = `${useRuntimeConfig().public.appUrl}/s/${slug}`
  await navigator.clipboard.writeText(url)
  // TODO: Mostrar notificación de éxito
}

const showQRDialog = (slug: string) => {
  qrUrl.value = `${useRuntimeConfig().public.appUrl}/s/${slug}`
  showQRCodeDialog.value = true
}

const confirmDelete = (survey: Survey) => {
  surveyToDelete.value = survey
  showDeleteDialog.value = true
}

const deleteSurvey = async () => {
  if (!surveyToDelete.value) return

  try {
    await surveyStore.deleteSurvey(surveyToDelete.value.id)
    showDeleteDialog.value = false
    surveyToDelete.value = null
  } catch (error) {
    console.error('Error deleting survey:', error)
  }
}

// Cargar encuestas al montar
onMounted(() => {
  surveyStore.fetchSurveys()
})
</script>
