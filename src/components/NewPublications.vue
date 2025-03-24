<template>
  <section>
    <div class='container'>
    <div class='content'>
      <div class="flex gap-4 items-center">
        <img src="../assets/images/gojo cat.jpg" alt="">
        <p class="text-gray-600">Bienvenido Usuario1</p>
      </div>
      <div class="w-full bg-gray-200 rounded-full py-4 px-6 cursor-pointer">
        <p class="text-gray-600 cursor-pointer">Comparte tu experiencia y conocimientos para que más personas te conozcan.</p>
      </div>
    </div>
    </div>
  </section>
</template>
<script lang="ts" setup></script>

<style scoped>
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
</style>
