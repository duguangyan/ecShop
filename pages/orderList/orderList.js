const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let index = options.index,
            totle = options.totle,
            orderid = options.orderid;

        console.log('orderid',orderid)

        api.getCartList({
            data: {
                cart_ids: orderid
            }
        }).then((res) => {

            console.log('订单信息 == ', res.data);
            let orderList = res.data[index];
            console.log('清单信息 == ', orderList);

            orderList.skus.forEach( (ele, i) => {

                ele.totle = util.mul(ele.shop_price, ele.number);

            })

            orderList.totle_num = totle;
            this.setData({
                orderList,
               
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

    }

})