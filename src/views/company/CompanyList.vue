<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit="handleSearch" :form="searchForm">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="企业名称">
              <a-input placeholder="企业名称" v-decorator="['name', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
    </div>
    <s-table ref="table" :row-key="record => record.id" :columns="columns" :data="loadData">
      <span slot="effective_time" slot-scope="text, record">
        {{ (record.start_time * 1000) | DateFormat('YYYY-MM-DD') }} ～
        {{ (record.end_time * 1000) | DateFormat('YYYY-MM-DD') }}
      </span>
      <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="userManage(record)">用户管理</a>
        <a-divider type="vertical" />
        <a @click="examManage(record)">测评管理</a>
        <a-divider type="vertical" />
        <a @click="courseManage(record)">网课管理</a>
        <a-divider type="vertical" />
        <a @click="importUser(record)">导入用户</a>
      </span>
    </s-table>

    <a-modal :title="modal_title" :width="800" v-model="visible" @ok="handleOk">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司名称">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写公司名称' }], initialValue: mdl.name }]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="使用周期">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
            v-decorator="[
              'effective_time',
              {
                rules: [{ type: 'array', required: true, message: '请选择时间!' }],
                initialValue: mdl.effective_time
              }
            ]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司联系电话">
          <a-input v-decorator="['phone', { rules: [], initialValue: mdl.phone }]" />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司地址">
          <a-input v-decorator="['address', { rules: [], initialValue: mdl.address }]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal title="测评管理" :width="800" v-model="examVisible" @ok="addExams">
      <a-transfer
        :data-source="exams"
        show-search
        :list-style="{
          width: '250px',
          height: '300px'
        }"
        :titles="['可选测评', '已选测评']"
        :operations="['加入右侧 ', '加入左侧']"
        :target-keys="targetExams"
        :render="item => item.title"
        @change="handleChangeExam"
      >
        <span slot="notFoundContent">
          没数据
        </span>
      </a-transfer>
    </a-modal>

    <a-modal title="网课管理" :width="800" v-model="courseVisible" @ok="addCourses">
      <a-transfer
        :data-source="courses"
        show-search
        :list-style="{
          width: '250px',
          height: '300px'
        }"
        :titles="['可选网课', '已选网课']"
        :operations="['加入右侧 ', '加入左侧']"
        :target-keys="targetCourses"
        :render="item => item.title"
        @change="handleChangeCourse"
      >
        <span slot="notFoundContent">
          没数据
        </span>
      </a-transfer>
    </a-modal>

    <a-modal title="导入用户" :width="800" v-model="importVisible" @ok="handleImport">
      <a-form :form="importForm">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="">
          <a-upload
            name="file"
            :action="upload_url"
            :headers="headers"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            :disabled="fileList.length > 0"
            accept=".xlsx,.xls"
          >
            <a-button> <a-icon type="upload" /> 选择文件 </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  getCompanyList,
  addCompany,
  updateCompany,
  getExamList,
  getCourseList,
  addExams,
  addCourses
} from '@/api/company'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

export default {
  name: 'CompanyList',
  components: {
    STable
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this),
      modal_title: '添加企业',
      mdl: {},
      // 查询参数
      searchForm: this.$form.createForm(this),
      queryParam: {},
      // 表头
      columns: [
        {
          title: '企业名称',
          dataIndex: 'name'
        },
        {
          title: '测评数量',
          dataIndex: 'exam_num'
        },
        {
          title: '网课数量',
          dataIndex: 'course_num'
        },
        {
          title: '用户数量',
          dataIndex: 'user_num'
        },
        {
          title: '使用周期',
          key: 'effective_time',
          scopedSlots: { customRender: 'effective_time' }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'create_time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getCompanyList(Object.assign(params, this.queryParam)).then(res => {
          return res.data
        })
      },
      examVisible: false, // 测评管理
      exams: [], // 所有测评
      targetExams: [], // 选择的测评
      selectedExams: [],
      courseVisible: false, // 测评管理
      courses: [],
      targetCourses: [],
      importForm: this.$form.createForm(this),
      importVisible: false,
      headers: {
        Authorization: `Bearer ${this.$ls.get(ACCESS_TOKEN)}`
      },
      fileList: [],
      uploading: false,
      upload_url: ''
    }
  },
  mounted() {
    this.getExamList()
    this.getCourseList()
  },
  methods: {
    getExamList() {
      getExamList().then(res => {
        this.exams = res.data.map(item => {
          return {
            key: item.eid.toString(),
            title: item.title
          }
        })
      })
    },
    getCourseList() {
      getCourseList().then(res => {
        this.courses = res.data.map(item => {
          return {
            key: item.cid.toString(),
            title: item.title
          }
        })
      })
    },
    handleChangeExam(targetKeys) {
      this.targetExams = targetKeys
    },
    handleChangeCourse(targetKeys) {
      this.targetCourses = targetKeys
    },
    handleSearch(e) {
      e.preventDefault()
      this.queryParam = {
        filter: {
          name: this.searchForm.getFieldValue('name')
        }
      }
      this.$refs.table.refresh()
    },
    handleReset() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    handleAdd() {
      this.mdl = {
        id: undefined,
        name: '',
        user_num: 0,
        start_time: 0, // 开始时间
        end_time: 0
      }
      this.visible = true
    },
    handleOk(e) {
      e.preventDefault()
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        const effective_time = fieldsValue['effective_time']
        delete fieldsValue['effective_time']

        const values = {
          ...fieldsValue,
          start_time: effective_time[0].unix(),
          end_time: effective_time[1].unix()
        }
        if (this.mdl.id) {
          updateCompany(this.mdl.id, values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.visible = false
              this.$message.success('修改成功')
            }
          })
        } else {
          addCompany(values).then(res => {
            if (res.code === 0) {
              this.$refs.table.refresh()
              this.form.resetFields()
              this.visible = false
              this.$message.success('添加成功')
            }
          })
        }
      })
    },
    handleEdit(record) {
      this.modal_title = '修改企业'
      this.mdl = Object.assign({}, record)
      this.mdl.effective_time = [moment.unix(this.mdl.start_time), moment.unix(this.mdl.end_time)]
      this.visible = true
    },
    userManage(row) {
      this.$router.push({ name: 'CompanyUserList', params: { id: row.id } })
    },
    examManage(row) {
      this.mdl = Object.assign({}, row)
      this.targetExams = row.exams.map(item => item.eid.toString())
      this.examVisible = true
    },
    courseManage(row) {
      this.mdl = Object.assign({}, row)
      this.targetCourses = row.courses.map(item => item.cid.toString())
      this.courseVisible = true
    },
    addExams() {
      addExams(this.mdl.id, this.targetExams).then(() => {
        this.$message.success('成功')
        this.$refs.table.refresh()
        this.mdl = {}
        this.examVisible = false
      })
    },
    addCourses() {
      addCourses(this.mdl.id, this.targetCourses).then(() => {
        this.$message.success('成功')
        this.$refs.table.refresh()
        this.mdl = {}
        this.courseVisible = false
      })
    },
    importUser(row) {
      this.mdl = Object.assign({}, row)
      this.upload_url = `/companies/${this.mdl.id}/users`
      this.importVisible = true
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleImport(e) {
      e.preventDefault()
      let vm = this
      vm.importForm.validateFields((err, values) => {
        vm.uploading = true
        const formData = new FormData()
        vm.fileList.forEach(file => {
          formData.append('file', file)
        })
        vm.$http({
          url: `/companies/${vm.mdl.id}/users`,
          method: 'post',
          data: formData
        })
          .then(() => {
            vm.uploading = false
            vm.$refs.table.refresh()
            vm.importForm.resetFields()
            vm.importVisible = false
            vm.mdl = {}
            vm.$message.success('提交成功')
          })
          .catch(() => {
            vm.uploading = false
            vm.importForm.resetFields()
            vm.importVisible = false
            vm.mdl = {}
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
