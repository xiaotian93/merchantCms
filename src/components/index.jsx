import React , { Component } from 'react';
import { Row , Col } from 'antd';
import echarts from 'echarts';

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            min_height:window.innerHeight
        }
    }
    componentWillMount () {
        
    }
    componentDidMount(){
        // let containers = document.querySelectorAll(".chart-container");
        // console.log(containers)
        // containers.forEach(function(item){
        //     item.style.width = item.parentNode.clientHeight + "px";
        //     console.log(item.parentNode,item.parentNode.clientHeight)
        // })
        let option = {
            grid:[
                {x: '20%', y: '3%', width: '80%', height: '75%'}
            ],
             xAxis: {
                data: [],
                axisTick: {show: false},
                axisLine: {
                    show: false
                },
            },
            yAxis: {
                minInterval: 200,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} W'
                }
                // axisLabel: {
                //     textStyle: {
                //         color: '#d6d6d6'
                //     }
                // }
            },
            series: [{
                type: 'bar',
                animationDuration: 3000,
                itemStyle: {
                    normal: {
                        color: '#2DA1F8'
                    }
                },
                barWidth: 40,
                data: [ 291]
            },
            {
                type: 'bar',
                animationDuration: 3000,
                itemStyle: {
                    normal: {
                        color: '#34659F',
                    }
                },
                barGap: '90%',
                barWidth: 40,
                data: [473]
            }
            ]
        }

        let option_line = {
            grid:[
                {x: 60, y: '3%', width: '80%', height: '75%'}
            ],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                minInterval: 2000,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#d6d6d6'
                    }
                },
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    symbol: 'none',
                    type:'line',
                    animationDuration: 1000,
                    itemStyle: {
                        normal: {
                            color: '#1A91EB'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: "#e9f4fd"
                        }
                    },
                    data: [ 800,1000,5100,700,1300,3200,500 ]
                }
            ]
        }
        // 基于准备好的dom，初始化echarts实例
        let myChart_bill = echarts.init(document.getElementById('chart-bill'));
        let myChart_money = echarts.init(document.getElementById('chart-money'));
        let bill_total = echarts.init(document.getElementById('bill-total'));
        let money_total = echarts.init(document.getElementById('money-total'));
        // 绘制图表
        myChart_bill.setOption(option);
        myChart_money.setOption(option);
        bill_total.setOption(option_line);
        money_total.setOption(option_line);
    }
    render() {
        
        let color_today = "#2DA1F8 ";
        let color_yesterday = "#34659F";
        return (
            <Row className = "content index-sh">
                <Row>
                    <h3 className="title">今日</h3>
                    <Col span={10} className="chart-content chart-left">
                        <div className="chart-title">已完成订单量</div>
                        <div id="chart-bill" className="chart-container" style={{width:"240px",height:170+"px"}} />
                        <div className="chart-explain">
                            <div style={{color:color_today}}>
                                <div className="icon" style={{backgroundColor:color_today}} />
                                <div className="name">今日订单数</div>
                                <div className="num">
                                    4564
                                </div>
                            </div>
                            <div style={{color:color_yesterday}}>
                                <div className="icon" style={{backgroundColor:color_yesterday}} />
                                <div className="name">昨日订单数</div>
                                <div className="num">
                                    299
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={14} className="chart-content chart-right">
                        <div className="chart-title">已投保费总额</div>
                        <div id="chart-money" className="chart-container" style={{width:"240px",height:170+"px"}} />
                        <div className="chart-explain">
                            <div style={{color:color_today}}>
                                <div className="icon" style={{backgroundColor:color_today}} />
                                <div className="name">今日保费总额</div>
                                <div className="num">
                                    4,702,543.12
                                </div>
                            </div>
                            <div style={{color:color_yesterday}}>
                                <div className="icon" style={{backgroundColor:color_yesterday}} />
                                <div className="name">昨日保费总额</div>
                                <div className="num">
                                    2,213,167.59
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <h3 className="title week">本周</h3>
                    <Col span={12} className="chart-content chart-left">
                        <div className="chart-title">订单总量
                            <div className="chart-corner">
                                <div className="chart-icon" />
                                今日订单数
                            </div>
                        </div>
                        <div id="bill-total" className="chart-container" style={{width:"85%",height:170+"px"}} />
                    </Col>
                    <Col span={12} className="chart-content chart-right">
                        <div className="chart-title">已投保费总额
                            <div className="chart-corner">
                                <div className="chart-icon" />
                                今日订单数
                            </div>
                        </div>
                        <div id="money-total" className="chart-container" style={{width:"85%",height:170+"px"}} />
                    </Col>
                </Row>
            </Row>
        )
    }
}


export default Index;