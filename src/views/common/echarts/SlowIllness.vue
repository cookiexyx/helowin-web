<template>
  <div id="slowIllness"></div>
</template>

<script>
export default {
    name:'SlowIllness',
    data(){
        return{

        }
    },
    mounted(){
        this.drawLine();
    },
	methods:{
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('slowIllness'))
        // 绘制图表
        myChart.setOption({
            title:{ text: '辖区内慢病现状' },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'bottom',
                data:['健康人数','心脏病人数','高血压人数','脑卒中人数','糖尿病人数','其他疾病']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true, 
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 100
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series: [{
                name: '人数',
                type: 'pie',
                radius : ['46%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '18',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data: [
                    {value:18, name:'健康人数'},
                    {value:23, name:'心脏病人数'},
                    {value:8, name:'高血压人数'},
                    {value:5, name:'脑卒中人数'},
                    {value:14, name:'糖尿病人数'},
                    {value:32, name:'其他疾病'}
                ]
            }]
        });
    }
	}
}
</script>

<style lang="scss">
#slowIllness{
	width: 50%;
	height: 400px;
}
</style>


