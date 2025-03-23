<script setup lang="ts">
import IconTextBubble from '@/components/icons/IconTextBubble.vue';
import IconThumbsUp from '@/components/icons/IconThumbsUp.vue';
import IconTrophy from '@/components/icons/IconTrophy.vue';
import LayoutVisitante from '../layouts/LayoutVisitante.vue';
</script>

<template>
    <LayoutVisitante>
        <!-- Sección principal -->
        <section
            class="h-[80%] justify-center items-center bg-gradient-to-r from-gray-900 to-black text-white text-center px-16">
            <div class="container">
            <div class="grid grid-flow-col grid-rows-2 gap-8">
                <div class=" row-span-3 flex justify-center items-center">
                    <img src="../assets/images/login/image1.png" alt="Mascota" class="" />
                </div>
                <div class="flex justify-center items-center">
                    <h2 class="tracking-wide text-5xl text-center font-semibold m-4 mt-8">Donde las
                        ideas toman vida</h2>
                </div>
                <div class="text-2xl text-left">
                    <h2 class="tracking-wide m-4 mt-8">El hogar de los desarrolladores
                        de videojuegos en
                        Latinoamérica</h2>

                </div>
                <button class="bg-purple-500 py-3 px-8 rounded-3xl text-white font-bold hover:bg-purple-800 w-50">Regístrate
                            hoy</button>
            </div>
          </div>
        </section>

        <!-- Más contenido -->
        <section class="p-8 mt-8 grid grid-cols-1 md:grid-cols-3 bg-gray-50 gap-6 text-black">
            <div class="text-center flex flex-col justify-center items-center">
                <h3 class="font-bold text-2xl">Comparte tus logros</h3>
                <IconTrophy class="size-12 my-4" />
                <p class="mt-2 text-lg">Publica tus avances y proyectos terminados. Celebra tus éxitos y recibe el
                    reconocimiento de la comunidad.</p>
            </div>
            <div class="text-center flex flex-col justify-center items-center border-x-2">
                <h3 class="font-bold text-2xl">Conecta con talentos</h3>
                <IconTextBubble class="size-12 my-4" />
                <p class="mt-2 text-lg">Conecta con desarrolladores y diseñadores. Descubre perfiles inspiradores y
                    colabora en proyectos.</p>
            </div>
            <div class="text-center flex flex-col justify-center items-center">
                <h3 class="font-bold text-2xl">Interactúa y crece</h3>
                <IconThumbsUp class="size-12 my-4" />
                <p class="mt-2 text-lg">Dale like y comenta publicaciones. Intercambia ideas y construye relaciones
                    en
                    la comunidad.</p>
            </div>
        </section>
    </LayoutVisitante>
</template>
