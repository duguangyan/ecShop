const api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        requestBody: null,
        moreList: [],

        modalShow: true,
        // 筛选活动
        filterTag: []

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
        
        this.data.requestBody.q = searchData;
        this.data.requestBody.cat = 0;
        this.search(this.data.requestBody);
    },


    optionsPage() {

        wx.navigateTo({
            url: '../filterOptions/filterOptions',
        })
    },

    sortTap(e) {
        console.log('逻辑混乱', e);

        this.setData({

        });

        const current = e.currentTarget.dataset.current;

        if (current === 'default') {

            this.data.requestBody.sort = current;
            this.search(this.data.requestBody);

        } else if (current === 'price-asc') {

            this.data.requestBody.sort = current;
            this.search(this.data.requestBody);
        }
        else if (current === 'price-desc') {

            this.data.requestBody.sort = current;
            this.search(this.data.requestBody);

        }


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('列表页options = ', options);

        const searchValue = options.search || '';

        const cate = options.cate || 0;

        this.search({
            q: searchValue,
            page: 1,
            page_size: 10,
            sort: 'default',
            cat: cate
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
        console.log('触底 = =、');
        this.searchMore(this.data.requestBody);

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    search(data = {}) {

        data.page = 1;

        this.setData({
            modalShow: false,
            shopLoadingComplete: false,
            shopLoading: false,
            // 隐藏无商品标记
            noGoods: false
        })

        api.search({
            data
        }).then((res) => {

            const itemlist = res.data.itemlist;
            console.log('搜索列表数据 = ', res);
            if (itemlist.length !== 0) {

                if (itemlist.length < 10) {
                    var shopLoading = false;
                } else {
                    var shopLoading = true;
                }

                this.setData({
                    itemlist,
                    searchValue: data.q,
                    filterTag: res.data.nav.breadcrumbs.propSelected,
                    requestBody: data,
                    filterSelect: data.sort,
                    page: data.page,
                    shopLoading,
                    shopLoadingComplete: !shopLoading

                })
            } else {

                this.setData({
                    itemlist,
                    searchValue: data.q,
                    filterTag: res.data.nav.breadcrumbs.propSelected,
                    requestBody: data,
                    filterSelect: data.sort,
                    page: data.page,
                    noGoods: true,
                    // shopLoadingComplete: true,
                    // shopLoading: false
                });

            }
            // 处理历史记录
            let searchData = data.q;

            if (searchData === '') {
                return false;
            }
            let history = wx.getStorageSync('searchHistory') || [];
            let itemIndex = history.indexOf(searchData);

            if (itemIndex > -1) {
                history.splice(itemIndex, 1)
            }

            history.unshift(searchData);

            if (history.length > 5) {
                history.length = 5;
            }

            wx.setStorage({
                key: 'searchHistory',
                data: history,
            })

        }).catch((err) => {

        }).finally(() => {
            console.log('加载全test', this.data.modalShow)
            this.setData({
                modalShow: true
            })
        })

    },
    searchMore(data = {}) {

        data.page++;

        api.search({
            data
        }).then((res) => {
            let itemlist = res.data.itemlist;
            console.log('搜索列表数据 = ', res);

            if (itemlist.length !== 0) {

                this.setData({
                    itemlist: this.data.itemlist.concat(itemlist),
                    shopLoading: true,
                    shopLoadingComplete: false,
                    requestBody: data,
                })

            } else {
                console.log('没有数据了')
                this.setData({
                    shopLoadingComplete: true,
                    shopLoading: false
                });
            }
        })

    }

})