
const timer = require('../../utils/wxTimer.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
       
    },

    /**
     * 组件的初始数据
     */
    data: {
        wxTimerList: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {
       

    },
    // 初次渲染
    ready() {

        // let nowTime = + new Date();

        // console.log(nowTime, timer);

        //开启第一个定时器
        var wxTimer = new timer({
            beginTime: "00:00:10",
            name:'rr'
        })

        console.log('================',this)
        wxTimer.start(this);
       // wxTimer.stop();

    }
})
