const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

let test = true;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        firstIn: true,

        tab: [{
            id: 0,
            name: '全部'
        },
        {
            id: 1,
            name: '待审核'
        }, {
            id: 2,
            name: '待付款'
        }, {
            id: 3,
            name: '待收货'
        }, {
            id: 4,
            name: '已完成'
        }],

        orderStatus: {

        },
        modalShow: true
    },
    // 取消订单
    cancelOrder(e) {

        let id = e.currentTarget.dataset.id;

        wx.showModal({
            title: '温馨提示',
            content: '确认删除此订单？',
            confirmColor: '#C81A29',
            success: (res) => {

                if (res.confirm) {
                    console.log('用户点击确定')


                    api.cancelOrder({
                        data: {
                            order_id: id
                        }
                    }).then((res) => {
                        console.log(res);

                        wx.showToast({
                            title: '取消订单成功',
                        })

                        // 请求更新数据
                        let params = this.data.params;
                        this.loadData(params);


                    }).catch((err) => {

                        util.errorTips('取消失败');

                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }

            },
            fail: () => {

            }
        })



    },
    // 去支付
    payOrder(e) {

        let id = e.currentTarget.dataset.id,
            sn = e.currentTarget.dataset.sn,
            amount = e.currentTarget.dataset.amount;

        wx.navigateTo({
            url: `../onlinePayment/onlinePayment?id=${id}&sn=${sn}&amount=${amount}`
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
                        // 请求更新数据
                        let params = this.data.params;
                        this.loadData(params);

                    }).catch((err) => {
                        util.errorTips('操作失败');
                    })

                }

            },
            fail: () => {

            }
        })

    },
    // 顶部tab栏选择
    selectTab(e) {

        let status = e.currentTarget.dataset.id;

        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })

        this.setData({
            status,
            modalShow: false,
            loading: false,
            loadComplete: false,
            // 隐藏空订单
            noOrder: false,

        })

        let params = this.data.params;

        params.status = status;

        this.loadData(params);

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('onLoad', test)

        if (this.data.firstIn) {

            let status = options.status;

            this.setData({
                status,
                modalShow: false,
            })

            let params = {
                page: 1,
                pageSize: 20,
                status
            };

            this.loadData(params);

        }


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

        // 返回刷新页面数据

        if (!this.data.firstIn) {

            let params = this.data.params;

            this.loadData(params);
        }

        this.data.firstIn = false;

        test = false
        console.log('onShow', test)

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

        this.loadMoreData(this.data.params);

    },

    // 加载数据
    loadData(params = {}) {

        params.page = 1;

        api.orderList({
            data: params
        }).then((res) => {
            console.log(res);

            let orderList = res.data.list;

            if (orderList.length === 0) {

                this.setData({
                    orderList,
                    params,
                    modalShow: true,
                    noOrder: true,
                    loadComplete: false,
                    loading: false
                })

            } else {

                let loading;

                if (orderList.length < 20) {
                    loading = false;
                } else {
                    loading = true;
                }

                // 计算数量
                orderList.forEach((ele, i) => {
                    ele.order_totle_num = 0;
                    ele.goods.forEach((val, j) => {
                        ele.order_totle_num += val.goods_number;
                    })
                })

                this.setData({
                    orderList,
                    params,
                    modalShow: true,
                    loading,
                    loadComplete: !loading,
                })
            }

        }).catch((res) => {

        })

    },

    //触底加载
    loadMoreData(params = {}) {

        params.page++;

        api.orderList({
            data: params
        }).then((res) => {

            let orderList = res.data.list;

            if (orderList.length !== 0) {

                // 计算数量
                orderList.forEach((ele, i) => {
                    ele.order_totle_num = 0;
                    ele.goods.forEach((val, j) => {
                        ele.order_totle_num += val.goods_number;
                    })
                })

                this.setData({
                    orderList: this.data.orderList.concat(orderList),
                    loading: true,
                    loadComplete: false,
                    params
                })

            } else {
                console.log('没有数据了')
                this.setData({
                    loading: false,
                    loadComplete: true,
                });
            }
        })

    }

})