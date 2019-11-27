<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <div style="overflow: auto;" v-if="!nodataFlag">
            <el-table :data="tableData" border stripe :show-summary="showSummary" max-height="460">
                <template v-for="(col, index) in tableColumns">
                    <el-table-column show-overflow-tooltip :key="index" :prop="col.prop" :label="col.label" :sortable="col.sortable"></el-table-column>
                </template>
            </el-table>
        </div>
        <div v-show="nodataFlag"><nodata/></div>
    </div>
</template>

<script>
   import nodata from '../nodata.vue'
    export default {
        components: { nodata },
        props: { prop: Object },
        data() {
            return {
                loading: true,
                widthData: '100%',
                title: '',
                tableColumns: [],
                tableData: [],
                nodataFlag: false
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
                this.loadReportData();
                this.prop.params = "";
            }
        },
        created() {
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            this.title = this.prop.config.title;
            this.tableColumns = this.prop.config.tableColumns;
            this.showSummary = this.prop.config.showSummary;
            this.url = this.prop.config.url;
        },
        methods: {
            loadReportData() {
                this.nodataFlag = false;
                this.loading = true;
                let sql = this.prop.sqls;
                let limitFields = this.prop.config.limitFields;
                let lastDateFlag = this.prop.config.lastDateFlag;
                if (!sql || !this.url || !this.params) { this.loading = false; return; }
                sql = this.$setParams(sql, this.params, limitFields, lastDateFlag);
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    if (res.datas.code == 502) { this.nodataFlag = true; }
                    this.tableData = res.datas;
                }).catch(() => {
                    this.loading = false;
                });
            },
        }
    }
</script>
<style>
    .el-row .el-button--small,
    .el-button--small.is-round {
        padding: 2px;
    }

    .head-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        color: #333333;
        vertical-align: none;
        line-height: 36px;
        text-transform: none;
        background: rgba(242, 242, 242, 1);
        padding-left: 15px;
        margin: 10px 0 3px 0;
    }

    .head-title p {
        display: inline-block;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-block;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
    }
</style>