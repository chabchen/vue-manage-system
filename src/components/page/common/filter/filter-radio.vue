<template>
    <div class="radio-comp">
        <div class="radio-title">{{title}}</div>
        <el-radio-group class="radio-group" v-model="radioData.value" @change="radioChange">
            <el-radio-button v-for="item in radioData.items" :key="item.index" :label="item.label" />
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                params: "",
                radioData: {},
                title:'切换维度',
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
                this.prop.params = "";
            }
        },
        created() {
            this.radioData = this.prop.config.radioData;
        },
        methods: {
            radioChange(val){
                let param = {searchSelect:[]};
                let filterArr = [];
                for (let obj of this.params.searchSelect) {//筛选器过滤
                    if (!obj.value) { continue; }
                    let item = {};
                    for(let field in obj){
                        item[field] = obj[field];
                    }
                    filterArr.push(item);
                }
                let tableField = this.radioData.tableField;
                filterArr.push({ operation: "=", tableField: tableField, type: "and", value: val });
                param.searchSelect = filterArr
                this.$parent.$parent.parentSearchEvent(param);
            }
        }
    }
</script>
<style scoped>
    .radio-group {
        margin-bottom: 30px;
    }
    .radio-comp{
        display: inline-block;
        position: relative;
        top:15px;
        margin-left: 30px
    }
    .radio-title{
        margin-bottom: 13px
    }
</style>
