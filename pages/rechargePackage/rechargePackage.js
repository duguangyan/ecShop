const api = require('../../utils/api.js');

const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 配送服务显示
        service: true,

        multiIndex: [0, 0, 0]

    },
    // 包月套餐说明
    packageInfo(e) {

        let packageInfo = e.currentTarget.dataset.info;

        this.setData({
            packageInfo,
            masking: true
        })

    },
    // 隐藏弹窗
    hideMasking(e) {

        console.log(e)

        this.setData({
            masking: false
        })

    },

    // 选择套餐
    selectPackage(e) {


        let value = e.currentTarget.dataset,
            type = value.type,
            id = value.id,
            packagePrice = value.price,
            name = value.name,
            mounth = value.mounth;


        if (type == '2') {
            // 包月套餐
            this.setData({
                selected: id,
                type,
                service: true,
                packagePrice,
                name,
                mounth
            })

            wx.showNavigationBarLoading();
            this.service(id);

        } else if (type == '1') {
            // 按次套餐
            this.setData({
                selected: id,
                type,
                service: false,
                packagePrice,
                name,
                mounth
            })

        }

        console.log(this.data.packagePrice)

    },

    //地区选择器
    bindMultiPickerChange: function (e) {
        //console.log('picker发送选择改变，地区', e, e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
    },
    bindMultiPickerColumnChange: function (e) {
        console.log('bindMultiPickerColumnChange改变 ==', e, e.detail.value);
        const column = e.detail.column;
        const i = e.detail.value;

        switch (column) {
            case 0:
                this.setData({
                    province: i
                });
                break;
            case 1:
                this.setData({
                    city: i
                });
                break;
            default: ;
        }

    },

    // recharge 
    recharge() {
        console.log(this.data.packagePrice);

        let packagePrice = this.data.packagePrice,
            id = this.data.selected,
            type = this.data.type,
            mounth = this.data.mounth,
            name = this.data.name;

        if (this.data.type == '2') {
            // 服务价格 id

            const [one, two, three] = this.data.multiIndex;

            let multiArray = this.data.multiArray,
                province = multiArray[one].id,
                city = multiArray[one].children[two].id,
                district = multiArray[one].children[two].children[three].id;

            let info = multiArray[one].children[two].children[three].info,
                servicePrice = info.price,
                distribution_id = info.id;

            // 包月套餐
            console.log(province, city, district, distribution_id, packagePrice, servicePrice, id, type, name);
            // 带参数跳转
            wx.navigateTo({
                url: `../firmPackageOrder/firmPackageOrder?name=${name}&type=${type}&id=${id}&packagePrice=${packagePrice}&servicePrice=${servicePrice}&distribution_id=${distribution_id}&mounth=${mounth}`,
            })

        } else if (this.data.type == '1') {
            // 按次套餐

            wx.navigateTo({
                url: `../firmPackageOrder/firmPackageOrder?name=${name}&type=${type}&id=${id}&packagePrice=${packagePrice}&mounth=${mounth}`,
            })

        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.showNavigationBarLoading();

        api.packageList(

        ).then((res) => {

            console.log(res.data.list);

            let monthPackage = res.data.list.month ? res.data.list.month.reverse() : [],
                timePackage = res.data.list.time ? res.data.list.time.reverse() : [];

            // 折扣转换 推荐
            monthPackage.forEach((ele, i) => {

                ele.zhe = util.mul(ele.discount, 10);
                if (i === 0) {
                    ele.isrecommendation = true;
                }
            })

            timePackage.forEach((ele, i) => {
                ele.zhe = util.mul(ele.discount, 10);
            })

            // 设置默认值,默认选中价格，id,type
            let selected, packagePrice, type, name, mounth;

            try {
                selected = monthPackage[0].id;
                packagePrice = monthPackage[0].pay_price;
                type = monthPackage[0].type;
                name = monthPackage[0].name;
                mounth = monthPackage[0].mounth;
                this.service(selected);

            } catch (err) {
                console.log(err);
                selected = null;
            }

            this.setData({
                monthPackage,
                timePackage,
                selected,
                packagePrice,
                type,
                name,
                mounth
            })

        }).catch((res) => {

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

    },
    // 配送服务接口
    service(id) {

        // wx.showLoading({
        //     title: '计算价格中',
        // })

        this.setData({
            isGo: true
        })

        api.packageService({
            data: {
                package_id: id
            }
        }).then((res) => {
            console.log('服务信息地址', res);
            this.setData({
                multiArray: res.data,
                province: this.data.multiIndex[0],
                city: this.data.multiIndex[1],

            })


        }).catch((err) => {


        }).finally(() => {
            this.setData({
                isGo: false
            })
            wx.hideNavigationBarLoading();
        })
    }
})