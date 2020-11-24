<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-card class="card" title="基本信息" :bordered="false">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名">
          {{ userInfo.username }}
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="角色">
          {{ userInfo.role | roleFilter }}
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="真实姓名">
          <template v-if="isEdit">
            <a-input placeholder="真实姓名" v-decorator="['real_name', { initialValue: userInfo.real_name }]">
            </a-input>
          </template>
          <template v-else>{{ userInfo.real_name }}</template>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系方式">
          <template v-if="isEdit">
            <a-input placeholder="联系方式" v-decorator="['real_name', { initialValue: userInfo.phone_number }]">
            </a-input>
          </template>
          <template v-else>{{ userInfo.phone_number }}</template>
        </a-form-item>
        <a-form-item class="center">
          <a-button v-if="!isEdit" @click="() => (isEdit = true)">编辑</a-button>
          <a-button v-if="isEdit" type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Center',
  data() {
    return {
      labelCol: { xs: { span: 12 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
      form: this.$form.createForm(this),
      isEdit: false
    }
  },
  filters: {
    roleFilter(role) {
      const roles = {
        super: '超级管理员',
        admin: '管理员',
        manager: '分店管理员'
      }
      return roles[role]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(['UpdateInfo']),
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        const params = {
          id: this.userInfo.id,
          real_name: values.real_name,
          phone_number: values.phone_number
        }
        this.UpdateInfo(params).then(() => {
          this.$message.success('更新成功')
          this.isEdit = false
        })
      })
    }
  }
}
</script>
