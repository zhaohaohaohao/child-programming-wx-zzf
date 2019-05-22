// pages/experienceCourse/experienceCourse.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    experienceCourses:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getExperienceCourse();
  },
  getExperienceCourse:function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.urlPath + 'experienceCourse/getAllExperienceCourse',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          experienceCourses: res.data.data,
        });
      }
    });
    wx.hideLoading();
  },
  experienceCourseDetail:function(e){
    let experienceCourseDetail = JSON.stringify(e.currentTarget.dataset.experienceCourseDetail);
    wx.navigateTo({
      url: '/pages/experienceCourseDetail/experienceCourseDetail?experienceCourseDetail=' + experienceCourseDetail,
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