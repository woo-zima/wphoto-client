<template>
    <div class="detail">
        <el-dialog v-model="dialogMainVisible" title="Main">
            <div class="leftphoto">
                <p>{{ Routeid }}</p>

            </div>
            <div class="authDetail">

            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const dialogMainVisible = ref(true)
const Route = useRoute();
const Routeid = computed(() => {
    return Route.query.id
})

</script>

<style scoped>
</style>