const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

        //发票信息
        invoiceData: {
            inv_type: 1,
            inv_way: 1,
            inv_payee: '个人',
            inv_tax: '',
        },

    },

    // 提交订单
    submitOrder() {

        this.setData({
            hasSubmit: true
        })

        let data = {
            ...this.data.invoiceData,
            // 2是微信 1是支付宝
            pay_type: 2,
            // 小程序
            type: 'wxbiz',
            distribution_id: this.data.firmInfo.distribution_id,
            package_id: this.data.firmInfo.id
        }

        api.addPackageOrder({
            method: "POST",
            data
        }).then((res) => {

            console.log('订单提交', res);
            let orderinfo = res.data;

            wx.redirectTo({
                url: `../onlinePayment/onlinePayment?type=package&id=${orderinfo.id}&sn=${orderinfo.order_no}&amount=${orderinfo.pay_price}`,
            })

        }).catch((err) => {

            util.errorTips('发生了错误');

        }).finally(() => {

            this.setData({
                hasSubmit: false
            })
        })


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('订单确认信息', options);



        // 包月用户实际费用相加
        if (options.servicePrice) {
            options.totle = util.accAdd(options.packagePrice, options.servicePrice)
        } else {
            options.totle = options.packagePrice;
        }

        this.setData({
            firmInfo: options
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