//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {},
    courseOrginDetail: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      course: JSON.parse(options.courseDetail),
      courseOrginDetail: JSON.parse(options.courseOrginDetail),
    });
    wx.hideLoading();
  },

  //获取用户信息，并报名。
  signUpCourse: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log("用户已授权");
              that.studentSignUpCourse();
            }
          })
        } else {
          console.log("未授权");
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
  },
  studentSignUpCourse: function() {
    var that = this;
    var openid = app.globalData.openid;
    if (openid == null) {
      console.log("openId为空");
      app.reLaunch();
    }
    console.log(openid);

    var studentId = app.globalData.studentDto.id;


    var gradeId = that.data.courseOrginDetail.id;
    var druingDate = that.data.courseOrginDetail.druingDate;
    wx.request({
      url: app.globalData.urlPath + 'student/signUpCourse',
      data: {
        gradeId: gradeId,
        studentId: studentId,
        druingDate: druingDate
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data);
        if (res.data.data == 1) {
          wx.showModal({
            title: '提示',
            content: '报名成功，通知再缴费',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          })
        } else if (res.data.data == 2) {
          wx.showModal({
            title: '提示',
            content: '您已报名过此课程，请勿重复报名',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          })
        } else if (res.data.data == 3) {
          wx.showModal({
            title: '提示',
            content: '课程此班已结课，请选择其他班级',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '报名失败',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定');

              }
            }
          })
        }
      }
    });
  },
})