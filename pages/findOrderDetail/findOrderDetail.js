const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    // 去支付
    payOrder(e) {

        let id = e.currentTarget.dataset.id,
            amount = e.currentTarget.dataset.amount;

        wx.navigateTo({
            url: `../onlinePayment/onlinePayment?type=find&id=${id}&sn=${id}&amount=${amount}`
        })

    },
    // 确认收货
    ReceivingConfirm(e) {

        let order_id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '温馨提示',
            content: '选择确认前，请确保货品已接收',
            confirmColor: '#C81A29',
            success: (res) => {

                if (res.confirm) {
                    console.log('用户点击确定');

                    api.confirmReceipt({
                        data: {
                            order_id
                        }
                    }).then((res) => {
                        console.log(res)
                        util.successTips('已确认收货');
                        // 请求更新数据  更改样式
                        this.updataOrder(order_id);

                    }).catch((err) => {
                        util.errorTips('操作失败');
                    })

                }

            },
            fail: () => {

            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.showNavigationBarLoading();

        let status = options.status,
            id = options.orderid;

        console.log(status, id);
        this.setData({
            status
        })

        this.updataOrder(id)


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
    // 更新数据
    updataOrder(id) {

        api.demandInfo({
            data: {
                id
            }
        }).then((res) => {

            console.log('订单详情', res);
            let orderData = res.data;
         
            this.setData({
                orderData,
            })

        }).catch((err) => {

        }).finally( () => wx.hideNavigationBarLoading())
    }

})