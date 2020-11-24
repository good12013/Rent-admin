<template>
    <div class="app-container">
        <el-form class="form-box" ref="form" label-width="150px" >
            <el-form-item label="活动标题" required>
                <el-input v-model="dataInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="活动介绍" required>
                <el-input type="textarea"  v-model="dataInfo.desc"></el-input>
            </el-form-item>
            <el-form-item label="活动封面图">
                <el-upload
                    class="avatar-uploader"
                    :action="upLoadImgUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="dataInfo.cover_url" :src="dataInfo.cover_url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>
                    请上传格式为PNG、JPG,大小低于2M的图片
                </span>
            </el-form-item>
            <el-form-item label="活动地点" required>
                <el-col :span="8">
                    <el-input v-model="dataInfo.location"></el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="5">
                    <el-input placeholder="" v-model="dataInfo.lon">
                        <template slot="prepend">经度</template>
                    </el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="5">
                    <el-input placeholder="" v-model="dataInfo.lat">
                        <template slot="prepend">纬度</template>
                    </el-input>
                </el-col>
                <el-col :span="1" class="jg"></el-col>
                <el-col :span="3">
                    <el-button  @click.stop="openMap()">地图选择</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="活动时间" required>
                <el-date-picker v-model="dataInfo.begin_ymdhm" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间"></el-date-picker>
                <span style="padding:0 20px">-</span>
                <el-date-picker v-model="dataInfo.end_ymdhm" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="活动嘉宾" required>
                <el-button type="success" style="margin-bottom:15px" @click.stop="addGuer()">添加</el-button>
                <div style="margin-bottom:15px" v-for="(item,index) in guestsArr" :key="index">
                    <el-col :span="8">
                        <el-input placeholder="" v-model="item.name">
                            <template slot="prepend">姓名</template>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-input placeholder="" v-model="item.intro">
                            <template slot="prepend">简介</template>
                        </el-input>
                    </el-col>
                    <el-col :span="4" style="text-align:right">
                        <el-button type="danger" @click.stop="delGuer(index)">删除</el-button>
                    </el-col>
                    <div class="clear"></div>
                </div>
            </el-form-item>
            <el-form-item label="是否置顶" required>
                <el-switch v-model="dataInfo.is_sticky"></el-switch>
            </el-form-item>
            <el-form-item label="最大报名人数" required>
                <el-input-number v-model="dataInfo.limit_count" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button @click.stop="save()" type="primary">立即保存</el-button>
                <el-button @click.stop="goBack()">取消</el-button>
            </el-form-item>
        </el-form>



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
        upLoadImgUrl:'',
        dialogVisible:false,
        guestsArr:[],
        lon:'',
        lan:'',
        dataInfo:{
            begin_ymdhm:'',//开始时间,
            cat_name:'', 
            cover_url:'', 
            lat:'',
            lon:'',
            desc:'', //简介
            end_ymdhm:'', //结束时间
            guests:'',//嘉宾
            is_sticky:0, //是否置顶,
            location:'', //地址
            title:'', //标题
            limit_count:'' //报名人数
        },
    }
  },
  created() {
    this.id = this.$route.params.id
    this.upLoadImgUrl = process.env.VUE_APP_BASE_API + '/api/v1.0/files/image'
    if(this.id != 0){
        this.getDetail()
    }
    
  },
  methods: {
    save(){
        if(this.guestsArr.length){
            this.dataInfo.guests = JSON.stringify(this.guestsArr)
        }
        this.dataInfo.is_sticky = this.dataInfo.is_sticky?1:0
        this.ObjRequired(this.dataInfo,'cover_url,cat_name',() => {
            this.$message({ message: '请完成*类项目填写或选择',type: 'warning'});
            return
        },() => {
            if(this.id != 0){
                this.PUT(
                    '/api/v1.0/activities/info?id=' + this.id,
                    this.dataInfo,
                    data => {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        window.history.go(-1)
                    }
                )
            }else{
                this.POST(
                    '/api/v1.0/activities',
                    this.dataInfo,
                    data => {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        window.history.go(-1)
                    }
                )
            }
        })
        
    },
    goBack(){
        window.history.go(-1)
    },
    locationSvae(){
        this.dataInfo.lon = this.lon
        this.dataInfo.lat = this.lat
        this.dialogVisible = false
    },
    addGuer(){
        var obj = {
            name:'',
            intro:''
        }
        this.guestsArr.push(obj)
    },
    delGuer(index){
        this.guestsArr.splice(index,1)
    },
    beforeAvatarUpload(e){
        //console.log(e)
    },
    handleAvatarSuccess(e){
        this.dataInfo.cover_url = e.data
    },
    // 获取详情
    getDetail(){
        this.GET(
            '/api/v1.0/activities/info',
            {
                id:this.id
            },
            data => {
               this.dataInfo = data.data
                if(this.dataInfo.guests){
                    this.guestsArr = JSON.parse(this.dataInfo.guests)
                }
                this.dataInfo.is_sticky = this.dataInfo.is_sticky?true:false
            }
        )
    },
     openMap(){
        var _this = this
        this.dialogVisible = true

        setTimeout(() => {
            var marker,map = new AMap.Map("container", {
                resizeEnable: true
            });
            if(this.dataInfo.lon && this.dataInfo.lat){
                marker = new AMap.Marker({
                    position: new AMap.LngLat(this.dataInfo.lon,this.dataInfo.lat)
                });
                map.add(marker);
            }

            

            //为地图注册click事件获取鼠标点击出的经纬度坐标
            map.on('click', function(e) {
                if (marker) {
                    marker.setMap(null);
                    marker = null;
                }
                _this.lon = e.lnglat.lng
                _this.lat = e.lnglat.lat
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
