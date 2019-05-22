var util = require("../../utils/util.js");
//获取应用实例
const app = getApp();

var loadStudentCourseByDate = function (that, selectDate, week) {
  wx.request({
    url: app.globalData.urlPath + 'course/getStudentCourseListByDate',
    data: {
      selectDate: selectDate,
      week: week,
      studentId: that.data.studentId,
    },
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      console.log(res.data.data);
      console.log(res.data.data.length);
      that.setData({
        list: res.data.data,
      });
    }
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [{
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    }, ],
    list: "",
    studentId:"",
  },
  //给点击的日期设置一个背景颜色
  dayClick: function(event) {
    var that = this;
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[0].day`;
    let changeBg = `dayStyle[0].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#AAD4F5",
      list: "",
    })
    var time = event.detail.year + '-' + event.detail.month + '-' + event.detail.day;
    var date = util.dateLater(time, 0);
    console.log(date.time);
    console.log(date.week);
    loadStudentCourseByDate(that, date.time, date.week);
  },

  onLoad: function(options) {
    var that = this;
    var studentId = options.studentId;
    console.log("studentId:" + studentId);
    that.setData({
      studentId: studentId,
    });
    var time = util.formatTimeYYYY(new Date());
    var date = util.dateLater(time, 0);
    console.log(date.time);
    console.log(date.week);
    loadStudentCourseByDate(that, date.time, date.week);
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
      data: { courseId: courseId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.status == '200') {
          let courseDetail = JSON.stringify(res.data.data);
          // let courseDetail = JSON.stringify(res.data.data);
          console.log(courseDetail);
          wx.navigateTo({
            url: '/pages/CourseListDetail/CourseListDetail?courseDetail=' + courseDetail + '&&gradeId=' + gradeId,
          })
        } else {
          console.log("获取失败");
        }
      }
    });

  },
})