const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    // 发布订单需求
    remand() {
        wx.reLaunch({
            url: '../index/index?redict=xiaoluSearch'
        })
    },
    // 产看订单详情
    checkOrderDetail() {

        wx.reLaunch({
            url: '../index/index?redict=mypackageorder',
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //   请求订单信息
        let order_no = options.sn;

        api.myPackageOrderList({
            data: {
                order_no,
            }
        }).then((res) => {

            let packageData = res.data.list[0];
            console.log('支付成功我的套餐详情', packageData);
            packageData.packageData = JSON.parse(packageData.package_data);

            this.setData({
                packageData
            })

        }).catch((err) => {


        })


        // 更新获取会员信息
        api.memberInfo({

        }).then((res) => {
            console.log('用户信息 = ', res);
            app.globalData.memberInfo = res.data;

            this.setData({
                memberInfo: res.data
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