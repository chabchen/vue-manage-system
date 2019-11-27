<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="head-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" @change="changeSelect" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div v-show="!nodataFlag">
            <ve-line width=100% :height="heightData" :data="chartData" :extend="chartExtend" :colors="chartSettings.chartColor" :loading="loading"
                :settings="chartSettings" />
            </div>
            <div v-show="nodataFlag"><nodata/></div>
        </div>
    </div>
</template>
<script>
    import nodata from '../nodata.vue'
    export default {
        components: { nodata },
        props: { prop: Object },
        data() {
            return {
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                loading: true,
                widthData: '100%',
                heightData: '350px',
                params: '',
                reportType: "dayReport",
                sql2: "",
                sqlFlag: false,
                fieldFlag: "",
                nodataFlag: false
            }
        },
        created() {
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.sql2 = this.prop.config.sql2;
            this.url = this.prop.config.url;
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            if (this.prop.config.heightData) {
                this.heightData = this.prop.config.heightData;
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
                if (!params.searchDate) { return; }
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.fieldFlag && this.fieldFlag != obj.tableField) {
                        this.sqlFlag = !this.sqlFlag;
                    }
                    this.fieldFlag = obj.tableField;
                }
            },
            loadReportData(params) {
                this.loading = true;
                this.nodataFlag = false;
                let sql = this.prop.sqls;
                if (!sql || !this.url) { this.loading = false; return; }
                this.getSqlFlag(params);
                if (this.sqlFlag) { sql = this.sql2; }
                let newSql = this.$setParams(sql, params);
                this.chartData.rows = [];
                this.$requestData(this.url, 'post', { params: newSql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    if (res.datas.code == 502) { this.nodataFlag = true; }
                    this.chartData.rows = res.datas;
                    this.setData(res.datas);
                }).catch(() => {
                    this.loading = false;
                });
            },
            setData(datas) {
                this.chartData.rows = [];
                let fields = this.chartData.fields;
                this.chartData.columns = this.chartData.columns2;
                if (this.reportType == "monthReport") {
                    fields = this.chartData.fields2;
                    this.chartData.columns = this.chartData.columns3;
                }
                for (let obj of datas) {
                    let row = {};
                    for (let field in fields) {
                        row[fields[field]] = obj.field;
                    }
                    this.chartData.rows.push(row);
                }
                this.setToolTip(datas);
            },
            setToolTip(datas) {

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
        width: 100%;
        border-width: 0px;
        background: inherit;
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
        overflow: hidden;
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

    .line-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-block;
        margin: 0;
    }
</style>