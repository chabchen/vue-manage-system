<template>
    <div v-show="radioCard" :style="{width:widthData,marginRight:rightPx}" class="wrapper" @click="routerTo" v-loading="loading">
        <div class="title_style" v-if="items.card_title">
            <span class="blue_span" v-if="items.card_title !=' '">
                <p class="card_text">&nbsp&nbsp{{items.card_title}}</p>
            </span>
        </div>
        <div v-show="!nodataFlag" class="wrap" style="height: 120px;">
            <div class="item" style="margin: auto">
                <div class="c_title" style="text-align: center">
                    {{items.label}}
                    <i v-if="items.showChecked" class="checkbox" style="float: right;margin: 10px 25px 0 -25px;">
                        <el-checkbox v-model="items.checked" />
                    </i>
                </div>
                <div style="text-align: center;min-height: 30px;">
                    <b>{{items.value}}</b>
                    <i>{{items.unit}}</i>
                </div>
                <div class="bottom">
                    <template v-for="item in items.details">
                        <P>
                            <template v-for="obj in item">
                                <span class="bottom-span">
                                    {{obj.label}}
                                    <b style="color:#ff9d1e">{{obj.value}}</b>
                                    <i style="color:#ff9d1e">{{obj.unit}}</i>
                                </span>
                            </template>
                            <br>
                        </P>
                    </template>
                </div>
            </div>
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
                widthData: "25%",
                data: "",
                params: "",
                url: "",
                reportType: "dayReport",
                days: "1",
                lastDay: "",
                sqlFlag: false,
                fieldFlag: "",
                nodataFlag: false,
                rightPx: "",
                radioCard: true,
                cardFlag: "",
            }
        },
        created() {
            this.items = this.prop.config.items;
            this.url = this.prop.config.url;
            this.sql2 = this.prop.config.sql2;
            if (this.prop.config.widthData) {
                this.widthData = this.prop.config.widthData;
            }
            this.rightPx = this.prop.config.rightPx;
            if(this.prop.config.hasOwnProperty('radioCard')){
                this.radioCard = this.prop.config.radioCard;
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
                this.changeRadio(newValue);
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            getSqlFlag(params) { //根据维度切换对应的sql
                if (!params || (!params.searchDate && params.searchSelect)) { return; }
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (obj.tableField == "reportType") {//求日均值
                            this.reportType = obj.value == "日报" ? "dayReport" : "monthReport";
                        }
                    }
                }
                if (!params.searchDate) { return; }
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.fieldFlag && this.fieldFlag != obj.tableField) {
                        this.sqlFlag = !this.sqlFlag;
                    }
                    this.fieldFlag = obj.tableField;
                    if (Array.isArray(obj.value)) { this.getDays(obj.value);}
                }
            },
            getDays(dates) {//获取选中的日期天数
                if (!dates) { return; }
                let start = dates[0];
                let end = dates[1];
                let startDate;
                let endDate;
                let num = 1;
                if (this.reportType == "dayReport") {//日报
                    this.lastDay = end;
                    startDate = new Date(start.substring(0, 4), parseInt(start.substring(4, 6)) - 1, start.substring(6, 8));
                    endDate = new Date(end.substring(0, 4), parseInt(end.substring(4, 6)) - 1, end.substring(6, 8));
                } else {//月报
                    startDate = new Date(start.substring(0, 4), parseInt(start.substring(4, 6)) - 1);
                    endDate = new Date(end.substring(0, 4), end.substring(4, 6));
                    let day = new Date(endDate.getTime() - 86400000).getDate();
                    this.lastDay = end + "" + day;
                    num = 0;
                }
                let days = endDate.getTime() - startDate.getTime();
                this.days = parseInt(days / (1000 * 60 * 60 * 24)) + num;
            },
            loadReportData(params) {
                this.loading = true;
                this.nodataFlag = false;
                let sql = this.prop.sqls;
                let limitFields = this.prop.config.limitFields;
                let lastDateFlag = this.prop.config.lastDateFlag;
                let noTime = this.prop.config.noTime;
                if (!sql || !this.url || !this.radioCard) { this.loading = false; return; }
                this.getSqlFlag(params);
                if (this.sqlFlag && this.sql2) { sql = this.sql2; }
                while(sql.indexOf("dateDays") > -1){
                    sql = sql.replace("dateDays", this.days);//求日均值
                }
                sql = this.$setParams(sql, this.params, limitFields, lastDateFlag,noTime);
                this.resetData();
                this.autoWidth();
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if (res.code == "502") { this.nodataFlag = true; }
                    if (!res.datas) { return; }
                    this.setCardData(res.datas[0]);
                }).catch(() => {
                    this.loading = false;
                });
            },
            changeRadio(params){
                if (!params || (!params.searchDate && params.searchSelect)||!this.prop.config.hasOwnProperty('radioCard')) { return; }
                for (let obj of params.searchDate) {
                    if (!obj.dataShow) { continue; }
                    if (this.cardFlag && this.cardFlag != obj.tableField) {
                        this.radioCard = !this.radioCard;
                    }
                    this.cardFlag = obj.tableField;
                }
            },
            autoWidth(){
                if(this.prop.config.hasOwnProperty('rightPx2')){
                    this.rightPx = 0
                    if(!this.sqlFlag){
                        this.rightPx = this.prop.config.rightPx2
                    }
                }
            },
            resetData() {
                if (!this.items) { return; }
                this.items.value = "";
                if (!this.items.details) { return; }
                for (let obj of this.items.details) {
                    for (let obj3 of obj) { obj3.value = ""; }
                }
            },
            setCardData(datas) {
                this.items.value = datas[this.items.fieldName] != null ? datas[this.items.fieldName] : "";
                if (!this.items.details) { return; }
                for (let obj2 of this.items.details) {
                    for (let obj3 of obj2) {
                        obj3.value = datas[obj3.fieldName] != null ? datas[obj3.fieldName] : "";
                    }
                }
            },
            routerTo() {
                if (!this.prop.config.indexId) { return; }
                this.$router.push({ path: 'index', query: { reportId: this.prop.config.indexId } });
            }
        }
    }
</script>


<style scoped>
    .wrapper {
        padding: 5px;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: top
    }

    .wrap {
        border-radius: 30px;
        border: 2px solid #0084D5;
        /* padding: 20px */
    }

    .bottom {
        overflow: hidden;

        border-top: 1px solid #0084D5;
        width: 100%;
        height: 100%;
        margin: auto;
        text-align: center;
    }

    .bottom-span {
        line-height: 25px;
        margin: 0 10px;
        display: inline-block;
        max-width: 200px;
    }

    .title_style {
        margin: 10px 0;
        height: 15px;
    }

    .blue_span {
        display: inline-block;
        background: #2d8cf0;
        width: 4px;
        height: 20px;
    }

    span {
        font-size: 14px;
        vertical-align: middle;
    }
    .card_text{
        width: 10rem;
    }
</style>