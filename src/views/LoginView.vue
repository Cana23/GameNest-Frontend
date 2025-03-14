<template>
  <section class="">
    <div class="bg-info"></div>
    <div class='container'>
    <div class='content'>
      <div class="image flex flex-col justify-center items-center">
        <img class="robot" src="../assets/images/login/image1.png" alt="">
        <p class="text-white text-center max-w-100">Explora y comparte tus experiencias en el mundo del desarrollo de videojuegos con <span class="font-semibold">GameNest</span>.</p>
      </div>
      <div class="form-login flex flex-col justify-center items-center">
        <div class="mb-8">
          <h1 class="font-semibold mb-4 text-center">Registrate</h1>
        <p class="text-center text-gray-600">Bienvenido, no te pierdas esta aventura y sumérgete en la experiencia.</p>
        </div>
        <form action="" class="w-full">
          <div class="flex flex-col gap-8">
            <FloatLabel variant="on" class="bg-white">
            <InputText id="on_label" class="w-full py-3 px-10 border-1 border-gray-300 rounded-full"/>
            <label for="on_label" class="bg-white">Nombre</label>
        </FloatLabel>
            <FloatLabel variant="on" class="bg-white">
            <InputText id="on_label" class="w-full py-3 px-10 border-1 border-gray-300 rounded-full"/>
            <label for="on_label" class="bg-white">Correo</label>
        </FloatLabel>
            <FloatLabel variant="on" class="bg-white">
            <Password :feedback="false" id="on_label" toggleMask class="w-full border-1 border-gray-300 rounded-full"/>
            <label for="on_label" class="bg-white">Contraseña</label>
        </FloatLabel>
        <Button label="Registrarse" severity="help" class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800"/>
          </div>
        </form>
      </div>
    </div>
    </div>
  </section>
</template>
<script lang="ts" setup></script>

<style scoped>
section{
  height: 100vh;
  @media(max-width: 991px){
    height: 100%;
  }
}
.content{
  height: 100%;
}
.container{
  height: 100%;
}

span{
  font-weight: 600;
}
.content{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  @media(max-width: 991px){
    display: flex;
    flex-direction: column;
    gap: 100px;
    padding: 40px 0;
  }
}
.image{
  z-index: 1;
}
.robot{
  width: 300px;

  @media(max-width: 576px){
    width: 240px;
  }
}
.bg-info{
  background-color: black;
        border-radius: 0% 59% 57% 52% / 95% 138% 57% 0%;
        overflow: hidden;
        width: 47%;
        height: 100%;
        position: absolute;
        top: 0;
  @media(max-width: 991px){
    background-color: black;
    border-radius: 0% 0% 50% 50% / 85% 88% 12% 15%;
    overflow: hidden;
    width: 100%;
    height: 440px;
    position: absolute;
    top: 0;
  }
  @media(max-width: 576px){
    height: 400px;
  }

}
</style>
