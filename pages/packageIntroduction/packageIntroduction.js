// pages/packageIntroduction/packageIntroduction.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cmUrls: [
            'https://static.yidap.com/miniapp/packageIntroduction/month-info.png',
            'https://static.yidap.com/miniapp/packageIntroduction/times-info.png',
            'https://static.yidap.com/miniapp/packageIntroduction/normal-info.png'
        ],
        currentIndex: 0,

    },
    // 点击套餐
    selectPage (e) {

        let currentIndex = e.currentTarget.dataset.index;

        this.setData({
            currentIndex
        })

    },
    // 滑动操作
    slider(e) {
        console.log(e.detail);
        let currentIndex = e.detail.current;

        this.setData({
            currentIndex
        })
    },

    becomeMember () {
        console.log('000000000', this.data.direction)
        // 根据设置返回方向，选择按钮跳转方向
        if (this.data.direction === 'back'){
            wx.navigateBack({ })
            return false;
        }

        wx.redirectTo({
            url: '../rechargePackage/rechargePackage',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let direction = options.direction;
        // 控制按钮操作方向
        this.setData({
            direction
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