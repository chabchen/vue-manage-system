<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="lineBar-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="lineBar-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" @change="changeSelect" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-histogram width=100% height="460px" style="top:25px" :extend="chartExtend" :colors="chartSettings.chartColor" :data="chartData"
                :loading="loading" :settings="chartSettings" />
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
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                widthData: '50%',
                params: '',
                sqlFlag: false,
                fieldFlag: "",
                url: ''
            }
        },
        created() {
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.url = this.prop.config.url;
            this.sql2 = this.prop.config.sql2;
            if (this.prop.config.widthData) {
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
                if (!newValue) { return; }
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
                if (this.sqlFlag) { sql = this.sql2; }
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
                if (!datas || !this.chartExtend.tooltip) { return; }
                let legendName = this.chartSettings.legendName
                let name = this.chartData.columns[0];
                this.chartExtend.tooltip.formatter = function (params) {
                    let str = ''
                    for (let data of datas) {
                        if (!data || data[name] != params[0].name) { continue }
                        str += data[name] + "<br>"
                        for (let field in data) {
                            if (field == name) { continue; }
                            str += legendName[field] + " : " + data[field] + "<br>"
                        }
                    }
                    return str
                }
            },
            changeSelect(value) {
                this.chartData.columns = this.chartData.columnsObj[value]
            }
        }
    }
</script>
<style scoped>
    .echart-ex1 {
        display: inline-block;
        width: 99.6%;
        margin: 2% auto;
        border-width: 0px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
    }

    .lineBar-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        background: rgba(242, 242, 242, 1);
        color: #333333;
        padding-left: 15px;
        margin: 10px 0 10px 0;
    }

    .lineBar-title p {
        display: inline-block;
    }

    .lineBar-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-grid;
    }
</style>