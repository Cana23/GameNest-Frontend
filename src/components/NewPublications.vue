<template>
  <section>
    <Toast />
    <div class='container'>
      <div class='content'>
        <div class="flex gap-4 items-center mb-4">
          <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
            shape="circle" />
          <p class="text-neon-light font-medium">¿Qué quieres compartir hoy, {{ username }}?</p>
        </div>

        <div class="w-full bg-[#1e0845] rounded-lg p-4 border border-[#6b46c1] mb-3">
          <p class="text-neon-gray mb-4">Comparte tu experiencia y conocimientos para que más personas te conozcan.</p>

          <div class="flex justify-end">
            <button @click="visible = true"
                    class="bg-gradient-to-r from-neon-purple to-neon-blue text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Crear publicación
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Dialog :draggable="false" v-model:visible="visible" modal header="Crear una publicación"
    :style="{ width: '50rem', backgroundColor: '#1a1a2e', color: 'white', padding: '10px 20px', border: '1px solid #6b46c1' }">
    <div class="flex flex-col gap-5">
      <div class="flex gap-4 items-center">
        <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
          shape="circle" />
        <p class="text-neon-light">{{ username }}</p>
      </div>
      <form @submit.prevent="submitForm" novalidate class="w-full flex flex-col gap-5">
        <div class="relative">
          <FloatLabel variant="on" class="bg-neon-dark">
            <InputText id="title" v-model="title" required
              :class="{ 'w-full py-3 px-10 border-1 border-[#6b46c1] rounded-lg bg-neon-dark text-neon-light': true, 'border-neon-red': errors.title }" />
            <label for="title" class="text-neon-gray">Titulo de publicación</label>
          </FloatLabel>
          <span v-if="errors.title" class="text-neon-red absolute" style="font-size: 12px; padding-left: 20px;">* {{
            errors.title }}</span>
        </div>
        <div class="relative">
          <FloatLabel variant="on" class="bg-neon-dark">
            <Textarea id="content" v-model="content" required
              :class="{ 'w-full border-1 border-[#6b46c1] rounded-lg py-3 px-6 bg-neon-dark text-neon-light': true, 'border-neon-red': errors.title }"
              rows="5" cols="30" />
            <label for="content" class="text-neon-gray">Comparte tu experiencia y conocimientos para que más personas te
              conozcan</label>
          </FloatLabel>
          <span v-if="errors.content" class="text-neon-red absolute" style="font-size: 12px; padding-left: 20px;">* {{
            errors.content }}</span>
        </div>
        <div class="relative">
          <FloatLabel variant="on" class="bg-neon-dark">
            <InputText id="imageUrl" v-model="imageUrl" required
              :class="{ 'w-full py-3 px-10 border-1 border-[#6b46c1] rounded-lg bg-neon-dark text-neon-light': true, 'border-neon-red': errors.imageUrl }" />
            <label for="imageUrl" class="text-neon-gray">Url de la imagen</label>
          </FloatLabel>
          <span v-if="errors.imageUrl" class="text-neon-red absolute" style="font-size: 12px; padding-left: 20px;">* {{
            errors.imageUrl }}</span>
        </div>

        <div class="flex justify-end gap-4">
          <button type="button" @click="visible = false"
            class="py-2 px-4 bg-gradient-to-r from-neon-red to-neon-pink text-white rounded-lg hover:opacity-90 transition-opacity">
            Cancelar
          </button>
          <button type="submit"
            class="py-2 px-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-lg hover:opacity-90 transition-opacity">
            Publicar
          </button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { usePublicationsStore } from "@/stores/publicationtsStore";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/authStore";

const toast = useToast();
const authStore = useAuthStore();
const schema = yup.object({
  title: yup.string().required('El titulo es requerido'),
  content: yup.string().required('El contenido es requerido')
});

const { errors, defineField, validate } = useForm({
  validationSchema: schema
});

const isAuthenticated = computed(() => !!authStore.token);
const username = computed(() => authStore.user?.userName || "Usuario");
const [title, titleAttrs] = defineField('title');
const [content, contentAttrs] = defineField('content');
const [imageUrl, imageUrlAttrs] = defineField('imageUrl');

const store = usePublicationsStore();
const visible = ref(false);

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Publicación creada', detail: 'La publicación se creo correctamente' });
};

const submitForm = async () => {
  const result = await validate();
  if (!result.valid) {
    console.log("Errores en el formulario:", errors);
    return;
  }

  const publicData = {
    title: title.value,
    content: content.value,
    imageUrl: imageUrl.value || "",
  };

  try {
    await store.createPublication(publicData);
    await showSuccess();
    visible.value = false;
  } catch (error) {
    console.error("Error al crear la publicación:", error);
  }
};
</script>

<style scoped>
section {
  padding-left: 335px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.content {
  width: 100%;
  border: 1px solid #6b46c1;
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.3);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #1a1a2e, #3b1685);
}

.text-neon-light {
  color: white;
}

.text-neon-gray {
  color: #94a3b8;
}

.from-neon-purple {
  --tw-gradient-from: #7c3aed;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(124, 58, 237, 0));
}

.to-neon-blue {
  --tw-gradient-to: #5229ce;
}

.hover\:opacity-90:hover {
  opacity: 0.9;
}

.transition-opacity {
  transition: opacity 0.2s ease;
}
</style>
