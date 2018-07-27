// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',
    },

    //   失焦获取输入框
    getSearchValue(e) {
        this.setData({
            searchValue: e.detail.value
        })
    },

    searchItem(e) {
        console.log('搜索按钮', e, e.type === 'tap');
        let searchData = '';
        if (e.type === 'tap') {
            if (e.currentTarget.dataset.search) {
                searchData = e.currentTarget.dataset.search;
            } else {
                searchData = this.data.searchValue;
            }

        } else {
            searchData = e.detail.value;
        }

        wx.navigateTo({
            url: `../goodsList/goodsList?search=${searchData}`,
        });

    },

    // 清除历史记录
    clearHistory () {
        
        wx.setStorage({
            key: 'searchHistory',
            data: [],
        })

        this.setData({
            historyStatus: false
        })
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

        let historyArr = wx.getStorageSync('searchHistory') || [];

        if (historyArr.length === 0) {
            this.setData({
                historyStatus: false
            })
        } else {
            this.setData({
                searchHistory: historyArr,
                historyStatus: true
            })
        }

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