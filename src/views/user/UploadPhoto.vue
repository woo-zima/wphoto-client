<template>
  <div class="photoUp">
    <div class="upContainer">
      <div class="upLeft">
        <el-upload
          ref="uploadFile"
          drag
          class="avatar-uploader"
          multiple
          :action="state.uploadUrl"
          :on-change="changFile"
          :auto-upload="false"
          accept="image/jpeg,image/gif,image/png,image/bmp"
          :data="state.uploadData"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
          :on-remove="loadRemove"
        >
          <el-icon class="el-icon--upload">
            <img src="@/assets/upload.svg" style="display: block; width: 100px; height: 100px" />
          </el-icon>
          <div class="el-upload__text">
            拖拽文件到这儿 or
            <em>点击此处</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">jpg/png 文件最大不能超过2MB</div>
          </template>
        </el-upload>
      </div>
      <div class="upRight">
        <el-form ref="uploadForm" :model="state.uploadMsgForm" :rules="rules" label-width="auto">
          <el-form-item prop="pname" label="作品标题">
            <el-input v-model="state.uploadMsgForm.pname" />
          </el-form-item>

          <el-form-item label="Tag" prop="tag">
            <el-checkbox-group v-model="state.uploadMsgForm.tag">
              <el-checkbox-button label="风景" name="type" />
              <el-checkbox-button label="动漫" name="type" />
              <el-checkbox-button label="暗" name="type" />
              <el-checkbox-button label="人物" name="type" />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit(uploadForm)">上传</el-button>
            <el-button @click="resetForm(uploadForm)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="previewP">
      <span @click="showPreview">UPLOAD PREVIEW</span>
    </div>
  </div>
  <DialogMain :dialogConfig="state.dialogConfig" />
</template>

<script setup>
import * as qiniu from 'qiniu-js';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { loginStore } from '../../store';
import { Mydebounce } from '@/modules/my-Tool/tools';

const store = loginStore();
const uploadForm = ref();
const uploadFile = ref();
let imgFileFlag = {};
const state = reactive({
  uploadUrl: 'http://up-as0.qiniup.com',
  uploadData: { key: '', token: '' },
  formAdd: { brandLogo: '' },
  config: {
    //    useCdnDomain: true,//cdn加速
    region: qiniu.region.as0, //区域
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
    pname: '',
    tag: [],
  },
  dialogConfig: {
    showDialog: false,
    dialogItem: {
      uptime: '',
      pname: '',
      previewSrc: '',
    },
    preview: false,
  },
  previewSrc: '',
});
const $api = inject('$api');
const rules = reactive({
  pname: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
  tag: [{ required: true, message: '请选择Tag', trigger: 'blur' }],
});
onMounted(() => {
  getToken();
});

async function getToken() {
  const { data } = await $api.user.getQiNiuToken();
  if (data) {
    // console.log(data);
    state.uploadData.token = data.data.uploadToken;
  }
}

const changFile = (file, fileList) => {
  console.log(file, fileList);
  createReader(file.raw);
  const isPNG = file.raw.type === 'image/png';
  const isJPEG = file.raw.type === 'image/jpeg';
  const isJPG = file.raw.type === 'image/jpg';
  const isLt2M = file.raw.size / 1024 / 1024 < 2;
  if (!isPNG && !isJPEG && !isJPG) {
    ElMessage({
      showClose: true,
      message: '上传头像图片只能是 jpg、png、jpeg 格式!',
      type: 'error',
    });
    return false;
  }
  if (!isLt2M) {
    ElMessage({
      showClose: true,
      message: '上传头像图片大小不能超过 2MB!',
      type: 'error',
    });
    return false;
  }
  if (fileList.length > 5) {
    ElMessage({
      showClose: true,
      message: '上传文件最大数量为5!',
      type: 'error',
    });
    return false;
  }
  imgFileFlag = file;
  console.log(uploadFile);
};
const handleAvatarSuccess = (res, file, fileList) => {
  console.log('上传成功', res, file, fileList);
  resetForm('uploadForm');
};

const beforeAvatarUpload = file => {
  console.log('before', file, typeof file);
  // createReader(file);

  const observable = qiniu.upload(
    file,
    null,
    state.uploadData.token,
    {
      fname: file.name,
      params: {},
      mimeType: null,
    },
    state.config
  );
  observable.subscribe({
    next(res) {
      console.log('next', res);
    },
    error(err) {
      ElMessage({
        showClose: true,
        message: err,
        type: 'error',
      });
      return;
    },
    complete(res) {
      //成功
      console.log('qiniu upload success');
      uploadPhoto(file, res);
    },
  });
  // imgFile.value = file;

  // this.uploadData.key = `upload_pic_${new Date().getTime()}_${file.name}`;
};

const createReader = function (file) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let image = new Image();
    image.onload = function () {
      state.uploadFormData.pwidth = this.width;
      state.uploadFormData.pheight = this.height;
    };
    image.src = e.target.result;
    state.previewSrc = e.target.result;
  };
  reader.readAsDataURL(file);
};

const uploadPhoto = async (file, res) => {
  console.log(file, res);
  state.uploadFormData.psize = file.size;
  state.uploadFormData.pname = state.uploadMsgForm.pname;
  state.uploadFormData.pdescribe = state.uploadMsgForm.tag.join(' ');
  state.uploadFormData.purl = res.key;
  console.log(state.uploadFormData);

  const Upres = await $api.photo.addPhoto(state.uploadFormData);
  if (Upres.status === 200) {
    ElMessage({
      showClose: true,
      message: '上传成功',
      type: 'success',
    });
  } else {
    ElMessage({
      showClose: true,
      message: Upres.data.message,
      type: 'error',
    });
  }
};

const uploadError = (err, file, fileList) => {
  console.log(err);
};
const onSubmit = Mydebounce(Form => {
  if (!Form) return;
  if (Object.keys(imgFileFlag).length === 0) {
    ElMessage({
      showClose: true,
      message: '还未选择图片！',
      type: 'error',
    });
    return;
  }
  Form.validate(valid => {
    if (valid) {
      uploadFile.value.submit();
      // console.log(state.uploadMsgForm);
    } else {
      return false;
    }
  });
});
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
};
const showPreview = () => {
  if (state.previewSrc === '') {
    ElMessage({
      showClose: true,
      message: '请选择图片再预览',
      type: 'info',
    });
    return;
  }

  state.dialogConfig.showDialog = true;
  state.dialogConfig.dialogItem.pname = state.uploadMsgForm.pname;
  state.dialogConfig.dialogItem.previewSrc = state.previewSrc;
};
const loadRemove = file => {
  imgFileFlag = {};
  state.previewSrc = '';
};
</script>

<style scoped>
.photoUp {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  gap: 20px;
  border-radius: 10px;
  overflow: hidden;
}
.photoUp .upContainer,
.photoUp .previewP {
  flex: 1;
  padding: 0 10px;
  margin: 10px 0;
}
.previewP span {
  cursor: pointer;
}
.upLeft {
  flex: 1;
}

.upRight {
  margin-top: 50px;
  flex: 1;
}

@media screen and (max-width: 730px) {
  .photoUp {
    flex-direction: column;
  }
}
</style>
