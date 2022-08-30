const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入昵称'));
  }
  setTimeout(() => {
    if (value.lenght > 10) {
      callback(new Error('昵称长度不能超过10'));
    } else {
      callback();
    }
  }, 1000);
};

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
};
const checkCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入验证码'));
  } else {
    callback();
  }
};

export { checkName, validatePass, resetForm, checkCode };
