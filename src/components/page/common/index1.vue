<template>
    <div class="container">
     <div class="fix">
        <async-load-comp v-for="(item,index) in comps" :key="index" :app="item.app" :prop="item.prop"></async-load-comp>
     </div>
   </div>
</template>
<script>
    import asyncLoadComp from './asyncLoadComp.vue'
    export default {
        components: { asyncLoadComp },
        data() {
            return {
                comps: [
                    // {app: 'filter/filter-radio', prop: {
                    //     config:{
                    //         radioData:{
                    //             value: '日报',
                    //             items:[{label:'日报'},{label:'月报'},{label:'年报'}]
                    //         }
                    //     } }
                    // },
                    // {app: 'title/title-kpi', prop: {
                    //     config:{
                    //         items: [
                    //             { 'key': '重点产品折前收入', 'value': '111' },
                    //             { 'key': '重点产品达成', 'value': '222' },
                    //             { 'key': '新品折前收入', 'value': '333' },
                    //             { 'key': '新品销售贡献', 'value': '444' }
                    //         ]
                    //     }}
                    // },

                    // // {app: 'filter/ConditionalSeaech', prop: { 
                    // //     config:{
                    // //         searchData:{
                    // //             beginDate:'',
                    // //             endDate:'',
                    // //             bigAreaName:'',
                    // //             bigAreas:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             regionName:'',
                    // //             regions:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             cityName:'',
                    // //             cities:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             pasture:'',
                    // //             pastures:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             diseaseType:'',
                    // //             diseaseTypes:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             cowCategory:'', 
                    // //             cowCategorys:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             fetusCategory:'',
                    // //             fetusCategorys:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }],
                    // //             lactationTimes:'',
                    // //             lactations:[{ value: '选项1', label: '黄金糕' }, { value: '选项2', label: '双皮奶' }]
                    // //         }
                    // //         }
                    // //  }},
                    // {app: 'filter/filter-card', prop: {
                    //     config:{
                    //         items: {
                    //             checked: false,
                    //             label: '疾病奶量损失',
                    //             value: 123,
                    //             unit: '吨',
                    //             details: [
                    //                 [{ label: '同比', value: '33', unit: '%' }, { label: '环比', value: '33', unit: '%' }],
                    //                 [{ label: '同比', value: '22', unit: '%' }, { label: '环比', value: '22', unit: '%' }]
                    //             ]
                    //         }
                    //     }}
                    // },
                    // {app: 'filter/filter-card', prop: {
                    //     config:{
                    //         items: {
                    //             checked: false,
                    //             label: '发病率',
                    //             value: 123,
                    //             unit: '吨',
                    //             details: [
                    //                 [{ label: '同比', value: '55', unit: '%' }, { label: '环比', value: '55', unit: '%' }],
                    //                 [{ label: '同比', value: '66', unit: '%' }, { label: '环比', value: '66', unit: '%' }]
                    //             ]
                    //         }
                    //     }}
                    // },
                    {app: 'echarts/BarStack', prop: {
                        config:{
                            chartSettings: {stack: { '用户': ['访问用户', '下单用户','等等用户'] }},
                            chartData: {
                                columns: ['日期', '访问用户', '下单用户','等等用户', '下单率'],
                                rows: [
                                    { '日期': '1/1', '访问用户': 1393, '下单用户': 1093,'等等用户': 1093, '下单率': 0.32 },
                                    { '日期': '1/2', '访问用户': 3530, '下单用户': 3230,'等等用户': 3230, '下单率': 0.26 },
                                    { '日期': '1/3', '访问用户': 2923, '下单用户': 2623,'等等用户': 2623, '下单率': 0.76 },
                                    { '日期': '1/4', '访问用户': 1723, '下单用户': 1423,'等等用户': 1423, '下单率': 0.49 },
                                    { '日期': '1/5', '访问用户': 3792, '下单用户': 3492,'等等用户': 3492, '下单率': 0.323 },
                                    { '日期': '1/6', '访问用户': 4593, '下单用户': 4293,'等等用户': 4293, '下单率': 0.78 }
                                ]
                            }
                        }}
                    },
                    {app: 'echarts/LineBar2', prop: { 
                        config:{
                            selectData: {
                                title: '疾病损失-泌乳天数视角',
                                label: '指标分组',
                                value: '',
                                options: [{ value: '选项1', label: '经济损失' }, { value: '选项2', label: '奶量损失' }]
                            },
                            chartData: {
                                columns: ['日期', '访问用户', '下单用户','用户下单', '下单率'],
                                rows: [
                                    { '日期': '1/1', '访问用户': 1393, '下单用户': 1093,'用户下单': 1093, '下单率': 2232 },
                                    { '日期': '1/2', '访问用户': 3530, '下单用户': 3230,'用户下单': 3230, '下单率': 223 },
                                    { '日期': '1/3', '访问用户': 2923, '下单用户': 2623,'用户下单': 2623, '下单率': 2276 },
                                    { '日期': '1/4', '访问用户': 1723, '下单用户': 1423,'用户下单': 1423, '下单率': 1234 },
                                    { '日期': '1/5', '访问用户': 3792, '下单用户': 3492,'用户下单': 3492, '下单率': 4222 },
                                    { '日期': '1/6', '访问用户': 4593, '下单用户': 4293,'用户下单': 4293, '下单率': 5278 }
                                ]
                            },
                            chartExtend: {
                                series: {
                                    symbolSize: 5,
                                    barWidth:20,
                                    label: { normal: { show: false } },//显示节点的值
                                },
                                yAxis: {
                                    splitLine: { show: false },
                                    axisLine: { show: false },
                                    axisTick: { show: false }
                                },
                                xAxis: {
                                    splitLine: { show: true },
                                    axisLine: { show: true },
                                    axisTick: { show: true }
                                }
                            },
                            chartSettings: {
                                showBar: ['下单用户','下单率'],
                                showLine: ['访问用户','用户下单'],
                                yAxisName: ['数值', '比率'],
                                axisSite: { right: ['下单率'] }, 
                                chartColor: ['#89dd47', '#3cabf4']
                            }
                        }}
                    },
                    {app: 'echarts/Line', prop: {
                        config:{
                            selectData: {
                                title: '疾病损失-泌乳天数视角',
                                label: '指标分组',
                                value: '',
                                showSelect: true,
                                options: [{ value: '选项1', label: '经济损失' }, { value: '选项2', label: '奶量损失' }]
                            },
                            chartData: {
                                columns: ['日期', '访问用户', '下单用户', '下单率'],
                                rows: [
                                    { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 2232 },
                                    { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 223 },
                                    { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 2276 },
                                    { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 1234 },
                                    { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 4222 },
                                    { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 5278 }
                                ]
                            },
                            chartExtend: {
                                series: {
                                    symbolSize: 5,
                                    label: { normal: { show: false } },//显示节点的值
                                },
                                yAxis: {
                                    splitLine: { show: false },
                                    axisLine: { show: false },
                                    axisTick: { show: false }
                                },
                                xAxis: {
                                    splitLine: { show: true },
                                    axisLine: { show: true },
                                    axisTick: { show: true }
                                }
                            },
                            chartSettings: {
                                yAxisName: ['头', '%'],
                                yAxisType: ['访问用户', 'normal'],
                                axisSite: { right: ['下单率'] },
                                chartColor: ['#89dd47', '#3cabf4']
                            }
                        }}
                    },
                    // {app: 'table/TableGrid', prop: {
                    //     config:{
                    //         items: [
                    //             { prop: "date", label: "店铺" },
                    //             { prop: "name", label: "访客数" },
                    //             { prop: "sss", label: "成交人数" },
                    //             { prop: "ddd", label: "成交转化率" },
                    //             { prop: "fff", label: "GMV" },
                    //             { prop: "ggg", label: "人均消费222" }
                    //         ],
                    //         title: '流失奶站明细-大区视角'
                    //     }
                    // }
                    // },
                    // {app: 'table/DynamicTable',prop:{
                    //     config:{
                    //         items1: [
                    //             { prop: "id", label: "事业部名称", event:true,type:"open" },
                    //         ],
                    //         items2: [
                    //             { prop: "id", label: "事业部名称", event:true,type:"close"},
                    //             { prop: "id2", label: "子品牌" , event:false,type:"open" },
                    //         ],
                    //         // items3: [
                    //         //     { prop: "id", label: "事业部名称", event:true,type:"close"},
                    //         //     { prop: "id2", label: "子品牌" , event:true,type:"close"},
                    //         //     { prop: "id3", label: "SKU" },
                    //         // ],
                    //         items: [
                    //             { prop: "name", label: "姓名" },
                    //             { prop: "amount1", label: "数值" },
                    //             { prop: "amount2", label: "数值" },
                    //             { prop: "amount3", label: "数值" }
                    //         ],
                    //         level:1,
                    //         rowSpanField:['id','id2'],
                    //         title: '流失奶站明细-大区视角'
                    //     }}
                    // },
                    // {app: 'table/DynamicTable',prop:{
                    //     config:{
                    //         items1: [
                    //             { prop: "id", label: "事业部名称", event:true,type:"open" },
                    //         ],
                    //         items2: [
                    //             { prop: "id", label: "事业部名称", event:true,type:"close"},
                    //             { prop: "id2", label: "子品牌" , event:false,type:"open" },
                    //         ],
                    //         // items3: [
                    //         //     { prop: "id", label: "事业部名称", event:true,type:"close"},
                    //         //     { prop: "id2", label: "子品牌" , event:true,type:"close"},
                    //         //     { prop: "id3", label: "SKU" },
                    //         // ],
                    //         items: [
                    //             { prop: "", label: "工厂"},
                    //             { prop: "", label: "姓名",children:[
                    //                 { prop: "amount1", label: "数值1" },
                    //                 { prop: "amount2", label: "数值2" },
                    //                 { prop: "amount3", label: "数值3" }
                    //             ] },
                    //             { prop: "", label: "性别",children:[
                    //                 { prop: "amount1", label: "数值1" },
                    //                 { prop: "amount2", label: "数值2" },
                    //                 { prop: "amount3", label: "数值3" }
                    //             ] },
                    //         ],
                    //         level:1,
                    //         rowSpanField:['id','id2'],
                    //         title: '流失奶站明细-大区视角'
                    //     }}
                    // },
                ]
            }
        },
        methods: {

            parentSearchEvent(datas){
               console.log(datas);
            }
        }
    }
</script>
<style scoped>
    .container:after{
        clear:both;
        content:'';
        display:block;
        width:0;
        height:0;
        visibility:hidden;
    }
    .container { zoom:1; }

</style>