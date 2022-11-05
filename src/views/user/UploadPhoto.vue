<template>
  <div id="load-content">
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
      </div>
      <div class="previewP">
        <div class="upRight setP">
          <el-form ref="uploadForm" :model="state.uploadMsgForm" :rules="rules" label-width="auto">
            <el-form-item prop="pname" label="作品标题">
              <el-input
                v-model="state.uploadMsgForm.pname"
                clearable
                class="P_input"
                size="large"
                placeholder="Please Input"
              />
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
        <div class="setP">
          <span class="preview" @click="showPreview">查看预览</span>
          <span class="preview" @click="showPreview">保存为草稿</span>
        </div>
      </div>
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
#load-content {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: calc(100vh - 120px);
  padding-bottom: 20px;
}
.photoUp {
  max-width: 100%;
  display: flex;
  justify-content: center;
  margin: 30px;
}
.photoUp .upContainer {
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  min-width: 350px;
  background: #fff;
  box-shadow: 0 1px 5px #c7c7c7;
  min-height: calc(100vh - 55px - 60px);
  width: 100%;
  z-index: 1;
}
.previewP {
  height: 100%;
  margin-left: 20px;
  min-width: 240px;
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  width: 240px;
}
.previewP .setP {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 5px #c7c7c7;
  display: -webkit-box;
  display: flex;
  flex-basis: 100%;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row wrap;
  padding: 20px 15px 10px;
}

.previewP span {
  cursor: pointer;
}
.upContainer .upLeft {
  padding: 0 7.1%;
}
.previewP .preview {
  padding: 4px 8px;
  margin-left: 5px;
  border: 1px solid;
  border-radius: 4px;
  color: #fff;
  background-color: #202d40;
}

.upRight {
  margin-top: 50px;
}
.upRight .P_input {
  min-width: 100px;
}

@media screen and (max-width: 730px) {
  .upRight .P_input {
    /* width: 50%; */
  }
}
@media screen and (max-width: 500px) {
  .previewP {
    min-width: 180px;
  }
}
</style>
