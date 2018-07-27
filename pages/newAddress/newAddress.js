const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo: {
            consignee: '',
            mobile: '',
            address: '',
        },
        // 是否默认
        is_default: 0,
        multiIndex: [2, 0, 0]

    },
    // 收货人修改
    editConsignee(e) {
        let consignee = e.detail.value;
        this.data.addressInfo.consignee = consignee
    },
    // 手机号修改
    editMobile(e) {
        let mobile = e.detail.value;
        this.data.addressInfo.mobile = mobile
    },
    // 详细地址修改该
    editDetailAddress(e) {
        let address = e.detail.value;
        this.data.addressInfo.address = address;
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
    // 地址设为默认
    setDefault(e) {
        console.log('switch2 发生 change 事件，携带值为', e.detail.value);
        let is_defautl = e.detail.value;



        this.setData({
            is_default: is_defautl ? 1 : 0
        })

    },
    // 保存提交
    saveSubmit() {

        let addressInfo = this.data.addressInfo,
            type = this.data.type;

        // 地址为空
        if (addressInfo.consignee.length === 0) {
            util.errorTips('请确认收货人');
            return false;
        }

        // 判断手机验证
        if (!util.vailPhone(addressInfo.mobile)) {
            util.errorTips('请确认手机号');
            return false;
        }

        // 判断地区,获取id

        const [one, two, three] = this.data.multiIndex;
        let multiArray = this.data.multiArray,
            province = multiArray[one].id,
            city = multiArray[one].children[two].id,
            district = multiArray[one].children[two].children[three].id;

        console.log(province, city, district);


        // 判断地址

        if (addressInfo.address.length === 0) {
            util.errorTips('请确认详细地址');
            return false;
        }

        let is_default = this.data.is_default;
        console.log(this, is_default)

        if (type === 'new') {

            api.addAddress({
                data: {
                    consignee: addressInfo.consignee,
                    province,
                    city,
                    district,
                    address: addressInfo.address,
                    mobile: addressInfo.mobile,
                    is_default

                }
            }).then((res) => {

                // 修改上一个页面栈数据
                wx.showToast({
                    title: '新增成功',
                })
                wx.navigateBack();
            })


        } else if (type === 'edit') {

            // 编辑提交
            api.editAddress({
                data: {
                    address_id: addressInfo.id,
                    consignee: addressInfo.consignee,
                    province,
                    city,
                    district,
                    address: addressInfo.address,
                    mobile: addressInfo.mobile,
                    is_default
                }
            }).then((res) => {

                // 修改上一个页面栈数据

                wx.showToast({
                    title: '修改成功',
                })
                wx.navigateBack();

            }).catch((res) => {

                util.errorTips(res.msg);

            }).finally(() => {

            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let type = options.type,
            id = options.id;
        console.log('test', options);

        wx.showNavigationBarLoading();

        // 设置标题
        if (type === 'edit') {
            wx.setNavigationBarTitle({
                title: '编辑收货地址'
            })
        }
        // 设置id
        this.data.id = id;
        this.data.type = type;



        // 缓存地址信息
        let addressList = wx.getStorageSync('addressList');

        if (!!addressList) {

            this.setData({
                multiArray: addressList
            })
            if (type === 'edit') {

                // 获取编辑用户地址信息
                this.getInfo(id);
            } else if (type === 'new') {

                // 设置默认地址选择
                this.setData({
                    province: this.data.multiIndex[0],
                    city: this.data.multiIndex[1]
                })
                // 关闭加载
                wx.hideNavigationBarLoading();

            }
            return false;
        }


        api.getAddress(

        ).then((res) => {
            console.log(res);

            this.setData({
                multiArray: res.data
            })

            wx.setStorage({
                key: 'addressList',
                data: res.data,
            })


            if (type === 'edit') {

                // 获取编辑用户地址信息
                this.getInfo(id)

            } else if (type === 'new') {
                // 设置默认地址选择
                this.setData({
                    province: this.data.multiIndex[0],
                    city: this.data.multiIndex[1]
                })

            }

        }).finally(() => wx.hideNavigationBarLoading());


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

    // 请求输出编辑信息
    getInfo(id) {
        api.infoAddress({
            data: {
                address_id: id
            }
        }).then((res) => {

            let addressInfo = res.data,
                { province, city, district, is_default } = addressInfo,
                multiIndex = [];
            // 查找对应索引值
            this.data.multiArray.forEach((ele, i) => {
                if (ele.id == province) {
                    multiIndex.push(i)
                    ele.children.forEach((val, j) => {
                        if (val.id == city) {
                            multiIndex.push(j)
                            val.children.forEach((v, k) => {
                                if (v.id == district) {
                                    multiIndex.push(k)
                                }
                            })
                        }
                    })
                }
            })
            console.log(multiIndex)

            //  设置默认按钮状态


            this.setData({
                addressInfo,
                multiIndex,
                province: multiIndex[0],
                city: multiIndex[1],
                is_default
            })

        }).catch(() => {

        }).finally(() => wx.hideNavigationBarLoading())
    },

    // 查找对应索引值（没用了）

    seacrchIndex() {

        let multiIndex = [];
        // 查找对应索引值
        this.data.multiArray.forEach((ele, i) => {
            if (ele.id === province) {
                multiIndex.push(i)
                ele.children.forEach((val, j) => {
                    if (val.id == city) {
                        multiIndex.push(j)
                        val.children.forEach((v, k) => {
                            if (v.id == district) {
                                multiIndex.push(k)
                            }
                        })
                    }
                })
            }
        })
        console.log(multiIndex)

        this.setData({
            multiIndex,
            province: multiIndex[0],
            city: multiIndex[1]
        })
    }

})