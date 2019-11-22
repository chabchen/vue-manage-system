<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if="selectData.title" class="head-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="lineBar-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" @change="changeSelect" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-histogram width=100% :height="heightData" :extend="chartExtend" :colors="chartSettings.chartColor" :data="chartData"
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
                heightData: '350px',
                params: '',
                sqlFlag: false,
                sql2: "",
                fieldFlag: "",
                url: '',
                iconFlag: false
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
            getParam(sql,params,limitFields,lastDateFlag,firstDateFlag,param_year){
                if(!sql || !params){return "";}
                if (!params.searchSelect && !params.searchDate) { return ""; }
                let param = "";let param2 = "";
                if (params.searchSelect) {//获取下拉框筛选器的值
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }
                        if(obj.tableField == "ppri.estrus_period" ){
                            param += " " + obj.type + " year =" + obj.value.substring(0,4);
                        }
                        if (obj.type && obj.tableField && Array.isArray(obj.value) &&!obj.getBehind) {
                            param += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
                        }
                        if (obj.type && obj.tableField && !Array.isArray(obj.value)) {
                            if(obj.tableField != "ppri.estrus_period" || !param_year){
                                param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                            }
                        }
                        if(!limitFields || !limitFields.length || limitFields.indexOf(obj.tableField) == -1){continue;}
                        if (obj.type && obj.tableField && Array.isArray(obj.value) &&!obj.getBehind) {
                            param2 += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
                        }
                        if (obj.type && obj.tableField && !Array.isArray(obj.value) &&!obj.getBehind) {
                            param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                        if(obj.type && obj.tableField && obj.getBehind){
                            param2 += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value.substring(obj.value.lastIndexOf("-")+1) + "'";
                        }
                    }
                }
                return this.concatParams(sql,param,param2);
            },
            concatParams(sql,param,param2){
                let sqlArr = sql.trim().split("1=1");
                let newSql = param2 ? sqlArr[0] + " 1=1 " + param2 : sqlArr[0] + " 1=1 " + param;
                for(let i = 1,j = sqlArr.length -1;i<j;i++){
                    newSql += sqlArr[i] + " 1=1 "+param;
                }
                newSql = newSql + sqlArr[sqlArr.length-1];
                newSql = newSql.replace("groupby","group by");
                return newSql;
            },
            loadReportData(params) {
                this.iconFlag = false;
                this.loading = true;
                let sql = this.prop.sqls;
                let limitFields = this.prop.config.limitFields;
                let lastDateFlag = this.prop.config.lastDateFlag;
                let firstDateFlag = this.prop.config.firstDateFlag;
                let param_year = this.prop.config.param_year;
                if (!sql || !this.url) { this.loading = false; return; }
                this.getSqlFlag(params);
                if (this.sqlFlag) { sql = this.sql2;}
                if(param_year){
                    sql = this.getParam(sql, this.params,limitFields,lastDateFlag,firstDateFlag,param_year);    
                }else{
                    sql = this.$setParams(sql, this.params,limitFields,lastDateFlag);
                }
                this.chartData.rows = [];
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if (!res.datas) { return; }
                    this.setData(res.datas);
                    this.setToolTip(res.datas);
                }).catch(() => {
                    this.loading = false;
                });
            },
            setData(data) {
                let name = this.chartData.columns[0];
                if (!data[0][name]) { return; }
                this.chartData.rows = data;
            },
            setToolTip(datas) {
                this.chartExtend.series.label.normal.show = false;
                if (!datas || !this.chartExtend.tooltip) { return; }
                let legendName = this.chartSettings.legendName
                let name = this.chartData.columns[0];
                let _this = this;
                this.chartExtend.tooltip.formatter = function (params) {
                    let str = ''
                    let labelMapObj = _this.chartData.labelMapObj ? _this.chartData.labelMapObj[_this.selectData.value] : "";
                    for (let data of datas) {
                        if (!data || data[name] != params[0].name) { continue }
                        str += data[name] + "<br>";
                        for (let field in data) {
                            if (field == name) { continue; }
                            if (labelMapObj && labelMapObj.indexOf(field) == -1) { continue; }
                            let value = data[field] ? data[field] : 0;
                            str += legendName[field] + " : " + value + "<br>"
                        }
                    }
                    return str
                };
                let icon = this.chartExtend.icon;
                this.chartExtend.toolbox.feature = {
                    myTool: {
                        show: true,
                        title: " ",
                        icon: 'image://'+icon,
                        onclick: function () {
                            _this.iconFlag = !_this.iconFlag;
                            _this.changViewData(_this.iconFlag);
                        }
                    }
                }
            },
            changViewData(iconFlag){
                let icon = this.chartExtend.icon;
                let icon2 = this.chartExtend.icon2;
                this.chartExtend.toolbox.feature.myTool.icon = this.iconFlag ? 'image://'+icon2 : 'image://'+icon; 
                this.chartExtend.series.label.normal.show = this.iconFlag;
            },
            changeSelect(value) {
                this.chartData.columns = this.chartData.columnsObj[value];
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
        display: inline-grid;
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