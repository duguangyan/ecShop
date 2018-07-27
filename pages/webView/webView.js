const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        params: {
            type: 'success',
            text: '操作成功',
            timer: '1500',
            color: '#FFF',
            visible: false
        }

    },
    // 获取webview信息
    getMessage(e) {
        // 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
        console.log('webview message', e)

    },

    openTips () {

        this.setData({
            params:{
                type: 'warn',
                text: '警告你不要告我啊哈哈哈',
                timer: '3000',
                color: '#FFF',
                visible: true 
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let token = app.globalData.token || wx.getStorageSync('token');
        // this.setData({
        //     url: `http://localhost:3000/ios?token=${token}`
        // })
        this.setData({
            url: `http://vartoday.com/ios?token=${token}`
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})