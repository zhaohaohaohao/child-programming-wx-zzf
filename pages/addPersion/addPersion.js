import WxValidate from '../../utils/WxValidate.js'
//获取应用实例
const app = getApp();
var adds = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_arr: [],
    imageFlg: false,
    openid: "",
    id: "",
    student: "",
    isBoy: false,
    isGril: false,
  },
  upimg: function() {
    var that = this;
    if (this.data.img_arr.length < 1) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        success: function(res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths),
            imageFlg: true,
          })
        }
      })
    } else {
      wx.showToast({
        title: '只上传一张头像',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  deleteimg: function() {
    var that = this;
    that.setData({
      img_arr: [],
      imageFlg: false,
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // var id = e.detail.value.id;
    // var guardianName = e.detail.value.guardianName;
    // var guardianPhone = e.detail.value.guardianPhone;
    // var name = e.detail.value.name;
    // var age = e.detail.value.age;
    // var sex = e.detail.value.sex;
    // var address = e.detail.value.address;
    // var email = e.detail.value.email;
    var img_arr = this.data.img_arr;
    console.log(img_arr);
    //校验表单
    adds = e.detail.value;
    if (!this.WxValidate.checkForm(adds)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false;
    }
    if (img_arr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请上传头像！',
        showCancel: false, //是否显示取消按钮
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    console.log("完整信息");
    this.upload();
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  upload: function() {
    var that = this;
    for (var i = 0; i < that.data.img_arr.length; i++) {
      wx.showLoading({
        title: '加载中...',
      })
      wx.uploadFile({
        url: app.globalData.urlPath + 'student/addStudentInfo',
        filePath: that.data.img_arr[i],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: adds,
        success: function(res) {
          res.data = JSON.parse(res.data);
          console.log(res.data);
          if (res.data.status == '200') {
            console.log(res.data.data);
            wx.showToast({
              title: '授权成功！',
              duration: 3000
            });
            //用户授权成功
            wx.redirectTo({
              url: '/pages/persion/persion'
            })
          } else {
            //获取用户失败
            wx.showModal({
              title: '提示',
              content: '提交信息失败，请重新操作',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //系统错误，插入学生信息失败
                }
              }
            })
          }
        }
      })
      wx.hideLoading();
    }
    this.setData({
      formdata: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(JSON.parse(options.student));
    console.log(JSON.parse(options.isEdit));
    if (JSON.parse(options.isEdit) == 1) {
      that.setData({
        student: JSON.parse(options.student),
        // img_arr: that.data.img_arr.concat(JSON.parse(options.student).photoUrl),
        // imageFlg: true,
      });
      if (JSON.parse(options.student).sex == 0) {
        that.setData({
          isBoy: true,
        });
      }
      if (JSON.parse(options.student).sex == 1) {
        that.setData({
          isGril: true,
        });
      }
    }
    this.initValidate() //验证规则函数
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      guardianName: {
        required: true,
        maxlength: 10
      },
      guardianPhone: {
        required: true,
        tel: true
      },
      password: {
        required: true,
        maxlength: 15
      },
      name: {
        required: true,
        maxlength: 10
      },
      age: {
        digits: true,
        required: true,
        maxlength: 3
      },
      sex: {
        required: true,
      },
      address: {
        required: true,
        maxlength: 30
      },
      email: {
        required: true,
        email: true
      },
    }
    const messages = {
      guardianName: {
        required: '请填写监护人姓名',
      },
      guardianPhone: {
        required: '请填写手机号',
        tel: '请填写规范的手机号'
      },
      guardianPhone: {
        required: '请输入密码',
      },
      name: {
        required: '请填写学生姓名',
      },
      age: {
        digits: '年龄请填写数字',
        required: "请填写学生年龄",
      },
      sex: {
        required: "请选择学生性别",
      },
      address: {
        required: "请填写地址",
      },
      email: {
        required: "请填写邮箱",
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.setData({
      openid: app.globalData.openid,
      // id: app.globalData.studentDto.id,
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})