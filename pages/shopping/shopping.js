const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();

let firstIn = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        totlePrice: 0,
        // 控制删除显示状态
        deleteStatus: false,
        // 购物车是否为空
        emptyCrat: false,
        // 加载转圈
        modalShow: true,
        // 初次加载显示位空
        defaultStatus: false

    },

    // 全部选择
    checkAll() {

        let checked_all = this.data.checked_all,
            newCartList = this.data.cartList;

        // 控制自身选择
        checked_all = !checked_all;

        // 控制所有子项目选择 true
        if (checked_all) {
            newCartList.map((ele) => {
                ele.checked_section = true;
                ele.skus.map((val) => {
                    val.checked_one = true;
                })
            })
        } else {
            newCartList.map((ele) => {
                ele.checked_section = false;
                ele.skus.map((val) => {
                    val.checked_one = false;
                })
            })
        }

        this.setData({
            cartList: newCartList,
            checked_all
        })

        this.count();
    },

    // 全部选择删除
    checkAllDel() {

        let del_checked_all = this.data.del_checked_all,
            newCartList = this.data.cartList;

        // 控制自身选择
        del_checked_all = !del_checked_all;

        // 控制所有子项目选择 true
        if (del_checked_all) {
            newCartList.map((ele) => {
                ele.del_checked_section = true;
                ele.skus.map((val) => {
                    val.del_checked_one = true;
                })
            })
        } else {
            newCartList.map((ele) => {
                ele.del_checked_section = false;
                ele.skus.map((val) => {
                    val.del_checked_one = false;
                })
            })
        }

        this.setData({
            cartList: newCartList,
            del_checked_all
        })

    },


    // 公司部分选择

    checkSection(e) {
        let i = e.target.dataset.i,
            newCartList = this.data.cartList;

        // 控制自身选择
        newCartList[i].checked_section = !newCartList[i].checked_section;

        // 控制子项目全选
        if (newCartList[i].checked_section) {
            newCartList[i].skus.map((ele) => {
                ele.checked_one = true;
            })
        } else {
            newCartList[i].skus.map((ele) => {
                ele.checked_one = false;
            })
        }

        // 判断全选按钮
        let checked_all = newCartList.every((ele) => {
            return ele.checked_section == true;
        })

        this.setData({
            cartList: newCartList,
            checked_all
        })

        this.count();

    },
    // 部分公司删除选择
    checkSectionDel(e) {
        let i = e.target.dataset.i,
            newCartList = this.data.cartList;

        // 控制自身选择
        newCartList[i].del_checked_section = !newCartList[i].del_checked_section;

        // 控制子项目全选
        if (newCartList[i].del_checked_section) {
            newCartList[i].skus.map((ele) => {
                ele.del_checked_one = true;
            })
        } else {
            newCartList[i].skus.map((ele) => {
                ele.del_checked_one = false;
            })
        }

        // 判断全选按钮
        let del_checked_all = newCartList.every((ele) => {
            return ele.del_checked_section == true;
        })

        this.setData({
            cartList: newCartList,
            del_checked_all
        })


    },

    // 选择子购物车
    checkSectionChild(e) {

        let i = e.target.dataset.i,
            j = e.target.dataset.j,
            newCartList = this.data.cartList;

        // 判断自身选择
        newCartList[i].skus[j].checked_one = !newCartList[i].skus[j].checked_one;

        // 判断公司全选
        newCartList[i].checked_section = newCartList[i].skus.every((ele) => {
            return ele.checked_one == true;
        })

        // 判断全选按钮
        let checked_all = newCartList.every((ele) => {
            return ele.checked_section == true;
        })

        this.setData({
            cartList: newCartList,
            checked_all
        })

        this.count();
    },

    // 选择删除子购物车
    checkSectionChildDel(e) {

        let i = e.target.dataset.i,
            j = e.target.dataset.j,
            newCartList = this.data.cartList;

        // 判断自身选择
        newCartList[i].skus[j].del_checked_one = !newCartList[i].skus[j].del_checked_one;

        // 判断公司全选
        newCartList[i].del_checked_section = newCartList[i].skus.every((ele) => {
            return ele.del_checked_one == true;
        })

        // 判断全选按钮
        let del_checked_all = newCartList.every((ele) => {
            return ele.del_checked_section == true;
        })

        this.setData({
            cartList: newCartList,
            del_checked_all
        })

    },

    // 改变删除状态
    changeStatus() {

        let newCartList = this.data.cartList;

        // 删除状态默认为空
        let del_checked_all = false;
        newCartList.forEach((ele, i) => {
            ele.del_checked_section = false;
            ele.skus.forEach((val, j) => {
                val.del_checked_one = false
            })
        });

        this.setData({
            deleteStatus: !this.data.deleteStatus,
            cartList: newCartList,
            del_checked_all
        })
    },
    //删除提交
    deleteSubmit() {

        wx.showModal({
            content: '确定将已选中的商品删除码？ ',
            confirmText: '删除',
            confirmColor: '#C81A29',
            success: (res) => {

                if (res.confirm) {
                    // 展示加载
                    this.setData({
                        modalShow: false
                    })

                    let newCartList = JSON.parse(JSON.stringify(this.data.cartList));

                    let delArr = [];

                    newCartList.forEach((ele, i) => {

                        ele.skus.forEach((val, j) => {
                            if (val.del_checked_one == true) {
                                delArr.push(val.cart_id)
                                //newCartList[i].skus.splice(j, 1);
                            }
                        })
                    });

                    let delStr = delArr.join(',');

                    api.deleteCart({
                        data: {
                            cart_ids: delStr
                        }
                    }).then((res) => {

                        // 更新购物车数量
                        let cartNum = res.data;
                        console.log(app)
                        app.globalData.cartNum = cartNum;

                        wx.setTabBarBadge({
                            index: 2,
                            text: `${cartNum}`,
                        })

                        if (cartNum == 0) {
                            // 数量为0，隐藏
                            wx.removeTabBarBadge({
                                index: 2
                            })

                        }

                        newCartList = newCartList.filter((ele, i) => {

                            ele.skus = ele.skus.filter((val, j) => {
                                return (delArr.indexOf(val.cart_id) == -1)
                            })
                            return ele.skus.length !== 0;
                        })

                        // 删除后判断为空后
                        if (newCartList.length === 0) {

                            this.setData({
                                emptyCrat: true
                            })
                            return false;
                        }

                        this.setData({
                            cartList: newCartList,
                            deleteStatus: false
                        })

                        this.count();

                    }).catch((res) => {

                    }).finally(() => {
                        this.setData({
                            modalShow: true
                        })
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }

            },
            fail: () => {

            }
        })



    },
    // 结算按钮
    settlementSubmit() {

        let newCartList = JSON.parse(JSON.stringify(this.data.cartList));

        console.log('士大夫', newCartList);

        let delArr = [];

        newCartList.forEach((ele, i) => {

            ele.skus.forEach((val, j) => {
                if (val.checked_one == true) {
                    delArr.push(val.cart_id)
                }
            })
        });

        let delStr = delArr.join(',');

        wx.navigateTo({
            url: `../fillOrder/fillOrder?orderid=${delStr}`,
        })


    },
    // 商品数量 减少数量
    min(e) {
        let i = e.target.dataset.i,
            j = e.target.dataset.j,
            newCartList = this.data.cartList,
            cart_id = newCartList[i].skus[j].cart_id,
            nowNum = newCartList[i].skus[j].number;
        console.log(nowNum);
        // 没有返回就给个disabled？

        if (nowNum <= 1) {
            // 当等于1时，按钮可透明
            return false;
        }
      
        nowNum--;

        api.updateNumber({
            data: {
                cart_id,
                number: nowNum
            }
        }).then((res) => {
            newCartList[i].skus[j].number = nowNum;
            this.setData({
                cartList: newCartList
            })

            this.count();
        })
    },
    // 增加数量
    add(e) {

        let i = e.target.dataset.i,
            j = e.target.dataset.j,
            newCartList = this.data.cartList,
            cart_id = newCartList[i].skus[j].cart_id,
            nowNum = newCartList[i].skus[j].number;
        console.log(nowNum,typeof nowNum);

        if (nowNum >= 9999) {
            return false;
        }   

        nowNum++;

        api.updateNumber({
            data: {
                cart_id,
                number: nowNum
            }
        }).then((res) => {
            newCartList[i].skus[j].number = nowNum;
            this.setData({
                cartList: newCartList
            })

            this.count();
        })

    },

    // 输入框修改数量

    change(e) {

        let i = e.target.dataset.i,
            j = e.target.dataset.j,
            newCartList = this.data.cartList,
            cart_id = newCartList[i].skus[j].cart_id,
            inputVal = e.detail.value;

        // console.log(inputVal, newCartList[i].skus[j].number)
        if (inputVal == newCartList[i].skus[j].number) {
            return false;
        }

        // 处理输入框特殊情况
        inputVal = util.dealCartNum(inputVal);


        api.updateNumber({
            data: {
                cart_id,
                number: inputVal
            }
        }).then((res) => {
            newCartList[i].skus[j].number = inputVal;
            this.setData({
                cartList: newCartList
            })
            this.count();
        })



    },

    //   购物车选择
    goodsSelect(e) {

        console.log(e);

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('是否执行')

        if (firstIn) {
            this.refreshData();
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

        // 设置小程序返回页面
        //app.globalData.backUrl = this.route.replace('pages', '..');


        if (!firstIn) {
            this.refreshData();
        }
        firstIn = false;

        // 清空购物车图标展示
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

        // 获取顶部默认地址
        api.defaultAddress({

        }).then((res) => {

            let defaultAddress = res.data;

            // 可能位空数组
            if (Array.isArray(defaultAddress)) {

                this.setData({
                    address: ''
                })

            } else {

                this.setData({
                    address: defaultAddress.city_str
                })

            }

        }).catch((res) => {

        })

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

    count() {

        let newCartList = this.data.cartList,
            totlePrice = 0;

        newCartList.map((ele) => {

            ele.skus.map((val) => {

                if (val.checked_one) {
                    totlePrice = util.accAdd(totlePrice, util.mul(val.shop_price, val.number));
                }

            })
        })
        //控制结算按钮状态,为false 灰色按钮
        if (totlePrice == 0) {
            this.setData({
                totlePrice,
                haschecked: false
            })
        } else {
            this.setData({
                totlePrice,
                haschecked: true
            })
        }


    },

    // 更新购物车状态

    refreshData() {

        this.setData({
            modalShow: false
        })
        api.getCartList(

        ).then((res) => {
            console.log(res);
            let cartList = res.data;

            if (cartList.length === 0) {
                // 购物车为空
                this.setData({
                    emptyCrat: true
                })
                return false;
            }

            let checked_all = true;
            let del_checked_all = true;

            cartList.map((ele, i) => {
                ele.checked_section = true;
                ele.del_checked_section = false;
                ele.skus.map((val, j) => {
                    val.checked_one = true;
                    val.del_checked_one = false;
                })
            })

            this.setData({
                cartList,
                checked_all,
                emptyCrat: false
            })

            this.count();
        }).catch((res) => {


        }).finally(() => {
            this.setData({
                modalShow: true,
                defaultStatus: true
            })
        })

    }

})