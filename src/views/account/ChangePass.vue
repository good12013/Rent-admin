<template>
  <div class="box">
    <a-row type="flex" justify="center" align="middle">
      <a-col :span="12">
        <a-form :form="form">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="原密码">
            <a-input
              size="large"
              type="password"
              placeholder="原密码"
              v-decorator="[
                'old_password',
                { rules: [{ required: true, message: '请输入原密码' }], validateTrigger: ['change', 'blur'] }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="密码">
            <a-input
              size="large"
              type="password"
              placeholder="6-20位，只包括字母和数字，区分大小写"
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '6-20位，只包括字母和数字，区分大小写',
                      pattern: /^[a-zA-Z0-9]{6,20}$/,
                      min: 6,
                      max: 20
                    }
                  ],
                  validateTrigger: ['change', 'blur']
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="确认密码">
            <a-input
              size="large"
              type="password"
              placeholder="确认密码"
              v-decorator="[
                'password2',
                {
                  rules: [
                    {
                      required: true,
                      message: '6-20位，只包括字母和数字，区分大小写',
                      pattern: /^[a-zA-Z0-9]{6,20}$/,
                      min: 6,
                      max: 20
                    },
                    { validator: this.compareToFirstPassword }
                  ],
                  validateTrigger: ['change', 'blur']
                }
              ]"
            >
            </a-input>
          </a-form-item>
          <a-form-item class="center">
            <a-button size="large" type="primary" html-type="submit" @click.stop.prevent="handleSubmit">
              修改
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { modifyPassword } from '@/api/auth'
export default {
  name: 'ChangePass',
  components: {},
  data() {
    return {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    compareToFirstPassword(rule, value, callback) {
      let password = this.form.getFieldValue('password')
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            old_password: values.old_password,
            password: values.password
          }
          modifyPassword(params).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功')
              this.form.resetFields()
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.box {
  margin-top: 50px;
}
.center {
  text-align: center;
}
</style>
