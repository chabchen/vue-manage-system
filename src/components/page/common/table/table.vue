<template>
    <div v-loading="loading">
        <div class="head-title">
            <p>{{title}}</p>
        </div>
        <el-table :data="tableData" border stripe>
            <template v-for="(col, index) in tableColumns">
                <el-table-column
                    show-overflow-tooltip
                    :key="index"
                    :prop="col.prop"
                    :label="col.label" 
                />
                <!-- v-if="col.style=='normal'"
                :width="col.width"
                :min-width="col.minWidth"
                :header-align="col.headerAlign"
                :column-key="index.toString()" -->
            </template>   
        </el-table>
    </div>
</template>

<script>

import {requestData} from '@/api/RequestData';

export default {
    props: {prop: Object},
    data() {
        return {
            loading: true,
            title:'',
            tableColumns:[],
            tableData: [{
            date: '天猫',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '苏宁',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '京东',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }, {
            date: '拼多多',
            name: '333',
            sss: '2222',
            ddd: '2222',
            fff: '2222',
            ggg: '2222'
            }]
        }
    },
    created() {
        this.tableColumns = this.prop.config.items;
        this.title = this.prop.config.title;
        this.getData();
    },
    methods: {
        
       getData : function(params) {
            this.loading = false;
            requestData('/report/list','get').then(res => {
               
                if(res.datas && res.datas.length){
                    this.tableData = [];
                    this.tableData = res.datas;
                    this.tableColumns = res.datas2;
                }              
                this.loading = false;
            });
       }
    }
}
</script>
<style scoped>
    .head-title{ 
    font-family: 'Arial Normal', 'Arial';
    font-weight: 600;
    font-style: normal;
    font-size: 20px;
    letter-spacing: normal;
    color: #333333;
    vertical-align: none;
    line-height: 50px;
    text-transform: none;
    background: #409eff;
    color: #fff;
    padding-left:15px;
    margin: 30px 0 30px 0;
    }
    .head-title p{
        display:inline-block;
    }
</style>