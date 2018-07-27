// pages/map/map.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        longitude: 113.251069,
        latitude: 23.350864,
        scale: 14,

        polyline: [{
            points: [{
                longitude: 113.23326,
                latitude: 23.365255,
            },
            {
                longitude: 113.256005,
                latitude: 23.369903,
            },
            {
                longitude: 113.285273,
                latitude: 23.33531,
            },
            {
                longitude: 113.220728,
                latitude: 23.340669,
            }, {
                longitude: 113.23326,
                latitude: 23.365255,
            }],
            color: "#000000",
            width: 6,
            dottedLine: false,
            arrowLine: true
        }],

        markers: [{
            id: 0,
            longitude: 113.251069,
            latitude: 23.350864,
            width: 50,
            height: 50
        }],

        circles: [{
            longitude: 113.251069,
            latitude: 23.350864,
            color: '#FF0000DD',
            fillColor: '#7cb5ec88',
            radius: 1400,
            strokeWidth: 1
        }]

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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