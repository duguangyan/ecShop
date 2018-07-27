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

        let order_no = options.order_no;

        wx.showNavigationBarLoading();

        api.myPackageOrderList({
            data: {
                pay_status: 1,
                order_no,
            }

        }).then((res) => {

            let packageData = res.data.list[0];
            console.log('我的套餐列表详情', packageData);
            packageData.packageData = JSON.parse(packageData.package_data);

            this.setData({
                packageData
            })

        }).catch((err) => {



        }).finally(() => wx.hideNavigationBarLoading())

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