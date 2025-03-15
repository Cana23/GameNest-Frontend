<script setup lang="ts">
import IconTextBubble from '@/components/icons/IconTextBubble.vue';
import IconThumbsUp from '@/components/icons/IconThumbsUp.vue';
import IconTrophy from '@/components/icons/IconTrophy.vue';
</script>

<template>
    <div class="flex flex-col h-screen overflow-hidden">
        <!-- Header fijo -->
        <header
            class="fixed bg-gray-50 top-0 w-full shadow-md z-50 p-4 flex justify-between items-center border-b-black">
            <h1 class="text-xl font-bold">GameNest</h1>
            <div>
                <button class="border border-purple-500 text-purple-500 px-4 py-2 rounded-lg">Inicia sesión</button>
                <button class="bg-purple-600 text-white px-4 py-2 rounded-lg ml-2">Regístrate</button>
            </div>
        </header>

        <!-- Contenido desplazable -->
        <main class="flex-1 overflow-y-auto mt-16">
            <!-- Sección principal -->
            <section class="h-[80%] justify-center items-center bg-gradient-to-r from-gray-900 to-black text-white text-center px-16">
                <div class="grid grid-flow-col grid-rows-2 gap-8 pt-6">
                    <div class="px-8 row-span-3 flex justify-center items-center">
                        <img src="../assets/images/login/image1.png" alt="Mascota" class="" />
                    </div>
                    <div class="flex justify-center items-center pl-8">
                        <h2 class="tracking-wide text-8xl text-left font-semibold m-4 mt-8">Donde las
                            ideas toman vida</h2>
                    </div>
                    <div class="text-4xl text-left pl-8">
                        <h2 class="tracking-wide m-4 mt-8">El hogar de los desarrolladores
                            de videojuegos en
                            Latinoamérica</h2>
                        <div class="grid place-items-center">
                            <button
                                class="flex justify-center mt-8 bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Regístrate
                                hoy</button>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </section>


            <!-- Mas contenido -->
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

        </main>
        <!-- Footer -->
        <footer class="bg-gray-300 text-center text-black py-4">
            <p>&copy; 2025 GameNest</p>
        </footer>
    </div>
</template>