<template>
  <section class=''>
    <div class='container'>
      <div class="porfile mr-8 mt-8">
        <button @click="toggle">
          <img src="../assets/images/gojo cat.jpg" alt="">
        </button>
        <Popover ref="op">
            <div class="flex flex-col gap-4">
                <div>
                    <ul class="list-none p-0 m-0 flex flex-col">
                        <li v-for="member in config" :key="member.name" class="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer rounded-border" @click="selectConfig(config)">
                            <div>
                                <span class="font-medium">{{ member.name }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Popover>
        </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const op = ref();
const selectedConfig = ref(null);
const config = ref([
    { name: 'Mi perfil' },
    { name: 'Cerra sesión' }
]);

const toggle = (event: any) => {
    op.value.toggle(event);
}

const selectConfig = (config: any) => {
  selectedConfig.value = config;
    op.value.hide();
}
</script>

<style scoped>
.porfile{

img{
  width: 50px;
height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
}</style>
