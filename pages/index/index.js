const api = require('../../utils/api.js');
var app = getApp();
//获取应用实例


Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        cmUrls: [
            {
            url: 'https://static.yidap.com/miniapp/sales/dgy-banner1.jpg',
              openType: 'navigate',
              navUrl: '../salesPromotion/salesPromotion'
            },
            {
                url: 'https://static.yidap.com/miniapp/active/banner_acitve-702.jpg',
                openType: 'navigate',
                navUrl: '../limitedPurchase/limitedPurchase'
            },
            {
                url: 'https://static.yidap.com/miniapp/banner_acitve2.jpg',
                openType: 'navigate',
                navUrl: '../goodsDetail/goodsDetail?id=328'
            },
            {
                url: 'https://static.yidap.com/miniapp/banner2.png',
                target: 'miniProgram',
                openType: 'navigate',
                navUrl: 'pages/index/index',
                appid: 'wx95dd0020bb2c868f'
            },
            {
                url: 'https://static.yidap.com/miniapp/banner3.png',
                openType: 'navigate',
                navUrl: '../goodsList/goodsList'
            }

            
        ],

        isShowCategoryList: false,
        isShowCategoryList2: true,
        isShowCategoryList3: true,
        marquee: { //交易动态
            width: 200,
            text: '热烈祝贺广州掌上包包设计有限公司成为小鹿快找签约客户！	热烈祝贺广州长保皮具厂成为小鹿快找签约客户！ 热烈祝贺温州中博进出口有限公司成为小鹿快找签约客户！ 热烈祝贺广州双璐皮具厂成为小鹿快找签约客户！ 	热烈祝贺广州艺丰皮具厂成为小鹿快找签约客户！ 	热烈祝贺广州圣迦希皮具厂成为小鹿快找签约客户！ 	热烈祝贺广州素杰设计有限公司成为小鹿快找签约客户！ 	热烈祝贺广州文景皮具厂成为小鹿快找签约客户！'
        }
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    find () {
        // wx.navigateToMiniProgram({
        //     appId: 'wx95dd0020bb2c868f',
        //     path: 'pages/index/index?token=1',
        //     extraData: {
        //         foo: 'bar'
        //     },
        //     // envVersion: 'develop',
        //     success(res) {
        //         // 打开成功
        //     }
        // })
    },
    hideCategoryList: function () {
        if (this.data.isShowCategoryList) {
            this.setData({
                isShowCategoryList: false
            })
            return false
        }
    },
    // 打开搜藏列表
    openCategoryList: function () {

        if (this.data.isShowCategoryList) {
            this.setData({
                isShowCategoryList: false
            })
            return false
        }

        api.getCategoryList({
            data: {
                parent_cid: 0
            }
        }).then((res) => {
            console.log(res);

            this.setData({
                isShowCategoryList: true,
                list1: res.data
            })

        })
    },
    openCategoryList2: function (e) {

        const parent_cid = e.currentTarget.dataset.id;
        const num = e.currentTarget.dataset.num;
        // ======

        var isExist = app.globalData.categoryListData.findIndex(function (ele, i) {
            return ele.id == parent_cid;
        })
        console.log('=====', app.globalData.categoryListData[isExist])
        if (isExist > -1) {
            this.setData({
                isShowCategoryList2: false,
                list2: app.globalData.categoryListData[isExist].data,
                isShowCategoryList3: true,
                numList1: num,
                numList2: -1
            })

            return false
        }

        // ======
        api.getCategoryList({
            data: {
                parent_cid
            }
        }).then((res) => {
            console.log(res);
            this.setData({
                isShowCategoryList2: false,
                list2: res.data,
                isShowCategoryList3: true,
                numList1: num,
                numList2: -1
            })

            // ======
            console.log(app.globalData.categoryListData);
            var isExist = app.globalData.categoryListData.some(function (ele, i) {
                return ele.id == parent_cid;
            })

            console.log(isExist)
            if (!isExist) {
                app.globalData.categoryListData.push({
                    id: parent_cid,
                    data: res.data
                })
            }

            // ======

        })
    },

    openCategoryList3: function (e) {

        const parent_cid = e.currentTarget.dataset.id;
        const num = e.currentTarget.dataset.num;

        // ======

        var isExist = app.globalData.categoryListData.findIndex(function (ele, i) {
            return ele.id == parent_cid;
        })
        console.log('=====', app.globalData.categoryListData[isExist])
        if (isExist > -1) {
            this.setData({
                isShowCategoryList3: false,
                list3: app.globalData.categoryListData[isExist].data,
                numList2: num
            })

            return false
        }

        // ======

        api.getCategoryList({
            data: {
                parent_cid
            }
        }).then((res) => {
            console.log(res);
            this.setData({
                isShowCategoryList3: false,
                list3: res.data,
                numList2: num
            })

            // ======
            console.log(app.globalData.categoryListData);
            var isExist = app.globalData.categoryListData.some(function (ele, i) {
                return ele.id == parent_cid;
            })

            console.log(isExist)
            if (!isExist) {
                app.globalData.categoryListData.push({
                    id: parent_cid,
                    data: res.data
                })
            }

            // ======
        })
    },

    // 菜单栏快捷搜索
    openSearch(e) {

        const searchData = e.target.dataset.name;

        wx.navigateTo({
            url: `../goodsList/goodsList?search=${searchData}`,
        })

    },

    onLoad: function (options) {

        console.log(options)

        // 获取首页品牌展示数据
        api.brandShow({
            data: {
                enabled: 1
            }
        }).then((res) => {

            console.log('---------', res);

            let brandList = res.data.list;
            brandList.length = 8;
            this.setData({
                brandList
            })

        }).catch((err) => {
            console.log(err)
        })

        // 运营需求跳转页面
        if (options.active) {
            
            wx.navigateTo({
                url: options.active
            });

        }

        // 外部页面重定向
        if (options.redirect) {
            wx.navigateTo({
                url: `../${options.redirect}/${options.redirect}`
            });
        }
      
        // 购物成功返回首页跳转处理
        switch (options.redict) { 
            case 'myorder':
                wx.navigateTo({
                    url: '../myOrder/myOrder?status=1'
                });
                break;

            case 'search':
                wx.navigateTo({
                    url: '../goodsList/goodsList'
                });
                break;
            case 'myfindorder':
                wx.navigateTo({
                    url: '../myFindOrder/myFindOrder?status=0'
                });
                break;

            case 'xiaoluSearch':
                wx.navigateTo({
                    url: '../xiaoluSearch/xiaoluSearch'
                });
                break;

            case 'mypackageorder':
                wx.navigateTo({
                    url: '../myPackage/myPackage'
                });
                break;
            // 套餐充值
            case 'recharge':
                wx.navigateTo({
                    url: '../rechargePackage/rechargePackage'
                });
                break;
            case 'activecomplete':
                wx.navigateTo({
                    url: '../myOrder/myOrder?status=3'
                });
                break;
            case 'activenotcomplete':
                wx.navigateTo({
                    url: '../myOrder/myOrder?status=2'
                });
                break;

            case 'activelook':
                wx.navigateTo({
                    url: '../myOrder/myOrder?status=0'
                });
                break;
            default: return;
        }


        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    onShow() {
        let cartNum = app.globalData.cartNum;

        if (!cartNum) {
            wx.removeTabBarBadge({
                index: 1
            })
            return false;
        }
        wx.setTabBarBadge({
            index: 1,
            text: `${cartNum}`
        })

        // 设置小程序返回页面
       // app.globalData.backUrl = this.route.replace('pages', '..');
        

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

        // 切换隐藏蒙版
        if (this.data.isShowCategoryList) {
            this.setData({
                isShowCategoryList: false
            })
        }

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
