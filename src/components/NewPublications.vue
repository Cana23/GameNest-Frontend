<template>
  <section>
    <Toast />
    <div class='container'>
    <div class='content'>
      <div class="flex gap-4 items-center">
        <img src="../assets/images/gojo cat.jpg" alt="">
        <p class="text-gray-600">Bienvenido Usuario</p>
      </div>
      <div class="w-full bg-gray-200 rounded-full py-4 px-6 cursor-pointer" @click="visible = true">
        <p class="text-gray-600 cursor-pointer">Comparte tu experiencia y conocimientos para que más personas te conozcan.</p>
      </div>
    </div>
    </div>
  </section>
  <Dialog :draggable="false" v-model:visible="visible" modal header="Crear una publicación" :style="{ width: '50rem', backgroundColor:'white', color: '#8600AF', padding: '10px 20px' }">
    <div class="flex flex-col gap-5">
    <div class="flex gap-4 items-center">
      <img src="../assets/images/gojo cat.jpg" alt="">
      <p class="text-gray-600">Usuario1</p>
    </div>
    <form @submit.prevent="submitForm" novalidate class="w-full flex flex-col gap-5">
      <div class="relative">
        <FloatLabel variant="on" class="bg-white">
                  <InputText id="title" v-model="title" required
                  :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.title }" />
                  <label for="title" class="bg-white">Titulo de publicación</label>
    </FloatLabel>
    <span v-if="errors.title" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.title }}</span>
      </div>
<div class="relative">
  <FloatLabel variant="on" class="bg-white">
      <Textarea id="content" v-model="content" required
      :class="{ 'w-full text-gray-600 border-1 border-gray-300 rounded-2xl py-3 px-6': true, 'border-red-500': errors.title }"
       rows="5" cols="30"/>
      <label for="content" class="bg-white">Comparte tu experiencia y conocimientos para que más personas te conozcan</label>
    </FloatLabel>
    <span v-if="errors.content" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.content }}</span>
</div>
<div class="relative">
  <FloatLabel variant="on" class="bg-white">
                  <InputText id="imageUrl" v-model="imageUrl" required
                  :class="{ 'w-full py-3 px-10 border-1 border-gray-300 rounded-full': true, 'border-red-500': errors.imageUrl }" />
                  <label for="imageUrl" class="bg-white">Url de la imagen</label>
    </FloatLabel>
    <span v-if="errors.imageUrl" class="text-red-500 absolute" style="font-size: 12px; padding-left: 20px;">* {{ errors.imageUrl }}</span>
</div>

    <div class="action-add">
      <!-- <div class="flex flex-col gap-2">
  <div class="flex gap-2">
    <FloatLabel variant="on" class="bg-white">
                  <InputText id="category" class="w-full py-2 px-4 border-1 border-gray-300 rounded-full"/>
                  <label for="category" class="bg-white">Categoria</label>
                </FloatLabel>
    <Button icon="pi pi-plus" class="hover:bg-purple-100 rounded-full"/>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <span class="bg-violet-400 text-white py-2 pl-3 text-sm rounded-full">
      Informativo
      <Button icon="pi pi-times" class=" ml-1" />
    </span>
  </div>
</div> -->
    <!-- <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" :auto="true" chooseLabel="Subir imagen" class="border-1 border-purple-500 text-purple-500 rounded-xl py-2 px-4 hover:bg-purple-100"/> -->
</div>
    <div class="flex justify-end gap-4">
                <button type="button" @click="visible = false" class="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer">Cancelar</button>
                <button type="submit" class="py-2 px-4 text-white rounded-xl bg-purple-500 hover:bg-purple-600 cursor-pointer">Publicar</button>
            </div>

          </form>
          </div>
        </Dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { usePublicationsStore } from "@/stores/publicationtsStore";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const schema = yup.object({
  title: yup.string().required('El titulo es requerido'),
  content: yup.string().required('El contenido es requerido'),
  imageUrl: yup.string().required('El titulo es requerido'),
});

const { errors, defineField, validate } = useForm({
  validationSchema: schema
});

const [title, titleAttrs] = defineField('title');
const [content, contentAttrs] = defineField('content');
const [imageUrl, imageUrlAttrs] = defineField('imageUrl');

const store = usePublicationsStore();
const visible = ref(false);

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Publicación creada', detail: 'La publicación se creo correctamente'});
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
    imageUrl: imageUrl.value, // Agregar funcionalidad para subir imagen
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
section{
  padding-left: 335px;
}
.content{
  width: 100%;
  border: solid 1px rgb(207, 207, 207);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
img{
  width: 50px;
height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.action-add{
  display: flex;
  justify-content: space-between;
}
</style>
