<template>
    <div v-loading="loading">
        <el-select class="select_style" v-model="selectData.value" @change="selectChange" :multiple="selectData.multiple" filterable
            :clearable="selectData.clearable" collapse-tags placeholder="请选择">
            <template v-if="selectData.multiple">
                <el-input style="width: 90%;margin-left: 5%" v-model="selectData.searchValue" placeholder="请输入搜索内容"></el-input>
                <el-row>
                    <el-col style="padding: 5% 0 0 10%" :span="12">
                        <el-checkbox v-model="selectData.checkboxValue" style="margin-left: 15%;margin-bottom: 10px" @change="check_all">全部</el-checkbox>
                    </el-col>
                    <el-col style="padding: 4% 0 0 10%" :span="12">
                        <el-button size="small" class="check_button" @click="check_other">反选</el-button>
                    </el-col>
                </el-row>
            </template>
            <el-option v-show="optionFlag" v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: false,
                optionFlag: true,
                selectData: {
                    optionArr: [],
                    options: [],
                    value: [],
                    checkboxValue: false,
                    searchValue: '',
                    multiple: true,
                    clearable: true,
                },
                searchDatas: "",
            }
        },
        created() {
            this.selectData = this.prop.data;
            this.searchDatas = this.prop.searchDatas;
            this.initOptionArr(this.selectData.options);
        },
        methods: {
            selectChange() {
                if (!this.selectData.relation && !this.selectData.relationField) { return; }
                this.$parent.$parent.parentSearchEvent(this.selectData);
            },
            initOptionArr(datas) {
                let data = datas ? datas : this.selectData.options;
                this.selectData.optionArr = [];
                if (!data) { return; }
                for (let item of data) {
                    let obj = {};
                    for (let field in item) {
                        obj[field] = item[field];
                    }
                    this.selectData.optionArr.push(obj);
                }
            },
            check_all(val) {
                this.selectData.checkboxValue = val;
                this.selectData.value = []
                if (!val) { return; }
                for (let obj of this.selectData.options) {
                    if (!obj.value) { continue }
                    this.selectData.value.push(obj.value)
                }
                this.selectChange();
            },
            check_other() {
                if (!this.selectData.value.length) {
                    this.check_all(true);
                    return;
                }
                let newValue = [];
                for (let obj of this.selectData.options) {
                    if (!obj.value || this.selectData.value.indexOf(obj.value) > -1) { continue }
                    newValue.push(obj.value)
                }
                this.selectData.value = newValue;
                if (!newValue.length) {
                    this.selectData.checkboxValue = false;
                }
                this.selectChange();
            }
        },
        computed: {
            changeSelectData() {
                return this.prop.dataFlag;
            },
            changeValue() {
                return this.selectData.value;
            },
            changeSearchValue() {
                return this.selectData.searchValue;
            }
        },
        watch: {
            changeSelectData(prop) {
                if((this.prop.data.relation || this.prop.data.relationField) && this.prop.currentcomp 
                && this.prop.currentcomp.split(",").indexOf(this.prop.data.field) == -1){
                    this.loading = this.prop.dataFlag;
                }
                this.optionFlag = !this.optionFlag;
                this.selectData = this.prop.data;
                this.searchDatas = this.prop.searchDatas;
                this.optionFlag = !this.optionFlag;
            },
            changeValue(val) {
                if (!val.length) { this.selectData.checkboxValue = false; return; }
                if (!val[0]) { this.selectData.value = [] }
                if (val.length == this.selectData.options.length) {
                    this.selectData.checkboxValue = true;
                } else {
                    this.selectData.checkboxValue = false;
                }

            },
            changeSearchValue(val) {
                if (!val) {
                    this.selectData.options = this.selectData.optionArr.filter(data => {
                        return data;
                    });
                    return;
                }
                this.selectData.options = this.selectData.optionArr.filter(data => {
                    if (data.label && data.label.indexOf(val) > -1) {
                        return data;
                    }
                });
                if (!this.selectData.options.length) {
                    this.selectData.options = [{}];
                }
            }
        },
    }
</script>
<style>
    .check_button {
        border: 1px solid #ddd;
        font-size: 13px;
        border-radius: 4px;
        padding: 2px 8px;
        font-family: inherit;
        line-height: 16px;
    }

    .el-select__tags {
        max-width: 100% !important;
    }

    .el-select__tags-text {
        display: inline-block;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .el-input--small .el-input__inner {
        height: 28px;
        line-height: 28px;
    }

    .select_style {
        width: 130px;
        height: 28px;
    }
</style>