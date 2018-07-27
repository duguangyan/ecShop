const timer = require('../../utils/wxTimer.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();

let update, wxTimer, getInfo;

// let a = 0, b = 1;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxTimerList: {},
        addressId: '',
        defaultAddress: false,
        id: '1'
    },
    // 成功抢购了
    flashSaleOut() {

        wx.showModal({
            title: '温馨提示',
            content: '您已抢购成功，可前往订单列表查看订单状态',
            confirmText: '前往',
            confirmColor: '#c81a29',
            success: (res) => {

                if (res.confirm) {
                    wx.reLaunch({
                        url: `../index/index?redict=activelook`,
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })



    },
    // 抢购按钮
    flashSale(e) {

        // 限制
        let receiving_id = this.data.addressId,
            id = this.data.id;

        let token = app.globalData.token;
        // 登录了才会检测收货地址
        if (token) {
            if (receiving_id.length === 0) {
                util.errorTips('请填写收货地址')
                return false
            }
        }

        if (e.currentTarget.dataset.type === '即将开始') {
            wx.showToast({
                title: '活动即将开始',
                image: '../../images/icons/error.png',
            })
            this.setData({
                submitBtn: false
            })
            return false;
        } else if (e.currentTarget.dataset.type === '活动结束') {
            wx.showToast({
                title: '活动已结束',
                image: '../../images/icons/error.png',
            })
            this.setData({
                submitBtn: false
            })
            return false;
        }

        this.setData({
            submitBtn: true
        })

        wx.showLoading({
            title: '抢购中',
        })

        api.activitySubmit({
            data: {
                id,
                receiving_id,
                payment_id: '2'
            }
        }).then((res) => {

            // 发起微信支付
            wx.requestPayment({
                ...res.data.pay,
                method: "POST",
                success: (res) => {

                    wx.reLaunch({
                        url: `../index/index?redict=activecomplete`,
                    })
                    console.log('发起微信支付正确返回', res);

                },
                fail: (err) => {
                    console.log('发起微信支付错误返回,取消事件', err);
                    wx.showModal({
                        title: '温馨提示',
                        content: '您已抢购成功，可前往订单列表继续支付',
                        confirmText: '前往',
                        confirmColor: '#c81a29',
                        success: (res) => {

                            if (res.confirm) {
                                wx.reLaunch({
                                    url: `../index/index?redict=activenotcomplete`,
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            });

            // 更新信息
            api.activity({
                data: {
                    id: 1
                }
            }).then((res) => {
                getInfo(false, res);
                console.log('更新状态')
            })


        }).catch((err) => {

            if (-401 !== err.code) {
                util.errorTips(err.msg);
            }

        }).finally(() => {

            this.setData({
                submitBtn: false
            })

            wx.hideLoading();

        })


    },
    // 地址管理
    dealAddress(e) {

        let token = app.globalData.token;
        // 登录了才调用此接口

        if (!token) {
            wx.showModal({
                title: '您尚未登录',
                content: '是否前往登录页面',
                confirmText: '前往',
                confirmColor: '#c81a29',
                success: (res) => {

                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../associatedAccount/associatedAccount',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })

            return false;
        }

        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.showNavigationBarLoading();

        api.activity({
            data: {
                id: 1
            }
        }).then((res) => {
            console.log('活动接口数据', res);

            getInfo = (firstIn, res) => {

                let remaining_num = res.data.daily_last_stock || '0';
                let is_order = res.data.is_order;

                this.setData({
                    remaining_num,
                    is_order
                })

                // let time = new Date(),
                //     nowTime = Math.floor(time / 1000);

                // let serviceTime = res.data.now_date;
                // serviceTime = serviceTime.replace(/-/g, '/');

                // const serviceNowTime = Math.floor(Date.parse(new Date(serviceTime)) / 1000);

                // let timeDifference = serviceNowTime - nowTime;



                let serviceTime = res.data.now_date;
                serviceTime = serviceTime.replace(/-/g, '/');
                const nowTime = Math.floor(Date.parse(new Date(serviceTime)) / 1000);
                let time = new Date(nowTime * 1000);
                console.log('开始当前时间', time, nowTime);

                // 分三种情况
                //1.当前时间减去活动开始时间为正数，则活动已经开始
                //2.当前时间减去活动结束时间为正数，则活动已经结算

                let start = res.data.begin_date;
                start = start.replace(/-/g, '/');

                let end = res.data.end_date;
                end = end.replace(/-/g, '/');

                const activeStart = Math.floor(Date.parse(new Date(start)) / 1000);
                const activeEnd = Math.floor(Date.parse(new Date(end)) / 1000);

                // console.log(serviceNowTime, activeStart, activeEnd, timeDifference)
                // console.log('ios测试数据', res.data.begin_date, Date.parse(new Date(res.data.begin_date)))

                // console.log('获取时间时间', res.data.begin_date, '---', res.data.end_date, '---', Date.parse(new Date(res.data.begin_date)), activeStart, activeEnd)


                console.log('活动状态', nowTime - activeStart > 0 && nowTime - activeEnd < 0, nowTime - activeStart <= 0, nowTime - activeEnd >= 0)

                if (nowTime - activeStart > 0 && nowTime - activeEnd < 0) {
                    // 活动期间

                    //本日活动结束时间 (可后台获取)
                    if (firstIn) {

                        // if (a == 1) {
                        //     b++;
                        // }
                        // if (a == 2) {
                        //     b++;
                        // }
                        // if (a == 3) {
                        //     b++;
                        // }
                        let endTime = Math.floor(time.setHours(24, 0, 0, 0) / 1000),
                            countdown = sec_to_time(endTime - nowTime);

                        wxTimer = new timer({
                            beginTime: countdown,
                            name: 'wxTimer',
                            complete: () => {
                                // console.log("完成了=====", res.data, getInfo);
                                //a++
                                api.activity({
                                    data: {
                                        id: 1
                                    }
                                }).then((res) => {
                                    getInfo(true, res);
                                    wxTimer = null;
                                    // console.log('更新状态')
                                })

                            }
                        })

                        wxTimer.start(this);

                    }

                    // 检测数量为0，显示今日告罄
                    if (remaining_num == '0') {
                        this.setData({
                            ActiveTimeShow: '抢购倒计时',
                            flashSaleBtn: '今日已售罄'
                        })
                    } else {
                        this.setData({
                            ActiveTimeShow: '现在进行中',
                            flashSaleBtn: '立即抢购'
                        })
                    }

                } else if (nowTime - activeStart <= 0) {
                    // 未开始

                    //距离活动开始时间

                    if (firstIn) {
                        let countdown = sec_to_time(activeStart - nowTime);

                        //console.log('距离活动开始时间', countdown);

                        wxTimer = new timer({
                            beginTime: countdown,
                            name: 'wxTimer',
                            complete: function () {
                                console.log("完成了");
                                //a++
                                api.activity({
                                    data: {
                                        id: 1
                                    }
                                }).then((res) => {
                                    getInfo(true, res);
                                    wxTimer = null;
                                    // console.log('更新状态')
                                })


                            }
                        })
                        wxTimer.start(this);

                    }

                    this.setData({
                        ActiveTimeShow: '距离抢购时间',
                        flashSaleBtn: '即将开始'
                    })


                } else if (nowTime - activeEnd >= 0) {
                    //已结束
                    this.setData({
                        ActiveTimeShow: '活动已结束',
                        flashSaleBtn: '活动结束',
                        hour: '00',
                        minute: '00',
                        second: '00'
                    })

                }

            }

            getInfo(true, res);

            wx.hideNavigationBarLoading();

            // 持续更新状态
            update = setInterval(function () {

                api.activity({
                    data: {
                        id: 1
                    }
                }).then((res) => {
                    getInfo(false, res);
                    // console.log('更新状态')
                })
            }, 5000)

        })

        /**
        * 时间秒数格式化
        * @param s 时间戳（单位：秒）
        * @returns {*} 格式化后的时分秒
        */
        function sec_to_time(s) {
            var t;
            if (s > -1) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                if (hour < 10) {
                    t = '0' + hour + ":";
                } else {
                    t = hour + ":";
                }

                if (min < 10) { t += "0"; }
                t += min + ":";
                if (sec < 10) { t += "0"; }
                t += sec.toFixed(0);
            }
            return t;
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
        clearInterval(update);
        //update = null;
        wxTimer = null;
        getInfo = null;
        //a = 0;
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

    },
    // 收获气质
    getSelectedAddress() {

        let token = app.globalData.token;
        // 登录了才调用此接口

        if (token) {

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

    },
})