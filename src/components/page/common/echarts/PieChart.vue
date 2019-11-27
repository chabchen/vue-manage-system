<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="head-title">
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
            <div v-show="!nodataFlag">
                <ve-pie width=100% :height="heightData" :data="chartData" :extend="chartExtend" :settings="chartSettings" :colors="colors"></ve-pie>
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
                loading: true,
                selectData: {},
                widthData: '50%',
                heightData: '350px',
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                colors: ["#0084d5", "#13caae", "#6d68f0", "#0c6e5e"],
                params: "",
                url: "",
                reportType: "dayReport",
                sqlFlag: false,
                sql2: "",
                fieldFlag: "",
                nodataFlag: false
            }
        },
        created() {
            this.loading = false;
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.colors = this.prop.config.colors;
            this.url = this.prop.config.url;
            this.sql2 = this.prop.config.sql2;
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
                let limitFields = this.prop.config.limitFields;
                let lastDateFlag = this.prop.config.lastDateFlag;
                let nonDateSegment = this.prop.config.nonDateSegment;
                if (!sql || !this.url) { this.loading = false; return; }
                this.getSqlFlag(params);
                if (this.sqlFlag && this.sql2) { sql = this.sql2; }
                let newSql = "";
                if (nonDateSegment) {
                    newSql = this.$setParams("", params, limitFields, lastDateFlag);
                    let sqlArr = sql.trim().split("1=1");
                    for (let i = 0, j = sqlArr.length - 1; i < j; i++) {
                        sql = sql.replace("1=1", "2=2 " + newSql);
                    }
                    newSql = sql;
                } else {
                    newSql = this.$setParams(sql, params, limitFields, lastDateFlag);
                }
                this.chartData.rows = [];
                this.$requestData(this.url, 'post', { params: newSql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    if(res.datas.code == 502){this.nodataFlag = true;}    
                    this.chartData.rows = res.datas;
                }).catch(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>
<style scoped>
    .echart-ex1 {
        display: inline-block;
        width: 99.6%;
        border-width: 0px;
        background: inherit;
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
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
        display: inline-flex;
    }
</style>