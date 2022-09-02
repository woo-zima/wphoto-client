<template>
    <div class="Means">
        <button @click="toBack">BACK</button>
        follow Up
    </div>
</template>

<script setup>
import { inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const $api = inject('$api');
const route = useRoute();
const router = useRouter();


onMounted(() => {
    console.log(route.params);
})
const toBack = () => {
    router.go(-1)
}
</script>

<style scoped>
</style>