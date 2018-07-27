// pages/orderSuccess/orderSuccess.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 继续购物（返回首页）
    continueShopping() {
        wx.reLaunch({
            url: '../index/index'
        })
     },
    // 产看订单详情
    checkOrderDetail() {

        wx.reLaunch({
            url: '../index/index?redict=myorder',
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let sn = options.sn;
        this.setData({
            sn
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

    }

})