const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

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
            name: '待支付'
        }, {
            id: 2,
            name: '待审核'
        }, {
            id: 5,
            name: '待分配'
        }, {
            id: 3,
            name: '找料中'
        }],

        orderStatus: {

        },
        modalShow: true
    },
    
    // 去支付
    payOrder(e) {

        let id = e.currentTarget.dataset.id,
            amount = e.currentTarget.dataset.amount;

        wx.navigateTo({
            url: `../onlinePayment/onlinePayment?type=find&id=${id}&sn=${id}&amount=${amount}`
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

        api.demandList({
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

        api.demandList({
            data: params
        }).then((res) => {

            let orderList = res.data.list;

            if (orderList.length !== 0) {

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