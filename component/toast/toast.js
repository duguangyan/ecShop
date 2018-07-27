let timer;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        params: {
            type: 'Object',
            value: {
                type: 'success',
                text: '操作成功',
                timer: 3000,
                color: '#FFF',
                visible: false
            },
            observer() {

                if (this.data.params) {

                    clearTimeout(timer)

                    timer = setTimeout(() => {

                        this.setData({
                            params: {
                                ...this.data.params,
                                visible: false
                            }
                        })

                    }, this.data.params.timer)

                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

        _hide() {

        }

    },

    attached() {

        // wx.showToast({
        //     title: '信息反馈我粗了是是的',
        //     duration: 16000
        // })
        //console.log('timer',this.data.params.timer)



    }


})
