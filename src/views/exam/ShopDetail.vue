<template>
    <a-card :bordered="false">
        <!--<div class="table-operator">-->
            <!--<a-button type="primary" @click="categoryManage">分类管理</a-button>-->
            <!--<a-button type="primary" @click="handleAdd">上传测评</a-button>-->
        <!--</div>-->
        <s-table ref="table" size="default" :row-key="record => record.eid" :columns="columns" :data="loadData">
            <template slot="price" slot-scope="text">{{ text | PriceFormat }}</template>
            <template slot="content" slot-scope="text">
                <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
            </template>
            <template slot="create_time" slot-scope="text">{{ (text * 1000) | DateFormat('YYYY-MM-DD HH:mm') }}
            </template>

            <span slot="action" slot-scope="text, record">
        <template>


          <div>
            <a @click="sendEmail(record)" v-if="record.id==0">send email</a>
          </div>


        </template>
      </span>
        </s-table>

        <a-modal title="分类管理" :width="800" v-model="visible" @ok="() => (visible = false)">
            <category :kind="2"></category>
        </a-modal>
        <a-modal title="Shop Detail" :width="800" @ok="() => (infoVisible = false)" v-model="infoVisible">
            <description-list title="" :col="2">
                <description-list-item term="ShopName">{{ mdl.title }}</description-list-item>
                <description-list-item term="ShopId">{{ mdl.category_name }}</description-list-item>
                <description-list-item term="Turnover">{{ mdl.price | PriceFormat }}</description-list-item>
                <description-list-item term="WeekTime">{{ mdl.price | PriceFormat }}</description-list-item>
                <description-list-item term="CreatedTime">{{ mdl.price | PriceFormat }}</description-list-item>
                <description-list-item term="Detail">{{ mdl.content }}</description-list-item>
            </description-list>
        </a-modal>
    </a-card>
</template>

<script>
    import {STable, Ellipsis, Category, DescriptionList} from '@/components'

    const DescriptionListItem = DescriptionList.Item
    import {getShopList, getShopDetail, sendShopEmail} from '@/api/exam'

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
                shopId:this.$route.query.id,
                visible: false,
                infoVisible: false,
                mdl: {},
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: 'ShopId',
                        dataIndex: 'shop_id'
                    },
                    {
                        title: 'Turnover',
                        dataIndex: 'turnover'
                    },
                    {
                        title: 'WeekTime',
                        dataIndex: 'week_time',
                        scopedSlots: {customRender: 'week_time'}
                    },
                    {
                        title: 'CreatedTime',
                        dataIndex: 'created_time',
                        scopedSlots: {customRender: 'created_time'}
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'}
                    }
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    const params = {
                        shop_id:this.$route.params.id
                    }
                    return getShopDetail(params).then(res => {
                        console.log("goooooood12345789", res)
                        return res.ShopTurnover
                    })
                }
            }
        },
        methods: {
            sureSendEmail(info){
                const params = {
                    shop_id:info.shop_id,
                    week_time:info.week_time
                }
                sendShopEmail(params).then(res => {
                    if(res){
                        this.$message.success("Send Email Suc")
                        this.loadData()
                    }

                })
            },
            checkDetail(info) {
                const params = {
                    shop_id:info.shop_id
                }
                getShopDetail(params).then(res => {
                    console.log("goooooood12345789", res)
                    return res.Shops
                })
                this.infoVisible = true
            },
            sendEmail(info) {
                this.sureSendEmail(info)
                // let that = this
                // this.$confirm('Sure send email to client？', 'send email', {
                //     confirmButtonText: 'sure',
                //     cancelButtonText: 'cancel',
                //     type: 'warning'
                // }).then(() => {
                //     that.sureSendEmail(info)
                // });
            },
            setProportion(info){

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
