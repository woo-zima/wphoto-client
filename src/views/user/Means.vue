<template>
    <div class="Means">
        <div class="leftBack">
            <button @click="toBack">BACK</button>
        </div>
        <div class="rightContainer">
            <div class="authMsg">
                <div class="avatarImg">
                    <el-avatar> A</el-avatar>
                </div>
                <div class="msgMain">
                    <h2>zmrin</h2>
                </div>
            </div>

            <div class="upList">
                <div class="listTitle">上传作品</div>
                <ul class="listBox" v-if="state.upLists != []">
                    <li class="boxItem" v-for="item in state.upLists">
                        <img :src="'http://wphoto.top/' + item.purl" alt="">
                    </li>
                </ul>
                <div v-else>
                    暂无作品
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const $api = inject('$api');
const route = useRoute();
const router = useRouter();
const state = reactive({
    upLists: []
})

onMounted(() => {
    getUpLists()
    console.log(route.params);
})
const getUpLists = async () => {
    const query = { upid: route.params.uid }
    const res = await $api.photo.getUpPhotos(query)
    if (res) {
        state.upLists = res.data;
        console.log(res);
    }
}
const toBack = () => {
    router.go(-1)
}
</script>

<style scoped>
.Means {
    position: relative;
}

.Means .leftBack {
    width: 300px;
}

.Means .leftBack button {
    border: 1px solid #abc;
    background-color: #fff;
    padding: 5px 15px;
    margin-left: 15px;
    border-radius: 10px;
    cursor: pointer;
}

.Means .leftBack button:hover {
    border: 1px solid #EB5757;
}

.Means .rightContainer {
    padding-top: 10px;
}

.rightContainer .authMsg {
    margin-left: 150px;
    display: flex;
    gap: 25px;

}

.authMsg .avatarImg {
    padding: 10px;
}

.avatarImg .el-avatar {
    --el-avatar-size: 100px
}

.authMsg .msgMain {
    flex: 4;
}

.upList .listTitle {
    text-align: center;
    font-size: 17px;
    padding: 3px 0;
}

.upList .listBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
    margin: 0 auto;
    width: 1225px;
    padding: 0;
}

.listBox .boxItem {
    width: 300px;
    height: 300px;
}

.listBox .boxItem img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>