<template>
  <div class="app-container">
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="用户电话">
            <el-input  placeholder="输入用户电话"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
            <el-form-item>
                <el-date-picker  type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" >查询</el-button>
        </el-form-item>
    </el-form>

    <div class="btn-box">
        <el-button type="danger">批量删除</el-button>
        <el-button type="warning">批量禁用</el-button>
        <el-button type="success">批量启用</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="ID" prop="id" width="200"></el-table-column>
      <el-table-column align="center" label="用户名称" prop="name"></el-table-column>
      <el-table-column align="center" label="注册时间" prop="time"></el-table-column>
      <el-table-column align="center" label="注册IP" prop="ip"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag size="medium">正常</el-tag>
          <el-tag size="medium" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="small" >禁用</el-button>
          <el-button type="success" size="small" >启用</el-button>
          <el-button type="danger" size="small" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
        </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList:[
          {id:1,name:'zhangsabn',time:'2019-12-12',ip:'109.168.1.1'}
      ]
    }
  },
  created() {
    
  },
  methods: {
    handleSelectionChange(val) {
        console.log(val)
    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
