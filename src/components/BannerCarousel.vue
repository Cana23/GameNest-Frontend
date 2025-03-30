<template>
  <div class="banner-container relative overflow-hidden h-74 w-[calc(100%-16rem)] ml-64 mb-8 rounded-xl">
    <img
      src="@/assets/images/Neon.jpg"
      alt="Banner GameNest"
      class="absolute inset-0 w-full h-full object-cover opacity-90 rounded-xl"
    >

    <div
      class="carousel-container absolute inset-0 flex items-center overflow-x-hidden scroll-smooth"
      @scroll="handleScroll"
      ref="carousel"
    >
      <div
        v-for="(phrase, index) in phrases"
        :key="index"
        class="carousel-slide flex-shrink-0 w-full h-full flex flex-col justify-center items-center px-8 snap-start"
      >
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 text-center">{{ phrase.title }}</h2>
        <p class="text-xl text-gray-200 text-center max-w-2xl">{{ phrase.description }}</p>
      </div>
    </div>

    <!-- Indicadores de posición -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in phrases"
        :key="'indicator-'+index"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all"
        :class="{
          'bg-white w-6': currentVisibleIndex === index,
          'bg-white bg-opacity-50': currentVisibleIndex !== index
        }"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const phrases = ref([
  {
    title: "Crea, Comparte, Inspira",
    description: "Únete a la comunidad de desarrolladores más apasionada"
  },
  {
    title: "Game Development",
    description: "Comparte tus proyectos independientes y encuentra colaboradores"
  },
  {
    title: "Aprende y Crece",
    description: "Descubre tutoriales y recursos para mejorar tus habilidades"
  },
  {
    title: "Feedback Valioso",
    description: "Recibe comentarios constructivos de otros desarrolladores"
  }
]);

const currentVisibleIndex = ref(0);
const carousel = ref<HTMLElement | null>(null);
let interval: number;
let resizeObserver: ResizeObserver;

const goToSlide = (index: number) => {
  if (!carousel.value) return;

  currentVisibleIndex.value = index;
  const slideWidth = carousel.value.clientWidth;
  carousel.value.scrollTo({
    left: index * slideWidth,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
  if (!carousel.value) return;

  const slideWidth = carousel.value.clientWidth;
  const scrollPosition = carousel.value.scrollLeft;
  currentVisibleIndex.value = Math.round(scrollPosition / slideWidth);
};

const startCarousel = () => {
  interval = setInterval(() => {
    const nextIndex = (currentVisibleIndex.value + 1) % phrases.value.length;
    goToSlide(nextIndex);
  }, 5000);
};

const setupResizeObserver = () => {
  if (!carousel.value) return;

  resizeObserver = new ResizeObserver(() => {
    goToSlide(currentVisibleIndex.value);
  });

  resizeObserver.observe(carousel.value);
};

onMounted(() => {
  startCarousel();
  setupResizeObserver();
});

onBeforeUnmount(() => {
  clearInterval(interval);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
.banner-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: margin-left 0.3s, width 0.3s;
}

.aside-collapsed .banner-container {
  width: calc(100% - 5rem);
  margin-left: 5rem;
}

.carousel-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-slide {
  scroll-snap-stop: always;
}
</style>
