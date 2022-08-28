<template>
    <input type="text" class="my-table-edit-input" :value="value" @input="onInput" @blur="onBlur" @click="onClick" />

</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    setValue: {
        type: Function,
        default: () => { }
    }
})
const inputValue = ref(props.value)

const onInput = (e) => {
    console.log("inout");
    inputValue.value = e.target.value.trim();
}
const onBlur = (e) => {
    console.log("onBlur");
    props.setValue(inputValue.value)
}
const onClick = (e) => {
    e.stoppropagation();
}

</script>

<style scoped>
.my-table-edit-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #acb;
    text-align: center;
    outline: none;

}
</style>