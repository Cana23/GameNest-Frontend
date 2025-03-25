<template>
  <section>
    <div class='container'>
    <div class='content'>
      <div class="flex gap-4 items-center">
        <img src="../assets/images/gojo cat.jpg" alt="" class="img-profile">
        <div class="flex flex-col">
          <p class="text-gray-600">Bienvenido Usuario1</p>
        <p class="text-gray-600 text-sm">22 de febrero de 2025 a las 2:00 pm</p>
        </div>

      </div>
      <div class="w-full px-6 flex flex-col gap-4">
        <p class="text-gray-600 ">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing..</p>
        <img src="../assets/images/videojuegos-universidad-utec.jpg" alt="" class="img-publication">
        <div class="flex gap-5 justify-end">
          <div class="flex gap-2">
            <i class="pi pi-heart text-violet-500 cursor-pointer"></i>
          <p class="text-gray-600 text-sm">10 me gusta</p>
          </div>
          <div class="flex gap-2">
            <i class="pi pi-comments text-violet-500 cursor-pointer"></i>
            <p class="text-gray-600 text-sm">10 me comentarios</p>
          </div>
        </div>
        <div class="flex gap-2">
            <img src="../assets/images/gojo cat.jpg" alt="" class="img-profile">
            <div class=" bg-gray-200 rounded-full flex items-center px-5"><p class="text-gray-600 text-sm">It is a long established fact that a reader will be</p></div>
          </div>
        <div class="flex gap-2">
            <img src="../assets/images/gojo cat.jpg" alt="" class="img-profile">
            <input type="text" placeholder="Deja tu comentario" class="w-full bg-gray-200 rounded-full">
            <Button icon="pi pi-send" class="bg-violet-500 px-6 rounded-xl text-3xl"/>
          </div>
      </div>
    </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(1);
</script>

<style scoped>
section{
  padding-top: 30px;
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
.img-profile{
  width: 50px;
height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.img-publication{
  object-fit: cover;
  width: 100%;
  max-height: 300px;
  border-radius: 5px;
}
</style>
