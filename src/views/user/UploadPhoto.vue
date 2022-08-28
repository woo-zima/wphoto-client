<template>
    <div class="photoUp">
        <div class="upLeft">
            <el-upload drag class="avatar-uploader" multiple :action="state.uploadUrl"
                accept="image/jpeg,image/gif,image/png,image/bmp" :data='state.uploadData'
                :on-success="handleAvatarSuccess" :on-error="uploadError" :before-upload="beforeAvatarUpload">
                <el-icon class="el-icon--upload">
                    <img src="../../assets/upload.svg" style="display:block;width:100px;height:100px">
                </el-icon>
                <div class="el-upload__text">
                    拖拽文件到这儿 or <em>点击此处</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        jpg/png 文件最大不能超过2MB
                    </div>
                </template>
            </el-upload>
        </div>
        <div class="upRight">
            <el-form ref="uploadForm" :model="state.uploadFormData" :rules="rules" label-width="auto">
                <el-form-item prop="pname" label="作品标题">
                    <el-input v-model="state.uploadFormData.pname" />
                </el-form-item>


                <el-form-item label="Tag" prop="pdescribe">
                    <el-checkbox-group v-model="state.uploadFormData.pdescribe">
                        <el-checkbox-button label="a" name="type" />
                        <el-checkbox-button label="b" name="type" />
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit(Form)">上传</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script setup>
import * as qiniu from 'qiniu-js'
import { inject, onMounted, reactive, ref } from 'vue'
import { loginStore } from '../../store';
import { checkName } from '@/modules/my-Tool/ruleForm';

const store = loginStore()
const uploadForm = ref()
const state = reactive({
    uploadUrl: 'http://wphoto.top',
    uploadData: { key: '', token: '' },
    formAdd: { brandLogo: '' },
    config: {
        //    useCdnDomain: true,//cdn加速
        region: qiniu.region.as0 //区域
    },
    uploadFormData: {
        upid: store.userDeail.uid,
        psize: 0,
        pname: '',
        pdescribe: [],
        pwidth: 0,
        pheight: 0,
        uptime: new Date(),
        purl: '',
    },
    uploadMsgForm: {
        name: '',
        tag: [],
    }
})
const $api = inject('$api');
const rules = reactive({
    pname: [{ validator: checkName, trigger: 'blur' }],
    pdescribe: [{ validator: validatePass, trigger: 'blur' }],
})
onMounted(() => {
    getToken()
})
async function getToken() {
    const { data } = await $api.user.getQiNiuToken();
    if (data) {
        console.log(data);
        state.uploadData.token = data.data.uploadToken
    }
}

const handleAvatarSuccess = (res, file, fileList) => {
    console.log('上传成功', res, file, fileList)
    let hash = res.hash;
    let key = res.key;
    // if (this.editState) {
    //     this.mainInfo.brandLogo = qiniuConfig.qiniuPath + '/' + key;
    // } else {
    //     this.formAdd.brandLogo = qiniuConfig.qiniuPath + '/' + key;
    // }
}

const beforeAvatarUpload = (file) => {
    // console.log(file, 'beforeAvatarUpload')
    const isPNG = file.type === "image/png";
    const isJPEG = file.type === "image/jpeg";
    const isJPG = file.type === "image/jpg";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error("上传头像图片只能是 jpg、png、jpeg 格式!");
        return false;
    }
    if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
    }
    createReader(file);
    const observable = qiniu.upload(file, null, state.uploadData.token, {
        fname: file.name,
        params: {}, mimeType: null
    }, state.config);
    observable.subscribe({
        next(res) {
            console.log('next', res)
        },
        error(err) {
            console.log('err', err)
        },
        complete(res) {//成功
            ElMessage({
                showClose: true,
                message: 'Upload Success',
                type: 'success',
            })
            uploadPhoto(file, res);
        }
    })

    // this.uploadData.key = `upload_pic_${new Date().getTime()}_${file.name}`;
}

const createReader = function (file) {
    let reader = new FileReader;
    reader.onload = function (evt) {
        let image = new Image();
        image.onload = function () {
            state.uploadFormData.pwidth = this.width;
            state.uploadFormData.pheight = this.height;
        };
        image.src = evt.target.result;
    };
    reader.readAsDataURL(file);
}

const uploadPhoto = async (file, res) => {
    console.log(file, res);
    state.uploadFormData.psize = file.size;
    state.uploadFormData.pname = file.name;
    state.uploadFormData.purl = res.key;
    console.log(state.uploadFormData);

    const { data } = await $api.photo.addPhoto(state.uploadFormData);
    if (data) {
        console.log('上传成功！');
    }

}

const uploadError = (err, file, fileList) => {
    ElMessage({
        showClose: true,
        message: 'upload error.',
        type: 'error',
    })
}
const onSubmit = (Form) => {
    console.log('submit!')
    if (!Form) return
    Form.validate((valid) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}
</script>

<style scoped>
.photoUp {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 10px;
    overflow: hidden;
}

.upLeft {
    flex: 1;
}

.upRight {
    flex: 1;
}
</style>