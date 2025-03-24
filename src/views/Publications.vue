<template>
  <section class='m-section-new'>
    <NewPublications/>
    <CardPublications/>
  </section>
</template>
<script lang="ts" setup>
import CardPublications from '@/components/CardPublications.vue';
import NewPublications from '@/components/NewPublications.vue';

</script>

<style scoped>
section{
  padding-left: 335px;
}
</style>
