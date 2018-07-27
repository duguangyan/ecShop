let app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    //   payment支付
    payment(e) {

        let id = e.currentTarget.dataset.id,
            type = this.data.type;

        console.log('支付参数', type, id)

        // 禁用按钮
        this.setData({
            hasSubmit: true
        })

        // 套餐支付接口调用

        if (type === 'package') {

            api.packageOrderPay({
                method: "POST",
                data: {
                    id,
                    'type': 'wxbiz',
                    'pay_type': 2
                }
            }).then((res) => {

                // 发起微信支付
                wx.requestPayment({
                    ...res.data.pay,
                    success: (res) => {

                        console.log('发起微信支付正确返回', res);

                        wx.redirectTo({
                            url: `../payPackageSuccess/payPackageSuccess?sn=${id}`,
                        })

                    },
                    fail: (err) => {
                        console.log('发起微信支付错误返回,取消事件', err)
                    }
                });

            }).catch((err) => {
                console.log('套餐支付返回', err);

                util.errorTips('支付错误，请重试');
            }).finally(() => {

                this.setData({
                    hasSubmit: false
                })
            })


        }

        // 找料支付接口调用
        else if (type === 'find') {

            // 同意调用支付接口
            api.demandPay({
                data: {
                    id,
                    'type': 'wxbiz',
                    'pay_type': 2
                }
            }).then((res) => {

                console.log('请求支付返回', res.data, res.data.pay);

                // 发起微信支付
                wx.requestPayment({
                    ...res.data.pay,
                    success: (res) => {

                        console.log('发起微信支付正确返回', res);

                        wx.redirectTo({
                            url: `../payFindSuccess/payFindSuccess?sn=${id}`,
                        })

                    },
                    fail: (err) => {
                        console.log('发起微信支付错误返回,取消事件', err)
                    }
                });


            }).catch((err) => {
                console.log('支付返回', err);
                util.errorTips('支付错误，请重试');

            }).finally(() => {

                this.setData({
                    hasSubmit: false
                })
            })




        } else {


            // 同意调用支付接口
            api.payment({
                data: {
                    id,
                    'type': 'wxbiz',
                    'pay_type': 2
                }
            }).then((res) => {

                console.log('请求支付返回', res.data, res.data.pay);

                // 发起微信支付
                wx.requestPayment({
                    ...res.data.pay,
                    success: (res) => {

                        console.log('发起微信支付正确返回', res);

                        wx.redirectTo({
                            url: '../myOrder/myOrder?status=3',
                        })

                    },
                    fail: (err) => {
                        console.log('发起微信支付错误返回,取消事件', err)
                    }
                });

            }).catch((err) => {
                console.log('支付返回', err);
                util.errorTips('支付错误，请重试');

            }).finally(() => {

                this.setData({
                    hasSubmit: false
                })
            })


        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('支付页面参数', options);
        let id = options.id,
            sn = options.sn,
            amount = options.amount,
            type = options.type;

        this.setData({
            id,
            sn,
            amount,
            type
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

})