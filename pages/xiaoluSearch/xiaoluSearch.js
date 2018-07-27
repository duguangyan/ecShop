const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        descValue: '',
        files: [{}, {}, {}],
        selcetTabNum: '1'
    },
    // 选择找料方式
    selcetTab(e) {

        const id = e.currentTarget.dataset.id;
        console.log(id);
        this.setData({
            selcetTabNum: id
        })

    },
    //   选择上传图片
    chooseImage: function (e) {

        const i = e.currentTarget.dataset.id;

        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let files = this.data.files;
                files[i].url = res.tempFilePaths[0];
                files[i].pct = 'wait';
                this.setData({
                    files
                });

                const token = wx.getStorageSync('token') || '';
                // 上传图片，返回链接地址跟id,返回进度对象
                let uploadTask = wx.uploadFile({
                    url: `${api.apiUrl}/find/image/upload`,
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    formData: {
                        'member_token': token
                    },
                    success: (res) => {
                        console.log(res);
                        var res = JSON.parse(res.data);

                        if (0 === res.code) {
                            files[i].images_id = res.data.image_id;
                            files[i].image_url = res.data.image_url;

                            this.setData({
                                files
                            })

                        } else {
                            util.errorTips('上传错误');
                        }

                    },
                    fail(err) {
                        console.log(err)
                    },
                    complete() {

                    }
                })

                uploadTask.onProgressUpdate((res) => {
                    console.log('上传进度', res.progress);
                    files[i].pct = res.progress + '%';

                    // if (res.progress == 100){
                    //     files[i].pct = '上传成功'
                    // }
                    this.setData({
                        files
                    })
                    // console.log('已经上传的数据长度', res.totalBytesSent)
                    // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                })

            }
        })
    },
    // 删除上传
    deleteItem(e) {

        const i = e.currentTarget.dataset.id;
        let files = this.data.files;
        files[i] = {};
        this.setData({
            files
        });
    },

    // 提交表单

    formSubmit(e) {

        console.log(e.detail.value);

        let formData = e.detail.value,
            descStrL = formData.field_desc.trim().length;

        console.log(descStrL);
        // 描述没有输入文字判定
        if (descStrL === 0) {
            util.errorTips('请输入描述');
            return false;
        }

        // 判断图片上传完整性
        if (formData.sampling_type == 1
            && formData.img1.length === 0
            && formData.img2.length === 0
            && formData.img3.length === 0) {
            util.errorTips('请上传图片');
            return false;
        }

        // 判断地址
        if (formData.address_id.length === 0) {
            util.errorTips('请确认收货地址');
            return false;
        }

        if (formData.sampling_type == 1) {

            let files = this.data.files;
            // 获取上传图片信息
            let arr = [];
            files.map((ele) => {

                if (ele.image_url) {
                    arr.push(ele.image_url)
                }

            })

            app.globalData.orderArr = arr;
        }
        app.globalData.orderData = formData;

        console.log('formData',formData, JSON.stringify(formData));
        let formDataStr = JSON.stringify(formData);

        wx.navigateTo({
            url: `../firmOrder/firmOrder?type=${formData.sampling_type}&desc=${formData.field_desc}&range=${formData.price_range}&cname=${formData.cname}&data=${formDataStr}`,
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
    // 收货地址
    getSelectedAddress() {
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
    },

    // 图片上传
    uploadimg: function (data) {
        var that = this,
            i = data.i ? data.i : 0,//当前上传的哪张图片
            success = data.success ? data.success : 0,//上传成功的个数
            fail = data.fail ? data.fail : 0;//上传失败的个数

        const token = wx.getStorageSync('token') || '';

        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            name: 'image',//这里根据自己的实际情况改
            formData: {
                member_token: token
            },//这里是上传图片时一起上传的数据
            success: (resp) => {
                success++;//图片上传成功，图片上传成功的变量+1
                console.log(resp)
                console.log(i);
                //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
            },
            fail: (res) => {
                fail++;//图片上传失败，图片上传失败的变量+1
                console.log('fail:' + i + "fail:" + fail);
            },
            complete: () => {
                console.log(i);
                i++;//这个图片执行完上传后，开始上传下一张
                if (i == data.path.length) {   //当图片传完时，停止调用          
                    console.log('执行完毕');
                    console.log('成功：' + success + " 失败：" + fail);
                } else {//若图片还没有传完，则继续调用函数
                    console.log(i);
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadimg(data);
                }

            }
        });
    }
})