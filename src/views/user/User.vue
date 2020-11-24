<template>
  <a-card :bordered="false">
    <description-list title="基本情况" :col="2" size="default">
      <description-list-item term="婚恋状态">{{ user.marriage_status | MarriageStatusFilter }}</description-list-item>
      <description-list-item term="职业状态">{{ user.job_status | JobFilter }}</description-list-item>
    </description-list>
    <a-divider style="margin-bottom: 32px" />
    <description-list title="使用情况" :col="2" size="default">
      <description-list-item term="文章">在app内阅读了{{ user.read_article_num }}篇文章</description-list-item>
      <description-list-item term="课程">在app内已参与{{ user.course_num }}门课程</description-list-item>
      <description-list-item term="测评">在app内已参与{{ user.exam_num }}项测评</description-list-item>
      <description-list-item term="正念训练">在app内进行了{{ user.train_num }}次训练</description-list-item>
      <description-list-item term="种树">在app内种了{{ user.plant_tree_num }}棵树</description-list-item>
      <description-list-item term="砸东西">在app内砸东西释放了{{ user.break_num }}次</description-list-item>
      <description-list-item term="呐喊">您在app内呐喊释放了{{ user.shout_num }}次</description-list-item>
    </description-list>
    <a-divider style="margin-bottom: 32px" />
    <a-card title="心理健康报告" :bordered="false">
      <a-button slot="extra" type="primary" @click="handleReport">{{ user.report ? '编辑报告' : '创建报告' }}</a-button>
      <div v-if="user.report" class="user-report" v-html="user.report"></div>
      <div v-else class="user-report" style="text-align:center">未创建报告</div>
    </a-card>

    <a-modal title="编辑报告" :width="800" v-model="visible" @ok="handleOk">
      <ueditor v-model="content"></ueditor>
    </a-modal>
  </a-card>
</template>

<script>
import Ueditor from '@/components/UEditor'
import { getUser, updateUser } from '@/api/user'
import router from '@/router'
import { DescriptionList } from '@/components'
const DescriptionListItem = DescriptionList.Item

export default {
  name: 'User',
  components: {
    Ueditor,
    DescriptionList,
    DescriptionListItem
  },
  data() {
    return {
      user: {},
      visible: false,
      form: this.$form.createForm(this),
      report: ''
    }
  },
  filters: {
    MarriageStatusFilter: function(value) {
      const status = ['未知', '主动单身', '单身', '单向恋', '关系中', '失恋/丧偶/离异', '出轨中', 'LGBT']
      return status[value]
    },
    JobFilter: function(value) {
      const status = ['未知', '想跳槽', '待业中', '就业中', '自由职业']
      return status[value]
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUser(this.$route.params.id)
        .then(res => {
          this.user = res.data
        })
        .catch(err => {
          console.log(err)
          router.push({ name: 'UserList' })
        })
    },
    handleReport() {
      this.report = this.user.report
      this.visible = true
    },
    handleOk() {
      let vm = this
      let report = vm.report.trim()
      if (report.length == 0) {
        vm.$message.error('报告不能为空')
      }
      updateUser(vm.user.uid, { report })
        .then(res => {
          vm.user = res.data
          vm.report = ''
          vm.visible = false
          vm.$message.success('提交成功')
        })
        .catch(() => {})
    },
    handleCancel() {
      this.report = ''
      this.visible = false
    }
  },
  watch: {
    $route() {
      this.getUser()
    }
  }
}
</script>

<style lang="less" scoped>
.user-repoar {
  min-height: 200px;
}
</style>
