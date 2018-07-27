const api = require('../../utils/api.js');
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
            url: '../index/index?redict=myfindorder',
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let sn = options.sn,
            membertype = options.membertype;
        this.setData({
            sn,
            membertype
        });

        api.demandInfo({
            data: {
                id: sn
            }
        }).then((res) => {

            console.log(res)
            this.setData({
                info: res.data
            })

        }).catch((err) => {

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