<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <el-table :data="tableData" border stripe :show-summary="showSummary" style="width: 107em" max-height="460">
            <template v-for="(col, index) in tableColumns">
                <el-table-column show-overflow-tooltip :key="index" :prop="col.prop" :label="col.label"></el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                widthData: '100%',
                title: '',
                tableColumns: [],
                tableData: []
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
            getParams(params) {
                if (!params || (!params.searchSelect && !params.searchDate)) { return ""; }
                let param = "";
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }
                        if (obj.type && obj.tableField && Array.isArray(obj.value)) {
                            param += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
                        }
                        if (obj.type && obj.tableField && !Array.isArray(obj.value)) {
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                    }
                }
                if (!params.searchDate) { return param }
                for (let obj of params.searchDate) {
                    if (!obj.value) { continue; }
                    param += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value;
                }
                return param;
            },
            loadReportData() {
                this.loading = true;
                let sql = this.prop.sqls;
                if (!sql || !this.url || !this.params) { this.loading = false; return; }
                let param = this.getParams(this.params);
                let groupby = sql.split("groupby")[1];
                if (groupby) {
                    sql = sql.split("groupby")[0];
                }
                if (param) { sql += param; }
                if (groupby) {
                    groupby = ' group by ' + groupby;
                    sql += groupby;
                }
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
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
        line-height: 50px;
        text-transform: none;
        background: rgba(242, 242, 242, 1);
        padding-left: 15px;
        margin: 10px 0 10px 0;
    }

    .head-title p {
        display: inline-grid;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
    }
</style>