<template>
    <a-card :bordered="false">
        <s-table ref="table" size="default" :row-key="record => record.eid" :columns="columns" :data="loadData" :showPagination="false">
            <template slot="price" slot-scope="text">{{ text | PriceFormat }}</template>
            <template slot="content" slot-scope="text">
                <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
            </template>
            <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}
            </template>

            <span slot="action" slot-scope="text, record">
        <template>
          <div>
            <a @click="setProportion(record)">set_station_flow_proportion</a>
          </div>

        </template>
      </span>
        </s-table>

        <a-modal title="SendEmail" :width="600" v-model="visible" @ok="sureSendEmail">
            <a-form :form="sendEmailInfo">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="ShopName">
                    <span>{{sendEmailInfo.shopName}}</span>
                </a-form-item>
                <a-form-item  :label-col="labelCol" :wrapper-col="wrapperCol" label="WeekTime">
                    <el-date-picker
                            class="value-info"
                            style="width: 280px;height: 40px;margin-left: 15px;"
                            v-model="sendEmailInfo.chooseWeekTime"
                            type="week"
                            placeholder="choose a week"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-ddT00:00:00+08:00"></el-date-picker>
                </a-form-item>
            </a-form>
            <!--<div style="height: 60px;">-->
            <!--ShopName:<span style="margin-left: 15px;">{{sendEmailInfo.shopName}}</span>-->
            <!--</div>-->
            <!--<div style="height: 60px;">-->
            <!--WeekTime:<el-date-picker-->
            <!--class="value-info"-->
            <!--style="width: 280px;height: 40px;margin-left: 15px;"-->
            <!--v-model="sendEmailInfo.chooseWeekTime"-->
            <!--type="week"-->
            <!--placeholder="choose a week"-->
            <!--format="yyyy-MM-dd"-->
            <!--value-format="yyyy-MM-ddT00:00:00+08:00"></el-date-picker>-->
            <!--</div>-->

        </a-modal>
        <a-modal title="Set Proportion" :width="600" @ok="sureSetProportion" v-model="infoVisible">
            <a-form :form="proportionInfo">
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="StationName">
                    <span style="margin-left: 20px;">{{proportionInfo.stationName}}</span>
                </a-form-item>
                <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="Proportion">
                    <a-input style="margin-left: 18px;"  v-model="proportionInfo.proportion"/>
                </a-form-item>
                <a-form-item  :label-col="labelCol" :wrapper-col="wrapperCol" label="WeekTime">
                    <el-date-picker
                            class="value-info"
                            style="width: 280px;height: 40px;margin-left: 15px;"
                            v-model="proportionInfo.chooseWeekTime"
                            type="week"
                            placeholder="choose a week"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-ddT00:00:00+08:00"></el-date-picker>
                </a-form-item>
            </a-form>
            <!--<div style="height: 60px;">-->
            <!--StationName:<span style="margin-left: 15px;">{{proportionInfo.stationName}}</span>-->
            <!--</div>-->
            <!--<div style="height: 60px;">-->
            <!--Proportion:<span style="margin-left: 15px;">{{proportionInfo.stationName}}</span>-->
            <!--</div>-->
            <!--<div style="height: 60px;">-->
            <!--WeekTime:<el-date-picker-->
            <!--class="value-info"-->
            <!--style="width: 280px;height: 40px;margin-left: 15px;"-->
            <!--v-model="proportionInfo.chooseWeekTime"-->
            <!--type="week"-->
            <!--placeholder="choose a week"-->
            <!--format="yyyy-MM-dd"-->
            <!--value-format="yyyy-MM-ddT00:00:00+08:00"></el-date-picker>-->
            <!--</div>-->
        </a-modal>
    </a-card>
</template>

<script>
    import {STable, Ellipsis, Category, DescriptionList} from '@/components'

    const DescriptionListItem = DescriptionList.Item
    import {getStationList, getShopDetail, sendShopEmail,setStationProportion} from '@/api/exam'

    export default {
        name: 'ExamList',
        components: {
            STable,
            Ellipsis,
            DescriptionList,
            DescriptionListItem,
            Category
        },
        data() {
            return {
                labelCol: { lg: { span: 4 }, sm: { span: 4 } },
                wrapperCol: { lg: { span: 8 }, sm: { span: 15 } },
                proportionInfo:{
                    stationName:'',
                    proportion:'',
                    chooseWeekTime:'',
                },
                sendEmailInfo:{
                    shopName:'',
                    shopId:'',
                    chooseWeekTime:''
                },
                visible: false,
                infoVisible: false,
                mdl: {},
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: 'ID',
                        dataIndex: 'id'
                    },
                    {
                        title: 'station_name',
                        dataIndex: 'name'
                    },
                    {
                        title: 'created_at',
                        dataIndex: 'created_at'
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'}
                    }
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return getStationList().then(res => {
                        return res.Stations
                    })
                }
            }
        },
        methods: {
            sureSetProportion(){
                if (this.proportionInfo.proportion.length == 0){
                    this.$message.error('please input proportion')
                    return
                }
                if (this.proportionInfo.chooseWeekTime.length == 0){
                    this.$message.error('please choose weektime')
                    return
                }
                const params = {
                    station_name:this.proportionInfo.stationName,
                    proportion:this.proportionInfo.proportion,
                    week_time:this.proportionInfo.chooseWeekTime
                }
                setStationProportion(params).then(res => {
                    if(res){
                        this.$message.success("Set Proportion Suc")
                        this.infoVisible = false
                    }

                },err => {
                    console.log(err)
                    this.$message.success("Erro")
                })
            },
            sureSendEmail(){
                const params = {
                    shop_id:this.sendEmailInfo.shopId,
                    week_time:this.sendEmailInfo.chooseWeekTime
                }
                sendShopEmail(params).then(res => {
                    if(res){
                        this.$message.success("Send Email Suc")
                        this.visible = false
                    }

                })
            },
            checkDetail(info) {
                const params = {
                    shop_id:info.shop_id
                }
                this.$router.push({path:`/exams/${info.shop_id}/shopdetail`})
                // getShopDetail(params).then(res => {
                //     console.log("goooooood12345789", res)
                //     return res.Shops
                // })
                // this.infoVisible = true
            },
            sendEmail(info) {
                this.sendEmailInfo.shopName = info.shop_name;
                this.sendEmailInfo.shopId = info.shop_id;
                this.sendEmailInfo.chooseWeekTime = '';
                this.visible = true

            },
            setProportion(info){
                this.proportionInfo.stationName = info.name
                this.proportionInfo.proportion = ''
                this.proportionInfo.chooseWeekTime = ''
                this.infoVisible = true
            },
            categoryManage() {
                this.$router.push({name: 'ExamCategory'})
            },
            handleAdd() {
                this.$router.push({name: 'AddExam'})
            },
            handleInfo(row) {
                this.mdl = row
                this.infoVisible = true
            },
            handleEdit(row) {
                this.$router.push({name: 'EditExam', params: {id: row.eid}})
            },
            handleDel(row) {
                const _this = this
                this.$confirm({
                    title: '警告',
                    content: '真的要删除吗?',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        deleteExam(row.eid).then(res => {
                            if (res.code === 0) {
                                _this.$refs.table.refresh(true)
                                _this.$message.success('删除成功')
                            } else {
                                _this.$message.error('删除失败')
                            }
                        })
                    },
                    onCancel() {
                        console.log('Cancel')
                    }
                })
            },
            recommend(row) {
                updateExam(row.eid, {is_recommend: 1}).then(res => {
                    if (res.code === 0) {
                        this.$message.success('设置成功')
                        this.$refs.table.refresh(true)
                    }
                })
            },
            cancelRecommend(row) {
                updateExam(row.eid, {is_recommend: 0}).then(res => {
                    if (res.code === 0) {
                        this.$message.success('设置成功')
                        this.$refs.table.refresh(true)
                    }
                })
            }
        },
        watch: {
            $route() {
                this.$refs.table.refresh(true)
            }
        }
    }
</script>

<style lang="scss" scoped></style>
