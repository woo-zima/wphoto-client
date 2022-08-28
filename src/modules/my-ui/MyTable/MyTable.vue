<template>
    <table border="1" class="my-table">
        <thead>
            <tr>
                <th v-for="info of tHead" :key="info.key">
                    {{ info.text }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(info, index) of tBody" :key="info.id">
                <td v-for="(value, key) in info" :key="key" @click.stop="showEditInput($event, index, key)">
                    {{ value }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { createApp, toRefs, reactive } from "vue"
import EditInput from './EditInput.vue';

let editInputApp = null;
const state = reactive({
    key: '',
    value: '',
    index: 0,
    text: ''
})
const props = defineProps({
    data: {
        type: Object,
        default: () => ({
            tHead: [],
            tBody: []
        })
    }
})
const emit = defineEmits(['submit'])
const { tHead, tBody } = toRefs(props.data)

const showEditInput = function (event, index, key) {
    editInputApp && removeEditInputApp(editInputApp);

    if (!cheackEditable(key)) return
    const target = event.target;
    const oFrag = document.createDocumentFragment();
    editInputApp = createApp(EditInput, {
        value: target.textContent,
        setValue
    })
    if (editInputApp) {
        editInputApp.mount(oFrag);
        target.appendChild(oFrag);
        target.querySelector('.my-table-edit-input').select()
    }
    setData({ key, index, text: findText(key) })
}
const setData = ({ key, index, text, value = '' }) => {
    state.key = key;
    state.index = index;
    state.text = text;
}
const setValue = function (value) {
    state.value = value
    emit('submit', { ...state }, removeEditInputApp);
}
const removeEditInputApp = () => {
    editInputApp && editInputApp.unmount();
}

const cheackEditable = function (key) {
    const { editable } = tHead.value.find(item => item.key === key);
    return editable;
}
const findText = function (key) {
    const { text } = tHead.value.find(item => item.key === key);
    console.log(text);
    return text;
}
window.addEventListener('click', removeEditInputApp(), false)
</script>

<style scoped>
.my-table {
    width: 100%;
    border-collapse: collapse;
}

tr {
    height: 44px;
}

td {
    position: relative;
    text-align: center;
    cursor: pointer;
}
</style>