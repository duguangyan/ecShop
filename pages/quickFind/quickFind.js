const api = require('../../utils/api.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    //  联系我们电话
    contact() {
        wx.makePhoneCall({
            phoneNumber: '400-8088-156'
        })
    },

    // 去找料
    goFind() {

        let token = app.globalData.token;

        if (token) {
            wx.navigateTo({
                url: '../xiaoluSearch/xiaoluSearch',
            })
        } else {
            // 跳转关联页面
            wx.navigateTo({
                url: '../associatedAccount/associatedAccount',
            })
        }

    },

    // 去充值  
    goReCharge() {

        let token = app.globalData.token;

        if (token) {
            wx.navigateTo({
                url: '../rechargePackage/rechargePackage',
            })
        } else {
            // 跳转关联页面
            wx.navigateTo({
                url: '../associatedAccount/associatedAccount',
            })
        }

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //设置服务人数
        api.serviceNum({

        }).then((res) => {
            console.log(res);
            let serviceData = res.data;
            this.setData({
                serviceData
            })
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

        wx.stopPullDownRefresh();

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