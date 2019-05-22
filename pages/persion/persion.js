// pages/persion/persion.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textArr: ["报名课程","购课历史", "收藏课程", "课时查看"],
    imageArr: ["/images/list.png", "/images/list.png", '/images/list.png', '/images/list.png'],
    student:"",
  },
  toDoList(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var studentId = that.data.student.id;
    console.log("studentId:" + studentId);
    console.log(index);
    if(index==0){
      //报名课程
      wx.navigateTo({
        url: '/pages/SignUpCourseList/SignUpCourseList?studentId=' + studentId,
      })
    }
    if (index == 1){
      //购课历史
      wx.navigateTo({
        url: '/pages/SignUpCourseHistoryList/SignUpCourseHistoryList?studentId=' + studentId,
      })
    }
    if (index == 2) {
      //收藏课程
      wx.navigateTo({
        url: '/pages/collectCourseList/collectCourseList?studentId=' + studentId,
      })
    }
    if (index == 3) {
      //课时查看
      wx.navigateTo({
        url: '/pages/SignUpCourseClassList/SignUpCourseClassList?studentId=' + studentId,
      })
    }
    
  },
  toCourseSchedule:function(){
    var that = this;
    var studentId = that.data.student.id;
    //课时查看
    wx.navigateTo({
      url: '/pages/Calendar/Calendar?studentId=' + studentId,
    })
  },
  toShowWork: function () {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  },
  toShare: function () {
    wx.navigateTo({
      url: '/pages/share/share',
    })
  },
  toSuggesstion:function(){
    wx.navigateTo({
      url: '/pages/suggesstion/suggesstion',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getStudentInfo();
  },
  getStudentInfo:function(){
    var that = this;
    var openid = app.globalData.openid;
    if (openid == null) {
      console.log("openId为空");
      app.reLaunch();
    }
    console.log(openid);
    wx.request({
      url: app.globalData.urlPath + 'student/getStudentByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.status);
        if (res.data.status == '200') {
          console.log(res.data.data);
          that.setData({
            student: res.data.data,
          });
        } else {
          //获取用户失败
          wx.showModal({
            title: '提示',
            content: '获取用户失败,为您重新获取',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                app.reLaunch();
              }
            }
          })
        }
      }
    });
  },
  editStudent:function(){
    var that = this;
    let student = JSON.stringify(that.data.student);
    let isEdit = JSON.stringify(1);
    console.log("student:");
    console.log(student);
    console.log(isEdit);
    wx.showModal({
      title: '提示',
      content: '修改个人信息必须修改头像',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.navigateTo({
            url: '/pages/addPersion/addPersion?student=' + student + '&isEdit=' + isEdit,
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})