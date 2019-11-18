<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if = "selectData.title" class="line-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showDetail" class="line-select">
                    <router-link :to="{ path: 'index', query: { reportId: selectData.detailId }}">
                        查看原因
                    </router-link>
                </div>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-pie width=100% height="460px" style="top:25px" :data="chartData" :settings="chartSettings"></ve-pie>
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                selectData: {},
                widthData: '50%',
                chartData: {},
                chartSettings: {},
                params: "",
                url: "",
                reportType: "dayReport",
                sqlFlag: false,
                fieldFlag: "",
            }
        },
        created() {
            this.loading = false;
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartSettings = this.prop.config.chartSettings;
            this.url = this.prop.config.url;
            if(this.prop.config.widthData){
                this.widthData = this.prop.config.widthData;
            }
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if(!newValue){return;}
                this.params = newValue;
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            getSqlFlag(params) { //根据维度切换对应的sql
                if (!params || (!params.searchDate && params.searchSelect)) { return; }
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (obj.tableField != "sqlFlag") { continue; }
                        this.sqlFlag = obj.value == "sql2" ? true : false;
                    }
                }
                if(!params.searchDate){return;}
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.fieldFlag && this.fieldFlag != obj.tableField) {
                        this.sqlFlag = !this.sqlFlag;
                    }
                    this.fieldFlag = obj.tableField;
                }
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                if (!sql || !this.url) { this.loading = false; return; }
                this.getSqlFlag(params);
                if (this.sqlFlag && this.sql2) { sql = this.sql2; }
                let newSql = this.$setParams(sql, params);
                this.chartData.rows = [];
                this.$requestData(this.url, 'post', { params: newSql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    this.chartData.rows = res.datas;
                    this.setToolTip(res.datas);
                }).catch(() => {
                    this.loading = false;
                });
            },
            setToolTip(datas) {
                
            }
        }
    }
</script>
<style scoped>
    .line-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        padding-left: 15px;
        margin: 10px 0 10px 0;
        background: rgba(242, 242, 242, 1);
        color: #333333;
    }

    .echart-ex1 {
        display: inline-block;
        width: 99.6%;
        margin: 2% auto;
        border-width: 0px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
    }

    .line-title p {
        display: inline-block;
    }

    .line-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-flex;
    }
</style>