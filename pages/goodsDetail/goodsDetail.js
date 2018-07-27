const api = require('../../utils/api.js');

const util = require('../../utils/util.js');

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 加载转圈
        modalShow: false

    },

    // 索样开发中展示
    developing() {

        wx.showModal({
            title: '功能开发中',
            content: '敬请期待',
            showCancel: false
        })

    },
    // 选择框显示
    selectUp(e) {
        console.log(e);
        this.setData({
            isShow: true,
            filterView: true
        })

        this.setData({
            slide: true,
        })
    },

    selectDown() {

        // this.setData({
        //     slide: false
        // })

        this.setData({
            isShow: false,
            slide: false,
            filterView: false
        })
    },

    // 选项
    selectOption(e) {

        let modalID = e.currentTarget.dataset.modal;
        let value = e.currentTarget.dataset.value;

        this.data.selectArr[modalID] = value;

        let selectArr = this.data.selectArr;

        // ===  公用部分 Start
        let selectStr = selectArr.join(';')

        let skus = this.data.skus;

        skus.map((ele) => {

            if (ele.sale_props.indexOf(selectStr) > -1) {
                ele.modal = ele.sale_props_str.split(':').pop();
                ele.isShow = true;
            } else {
                ele.isShow = false;
            }

        })

        console.log('选中项', selectArr, selectStr, skus);
        this.setData({
            selectArr,
            skus
        })


    },

    // 减少数据
    min(e) {

        let num = e.currentTarget.dataset.num;

        let nowNum = this.data.skus[num].wx_num;

        if (nowNum <= 1) {
            return false;
        }

        this.data.skus[num].wx_num--;

        //this.data.skus[num].total = util.mul(this.data.skus[num].wx_num, this.data.skus[num].shop_price)

        this.setData({
            skus: this.data.skus
        })


    },
    // 增加数据
    add(e) {

        let num = e.currentTarget.dataset.num;

        let nowNum = this.data.skus[num].wx_num;

        if (nowNum >= 9999) {
            return false;
        }  

        this.data.skus[num].wx_num++;

        //this.data.skus[num].total = util.mul(this.data.skus[num].wx_num, this.data.skus[num].shop_price);

        this.setData({
            skus: this.data.skus,
        })

    },

    // 输入框输入数据
    change(e) {

        console.log(e);

        let num = e.currentTarget.dataset.num;

        let nowNum = this.data.skus[num].wx_num;

        let inputVal = e.detail.value;

        // 控制输入框数据  处理输入框特殊情况
        //inputVal = util.dealCartNum(inputVal);

        this.data.skus[num].wx_num = inputVal;

        this.setData({
            skus: this.data.skus,
        })

    },
    // 添加到购物车

    addCart(e) {

        wx.hideToast();
        let num = e.currentTarget.dataset.num,
            sku_id = `${this.data.skus[num].id}`,
            itemNum = this.data.skus[num].wx_num;
        console.log(itemNum)

        api.addCart({
            method: 'POST',
            data: {
                sku_id,
                'number': itemNum,
            }
        }).then((res) => {
            wx.showToast({
                title: '添加成功',
                duration: 1500
            })

            // 购物车数量同步
            let cartNum = res.data;
            this.setData({
                cartNum
            })
            app.globalData.cartNum = cartNum;

        }).catch((res) => {

            util.errorTips('添加失败');

        })



        console.log(sku_id);

    },

    goodsInfo() {

        // let goodsData = this.data.goodsData,
        //     regex = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        //     descimg = regex.exec(goodsData.goods_desc)[1],
        //     descstr = goodsData.binds_str;

        // wx.navigateTo({
        //     url: `../goodsInfo/goodsInfo?descimg=${descimg}&descstr=${descstr}`,
        // })

        let goodsData = this.data.goodsData,
            descstr = goodsData.binds_str,
            srcList = [];
        
        goodsData.goods_desc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            srcList.push(capture);
        });
        
        console.log('解析到的图片路径', srcList);
        srcList = srcList.join(',');
        
        wx.navigateTo({
            url: `../goodsInfo/goodsInfo?descimg=${srcList}&descstr=${descstr}`,
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let id = options.id;

        api.getGoodsDetail({
            data: {
                id
            }
        }).then((res) => {
            console.log('产品详情', res);
            let goodsData = res.data,
                saleProps = JSON.parse(goodsData.sale_props),
                saleLast = saleProps.pop(),
                selectArr = [];

            console.log('产品选项2', saleProps, saleProps, saleLast);

            // 默认选择第一项

            saleProps.map((ele, i) => {
                selectArr.push(ele.option[0].value);
            });

            // ===  公用部分 Start
            let selectStr = selectArr.join(';');

            let skus = goodsData.skus;

            skus.map((ele) => {

                if (ele.sale_props.indexOf(selectStr) > -1) {
                    ele.modal = ele.sale_props_str.split(':').pop();

                    ele.isShow = true;
                } else {

                    ele.isShow = false;
                }

                ele.wx_num = 1;
                //ele.total = ele.shop_price;

            })

            console.log('选中项', selectArr, selectStr);

            // 增加购物车数量显示


            this.setData({
                goodsData,
                saleProps,
                saleLast,
                selectArr,
                skus,

            })

            // ===  公用部分 End


        }).finally(() => {
            this.setData({
                modalShow: true
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
        // 购物车数字同步
        this.setData({
            cartNum: app.globalData.cartNum
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 选择通用方法
    selectChange() {


    }
})