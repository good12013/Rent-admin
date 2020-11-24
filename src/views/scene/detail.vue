<template>
    <div class="app-container">
        <el-form class="form-box"  label-width="150px" >
            <el-form-item label="名称" required>
                <el-input v-model="dataInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="类型" required>
            <el-select :clearable="true" v-model="dataInfo.cat_name" placeholder="请选择">
                <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="区域" required>
                <el-select :clearable="true" v-model="dataInfo.district_id" placeholder="请选择">
                    <el-option
                    v-for="item in qys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="介绍" required>
                <el-input v-model="dataInfo.desc" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item label="地址" required>
                <el-col :span="8">
                    <el-input v-model="dataInfo.location"></el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="5">
                    <el-input placeholder="" v-model="dataInfo.lon">
                        <template slot="prepend" >经度</template>
                    </el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="5">
                    <el-input placeholder="" v-model="dataInfo.lan">
                        <template slot="prepend">纬度</template>
                    </el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="3">
                    <el-button  @click.stop="openMap()">地图选择</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="需求类别" required>
                <el-select v-model="dataInfo.pr_type" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="场景建设地" required >
                <el-input v-model="dataInfo.construct_site"></el-input>
            </el-form-item>
            <el-form-item label="供给" required >
                <el-input v-model="dataInfo.supply"></el-input>
            </el-form-item>
            <el-form-item label="需求" required>
                <el-input v-model="dataInfo.pr_content" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item label="联系单位" required>
                <el-input v-model="dataInfo.contact_unit"></el-input>
            </el-form-item>
            <el-form-item label="联系人" required>
                <el-input v-model="dataInfo.contact_man"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" required>
                <el-input v-model="dataInfo.contact_info"></el-input>
            </el-form-item>
            <el-form-item label="信息有效期" required>
                <el-input v-model="dataInfo.expiration"></el-input>
            </el-form-item>
            <el-form-item label="标签" required>
                <el-select style="width:100%" @change="tagsChange" v-model="selectTags" multiple placeholder="请选择">
                    <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片">
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="upLoadImgUrl"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="dataInfo.cover_url" :src="dataInfo.cover_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>
                    请上传格式为PNG、JPG,大小低于2M的图片
                </span>
            </el-form-item>
        </el-form>


        <div style="text-align:center;margin:50px 0;">
            <el-button type="primary" style="width:200px" @click.stop="save()">保存</el-button> <el-button style="width:200px" @click.stop="goBack()">取消</el-button>
        </div>




        <el-dialog
        title="选择地址"
        :visible.sync="dialogVisible"
        width="800px">
        <div id="container"></div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="locationSvae()">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>

export default {
  data() {
    return {
        id:'',
        dialogVisible:false,
        dialogTableVisible:false,
        tabActiveMain:1,
        classValue : '',
        options1: [{value: '选项1', label: '美好生活'},{value: '选项2', label: '制造引领'},{value: '选项3', label: '数字治理'},{value: '选项4', label: '天府文化'},{value: '选项5', label: '公园城市'}],
        lon:0,
        lan:0,
        dataInfo:{
            lon:0,
            lan:0,
            cover_url:''
        },
        upLoadImgUrl:'',
        tags:[],
        qys:[],
        selectTags:[],
        options:['规划设计编制','解决方案征集','项目建设需求','产品采购','人才需求','技术联合攻关产业协作配套','企业协作','线上活动举办','产品（服务）采购']
    }
  },
  created() {
    this.upLoadImgUrl = process.env.VUE_APP_BASE_API + '/api/v1.0/files/image'
    this.id = this.$route.params.id
    this.getTags()
    this.getAddress()
    this.getDetail()
  },
  methods: {
    getTags(){
        this.GET(
            '/api/v1.0/tags',
            {},
            data => {
                this.tags = data.data
                this.tags.forEach(el => {
                    el.id = JSON.stringify(el.id) 
                })
            }
        )
    },
    tagsChange(e){
        this.selectTags = e
    },
    getAddress(){
        this.GET(
            '/api/v1.0/district',
            {},
            data => {
                this.qys = data.data
            }
        )
    },

    getDetail(){
        this.GET(
            '/api/v1.0/scenes/info',
            {id:this.id},
            data => {
                this.dataInfo = data.data
                this.selectTags = this.dataInfo.tag_ids.split(',')
            }
        )
    },

    goBack(){
        window.history.go(-1)
    },

    save(){
        var tagStrs = ''
        this.selectTags.forEach(el => {
            tagStrs += el + ','
        })
        if(tagStrs){
            tagStrs = tagStrs.substr(0, tagStrs.length - 1)
        }
        this.dataInfo.tag_ids = tagStrs
        let keystr = this.ObjKeyJoin(this.dataInfo) //所有不是非必须得对象key值拼接

         this.ObjRequired(this.dataInfo,keystr,() => {
            this.$message({ message: '请完成*类项目填写或选择',type: 'warning'});
            return
        },() =>{
            this.PUT(
            '/api/v1.0/scenes/info?id=' + this.id,
            this.dataInfo,
            data => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
                window.history.go(-1)
            }
        )
        })
        
    },

    beforeAvatarUpload(e){
        //console.log(e)
    },
    handleAvatarSuccess(e){
        console.log(e.data)
        this.dataInfo.cover_url = e.data
    },
    locationSvae(){
        this.dataInfo.lon = this.lon
        this.dataInfo.lan = this.lan
        this.dialogVisible = false
    },

    tabClickMain(tab, event){
        console.log(tab, event);
    },
    openMap(){
        var _this = this
        this.dialogVisible = true

        setTimeout(() => {
            var marker,map = new AMap.Map("container", {
                resizeEnable: true
            });

            var marker = new AMap.Marker({
                position: new AMap.LngLat(this.dataInfo.lon,this.dataInfo.lan)
            });

            map.add(marker);

            //为地图注册click事件获取鼠标点击出的经纬度坐标
            map.on('click', function(e) {
                if (marker) {
                    marker.setMap(null);
                    marker = null;
                }
                _this.lon = e.lnglat.lng
                _this.lan = e.lnglat.lat
                marker = new AMap.Marker({
                    icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                    position: [e.lnglat.lng,e.lnglat.lat]
                });

                marker.setMap(map);
            });
        },200)
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
  .form-box{
      width: 1000px;
  }
  .line{
      text-align: center;
  }
  .jg{
      height: 1px;
  }
  .clear{
      clear: both;
  }
  #container{
      width: 100%;
      height: 400px;
  }
}

</style>
