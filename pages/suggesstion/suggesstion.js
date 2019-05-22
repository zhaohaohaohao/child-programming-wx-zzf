//issues.js
//获取应用实例
var app = getApp();
Page({
  data: {
    status: false,  //是否显示列表
    hasFeed: false,  //是否有意见
    feednum: 0, //反馈的次数
    feedList:"",
    isLoading: false,
    isdisabled: false,
    content:"",//意见内容
  },
  openList: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + 'student/getSuggesstionByStudentId',
      data: {
        studentId: app.globalData.studentDto.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.status);
        if (res.data.status == '200') {
          console.log(res.data.data);
          that.setData({
            feedList: res.data.data,
            feednum: res.data.data.length,
          });
          if (res.data.data.length > 0) {
            that.setData({
              hasFeed: true,
              'status': !that.data.status
            });
          }
        }
      }
    });
  },
  onLoad: function () {
    var that = this;
    console.log(app.globalData.studentDto.id);
    wx.request({
      url: app.globalData.urlPath + 'student/getSuggesstionByStudentId',
      data: {
        studentId: app.globalData.studentDto.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.status);
        if (res.data.status == '200') {
          console.log(res.data.data);
          that.setData({
            feedList: res.data.data,
            feednum: res.data.data.length,
          });
          if (res.data.data.length>0){
            that.setData({
              hasFeed: true
            });
          }
        }
      }
    });
  },
 
  //提交表单
  submitForm: function (e) {
    var that= this;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (content == "") {
      wx.showToast({
        title: '意见不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      wx.showModal({
        title: '提示',
        content: '是否确认提交反馈',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.urlPath + 'student/saveSuggesstion',
              data: {
                studentId: app.globalData.studentDto.id,
                content: content,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data.status);
                if (res.data.status == '200') {
                  console.log(res.data.data);
                  if (res.data.data){
                    wx.showToast({
                      title: '发表成功',
                      icon: 'success',
                      duration: 2000,
                      mask: true
                    })
                    that.setData({
                      feednum:that.data.feednum+1,
                      content:"",
                    });
                  }else{
                    wx.showToast({
                      title: '发表失败',
                      icon: 'loading',  
                      duration: 2000,
                      mask: true
                    })
                  }
                }
              }
            });
          }
        }
      })
    }
    that.setData({
      isLoading: false,
      isdisabled: false
    })
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

  },
  onShow: function () {

  },

});