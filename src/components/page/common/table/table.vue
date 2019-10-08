<template>
    <div v-loading="loading" style="width: 50%;float: right;vertical-align: top">
        <div v-show="title" class="head-title">
            <p>{{title}}</p>
        </div>

        
        <el-table :data="tableData" border stripe :show-header="false">
            <template v-for="(col, index) in tableColumns">
                <el-table-column show-overflow-tooltip :key="index" :prop="col.prop" :label="col.label" />
                <!-- v-if="col.style=='normal'"
                :width="col.width"
                :min-width="col.minWidth"
                :header-align="col.headerAlign"
                :column-key="index.toString()" -->
            </template>
        </el-table>
    </div>
</template>

<script>

    export default {
        props: { prop: Object },
        data() {
            return {
                loading: false,
                title: '',
                showHeader: true,
                tableColumns: [{ prop: "title1", label: "" },
                    { prop: "value1", label: "" },
                    { prop: "title2", label: "" },
                    { prop: "value2", label: "" }],
                tableData: [
                    { title1: "投资金额（万元）", value1: 123, title2: "资产总额（万元）", value2: 123 },
                    { title1: "项目数量（个）", value1: 123, title2: "额定年产能（万吨）", value2: 123 },
                    { title1: "占地面积（亩）", value1: 123, title2: "剩余可利用面积（亩）", value2: 123 }
                ],
                params: '',
            }
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if (!newValue) { return; }
                this.params = newValue;
                this.loadReportData(this.params);
                this.prop.params = "";
            }
        },
        created() {
            this.tableColumns = this.prop.config.items;
            this.title = this.prop.config.title;
            this.showHeader = this.prop.config.showHeader;
            //this.loadReportData(this.params);
            //****************************************前端做行转列处理
        },
        methods: {

            loadReportData: function (params) {
                this.loading = false;
                this.$requestData('/report/list', 'post').then(res => {
                    if (res.datas && res.datas.length) {
                        this.tableData = [];
                        this.tableData = res.datas;
                        this.tableColumns = res.datas2;
                    }
                    this.loading = false;
                });
            }
        }
    }
</script>
<style scoped>
    .head-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        color: #333333;
        vertical-align: none;
        line-height: 30px;
        text-transform: none;
        background: #409eff;
        color: #fff;
        padding-left: 15px;
        margin: 1px 0 1px 0;
    }

    .head-title p {
        display: inline-block;
    }
</style>