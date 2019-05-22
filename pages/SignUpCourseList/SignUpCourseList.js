// pages/courseList/courseList.js
//获取应用实例
const app = getApp();
var page = 1;
var page_size = 5;

//请求数据
var loadSignUpCourseMore = function(that) {
  that.data.hasSignUpCourseMore = false;
  if (that.data.isSignUpCourseDown) {
    console.log("daodi-----");
    return;
  }
  that.setData({
    hidden: false
  });
  wx.request({
    url: app.globalData.urlPath + 'course/getStudentSignUpCourseList',
    data: {
      page: page,
      limit: page_size,
      studentId: that.data.studentId,
    },
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      console.log(res.data.data);
      if (res.data.data == null || res.data.data == [] || res.data.data.length == 0) {
        console.log("到底");
        that.setData({
          hidden: true,
          isSignUpCourseDown: true,
        });
        return;
      }

      console.log(res.data.data.length);
      var list = that.data.list;
      for (var i = 0; i < res.data.data.length; i++) {
        list.push(res.data.data[i]);
      }
      that.setData({
        list: list,
        hasSignUpCourseMore: true,
        hidden: true,
      });
      console.log("list.length:" + list.length);
      page++;
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollYHeight: 0, //scroll-view高度
    hidden: true,
    list: [],
    isSignUpCourseDown: false,
    hasSignUpCourseMore: false,
    studentId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var studentId = options.studentId;
    console.log("studentId:" +studentId);
    that.setData({
      studentId: studentId,
    })
    //数据刷新
    page = 1;
    loadSignUpCourseMore(that);
  },
  //下拉加载
  bindDownLoad: function () {
    var that = this;
    loadSignUpCourseMore(that);
  },
  //上拉刷新
  topLoad: function (event) {
    var that = this;
    //数据刷新
    page = 1;
    this.setData({
      list: [],
      isSignUpCourseDown: false,
    });
    console.log("上拉");
    loadSignUpCourseMore(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getSystemInfo({
      success: ({
        windowHeight
      }) => {
        this.setData({
          scrollYHeight: windowHeight
        }) //设置scrill-view组件的高度为屏幕高度
      }
    })
    console.log("高度：" + this.data.scrollYHeight);
  },
  // 跳转课程详情页
  courseDetail: function (e) {
    var that = this;
    var courseId = e.currentTarget.dataset.courseId;
    var gradeId = e.currentTarget.dataset.gradeId;
    console.log(courseId);  
    console.log(gradeId);  
    wx.request({
      url: app.globalData.urlPath + 'course/getCourseById',
      data: { courseId: courseId},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.status == '200'){
          let courseDetail = JSON.stringify(res.data.data);
          console.log(courseDetail);
          wx.navigateTo({
            url: '/pages/CourseListDetail/CourseListDetail?courseDetail=' + courseDetail + '&&gradeId=' + gradeId,
          })
        }else{
          console.log("获取失败");
        }
      }
    });
    
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