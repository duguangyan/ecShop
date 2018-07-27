const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 地址id
        addressId: '',
        // 留言
        postscript_0: '',
        // 配送方式：默认配送
        receiving_way: '2',
        //发票信息
        invoiceData: {
            inv_type: 1,
            inv_way: 1,
            inv_payee: '个人',
            inv_tax: '',
        },
        froms: 'miniapp',
        payment_id: 2,
        cart_ids: ''
    },
    // 进入订单地址页
    orderAddEdit() {

        wx.navigateTo({
            url: '../consigneeAddress/consigneeAddress',
        })

    },
    // 进入新增
    addOrderAdd() {

        wx.navigateTo({
            url: '../newAddress/newAddress?type=new',
        })
    },
    // 卖家留言
    postScript(e) {

        let postScript = e.detail.value;
        this.setData({
            postscript_0: postScript
        })

    },
    // 提交订单
    submitOrder() {

        console.log('提交订单');
        let receiving_id = this.data.addressId;

        if (receiving_id.length === 0) {
            util.errorTips('请选择地址');
            return false;
        }

        let data = this.data,
            postscript_0 = data.postscript_0,
            receiving_way = data.receiving_way,
            froms = data.froms,
            payment_id = data.payment_id,
            cart_ids = data.cart_ids;


        let params = { receiving_id, receiving_way, ...data.invoiceData, froms, payment_id, cart_ids };


        api.addOrder({
            data: params
        }).then((res) => {

            // 购物车数量表示为空
            app.globalData.cartNum = 0;
            // 返回数组

            let sn = res.data.orders[0].sn,
                amount = util.toDecimal2(res.data.orders[0].amount);

            console.log(res);
            util.successTips('订单提交成功');
            wx.redirectTo({
                url:`../orderSuccess/orderSuccess?sn=${sn}`
            })
            

        }).catch((res) => {

            util.errorTips('提交失败',res);
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log(options)
        let orderid = options.orderid;

        api.getCartList({
            data: {
                cart_ids: orderid
            }
        }).then((res) => {

            // this.setData({
            //     cartList: newCartList
            // })
            console.log('订单信息 == ', res.data);

            let orderList = res.data;

            orderList.forEach((ele, i) => {

                ele.totle = ele.skus.reduce((prev, curr) => {
                    return prev + curr.number;
                }, 0)

            })
            console.log('========', orderList);

            let totlePrice = 0;
            orderList.map((ele, i) => {

                ele.skus.map((val) => {

                    totlePrice = util.accAdd(totlePrice, util.mul(val.shop_price, val.number));

                })
            })

            this.setData({
                orderList,
                totlePrice,
                cart_ids: orderid
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
        // 获取默认地址
        this.getSelectedAddress();
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

    getSelectedAddress() {
        // 获取默认地址
        api.defaultAddress({

        }).then((res) => {

            let defaultAddress = res.data;

            // 可能位空数组
            if (Array.isArray(defaultAddress)) {

                this.setData({
                    defaultAddress: false,
                    addressId: ''
                })

            } else {

                this.setData({
                    defaultAddress,
                    addressId: defaultAddress.id
                })

            }

        }).catch((res) => {

        })
    }
})