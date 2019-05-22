import {
  base64src
} from '../../utils/base64src.js'
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    experienceCourseDetail: "",
    imglist: [],
    sharePicFlg: true,
    sharebg: 'http://qiniu.jnwtv.com/H520181206092255188568494.png', // 分享底部背景图
    shareTitle: '', // 分享标题
    shareCoverImg: null, // 分享封面图
    shareQrImg: null, // 分享小程序二维码
    shareCode: '', //分享码
    shareCodeText: '', //输入的分享码
    phone: '', //输入的手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    console.log(JSON.parse(options.experienceCourseDetail));
    that.setData({
      experienceCourseDetail: JSON.parse(options.experienceCourseDetail),
      shareCoverImg: JSON.parse(options.experienceCourseDetail).photoUrl,
      shareTitle: JSON.parse(options.experienceCourseDetail).title,
    });
    that.data.imglist.push(JSON.parse(options.experienceCourseDetail).photoUrl);

    wx.request({
      url: app.globalData.urlPath + 'student/getWXAccessToken',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == '200') {
          // 生成页面的二维码
          wx.request({
            url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.data,
            data: {
              scene: app.globalData.scene,
              path: 'pages/experienceCourseDetail/experienceCourseDetail?experienceCourseDetail=' + options.experienceCourseDetail,
            },
            method: "POST",
            responseType: 'arraybuffer', //设置响应类型
            success(res) {
              var src2 = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res.data); //对数据进行转换操作
              base64src(src2, res => {
                //console.log(res) // 返回图片地址，直接赋值到image标签即可
                that.setData({
                  shareQrImg: res
                })
              });
            },
            fail(e) {
              console.log(e)
            }
          })

        } else {
          //获取用户失败
          wx.showModal({
            title: '提示',
            content: '获取AccessToken失败',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {}
            }
          })
        }
      }
    });

  },
  /** 
   * 预览图片
   */
  previewImage: function(e) {
    wx.previewImage({
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  shareCodeInput: function(e) {
    this.setData({
      shareCodeText: e.detail.value
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  signUpExperienceCourse: function() {
    var that = this;
    if (that.data.phone == '') {
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
        showCancel: false,
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.phone))) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号',
        showCancel: false,
      })
      return;
    }
    //分享码
    that.studentSignUpExperienceCourse(that.data.shareCodeText, that.data.phone);
  },

  studentSignUpExperienceCourse: function(shareCodeText, phone) {
    console.log("报名体验课");
    var that = this;
    //用户信息是否存在
    if (app.globalData.studentDto != null) {
      //验证分享码
      wx.request({
        url: app.globalData.urlPath + 'experienceCourse/updateShareCodeCount',
        data: {
          experienceCourseId: that.data.experienceCourseDetail.id,
          shareCodeText: shareCodeText,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.status == '200') {
            if (res.data.data > 0) {
              //报名
              wx.request({
                url: app.globalData.urlPath + 'student/signUpExperienceCourse',
                data: {
                  experienceCourseId: that.data.experienceCourseDetail.id,
                  // studentId: app.globalData.studentDto.id,
                  phone: phone,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  console.log(res.data.data);
                  if (res.data.data == 1) {
                    wx.showModal({
                      title: '提示',
                      content: '报名成功',
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          console.log('报名成功,用户点击确定');
                          that.setData({
                            shareCodeText: ''
                          })
                        }
                      }
                    })
                  } else if (res.data.data = 2) {
                    wx.showModal({
                      title: '提示',
                      content: '您已报名过此课程',
                      showCancel: false,
                      success: function(res) {
                        if (res.confirm) {
                          console.log('已报名过,用户点击确定');
                          that.setData({
                            shareCodeText: ''
                          })
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
                          console.log('报名失败,用户点击确定');
                          that.setData({
                            shareCodeText: ''
                          })
                        }
                      }
                    })
                  }
                }
              });
            }
          } else {
            //无此分享码
            wx.showModal({
              title: '提示',
              content: '分享码不存在',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    shareCodeText: ''
                  })
                }
              }
            })
          }
        }
      });

    } else {
      wx.navigateTo({
        url: '/pages/authorize/authorize'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  returnPage: function() {
    this.setData({
      sharePicFlg: !this.data.sharePicFlg,
    })
  },

  /**
   * 分享朋友圈
   */
  downloadImg: function() {
    let that = this;
    if (app.globalData.studentDto != null) {
      that.setData({
        sharePicFlg: false
      })
      //获取分享码
      wx.request({
        url: app.globalData.urlPath + 'experienceCourse/getShareCode',
        data: {
          studentId: app.globalData.studentDto.id,
          experienceCourseId: that.data.experienceCourseDetail.id,
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.data.status == '200') {
            that.setData({
              shareCode: res.data.data,
            });
          }
        },
        fail(e) {
          console.log(e)
        }
      })
      // 创建画布
      const ctx = wx.createCanvasContext('shareCanvas')
      // 白色背景
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, 300, 380)
      ctx.draw()
      // 下载底部背景图
      wx.getImageInfo({
        src: that.data.sharebg,
        success: (res1) => {

          ctx.drawImage(res1.path, 0, 250, 300, 130)
          // 下载视频封面图
          console.log("that.data.shareCoverImg:" + that.data.shareCoverImg);
          wx.getImageInfo({
            src: that.data.shareCoverImg,
            success: (res2) => {
              console.log(res2.path);
              ctx.drawImage(that.data.shareCoverImg, 0, 0, 300, 168)

              // 分享标题
              // ctx.setTextAlign('center')    // 文字居中
              ctx.setFillStyle('#000') // 文字颜色：黑色
              ctx.setFontSize(20) // 文字字号：20px
              if (that.data.shareTitle.length <= 14) {
                // 不用换行
                ctx.fillText(that.data.shareTitle, 10, 200, 280)
              } else if (that.data.shareTitle.length <= 28) {
                // 两行
                let firstLine = that.data.shareTitle.substring(0, 14);
                let secondLine = that.data.shareTitle.substring(14, 27);
                ctx.fillText(firstLine, 10, 200, 280)
                ctx.fillText(secondLine, 10, 224, 280)
              } else {
                // 超过两行
                let firstLine = that.data.shareTitle.substring(0, 14);
                let secondLine = that.data.shareTitle.substring(14, 27) + '...';
                ctx.fillText(firstLine, 10, 200, 280)
                ctx.fillText(secondLine, 10, 224, 280)
              }
              // 下载二维码
              console.log(" that.data.shareQrImg:" + that.data.shareQrImg);
              wx.getImageInfo({
                src: that.data.shareQrImg,
                success: (res3) => {
                  console.log(" res3.path:" + res3.path);
                  let qrImgSize = 70
                  ctx.drawImage(res3.path, 212, 256, qrImgSize, qrImgSize)
                  ctx.stroke()
                  ctx.draw(true)
                  console.log("app.globalData.studentDto.name:" + app.globalData.studentDto.name);
                  // 用户昵称
                  ctx.setFillStyle('#000') // 文字颜色：黑色
                  ctx.setFontSize(14) // 文字字号：16px
                  ctx.fillText(app.globalData.studentDto.name, 38, 274)
                  // 分享码
                  ctx.setFillStyle('#DC143C') // 文字颜色：黑色
                  ctx.setFontSize(14) // 文字字号：16px
                  ctx.fillText('分享码：' + that.data.shareCode, 38, 298)

                  // 下载用户头像
                  wx.getImageInfo({
                    src: app.globalData.studentDto.photoUrl,
                    success: (res4) => {
                      // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)
                      ctx.arc(22, 284, 12, 0, Math.PI * 2, false)
                      ctx.clip()
                      // 绘制头像图片
                      let headImgSize = 24
                      ctx.drawImage(res4.path, 10, 272, headImgSize, headImgSize)
                      // ctx.stroke() // 圆形边框
                      ctx.draw(true)

                      // wepy.showLoading({
                      //   title: '保存中...',
                      //   mask: true,
                      // });      

                      wx.canvasToTempFilePath({
                        canvasId: 'shareCanvas',
                        success: function(res) {
                          console.log(res.tempFilePath);
                          wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success(res) {
                              console.log("成功");

                            },
                            fail(res) {
                              console.log("失败1");
                              wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                  console.log("2-授权《保存图片》权限成功");
                                  that.downloadImg();
                                }
                              })
                            }
                          });

                        }
                      })

                    }
                  })
                }
              })
            }
          })
        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/authorize/authorize'
      })
    }

  },
})



// signUpExperienceCourse: function() {
//   var that = this;
//   // 查看是否授权
//   wx.getSetting({
//     success: function(res) {
//       if (res.authSetting['scope.userInfo']) {
//         wx.getUserInfo({
//           success: function(res) {
//             console.log("用户已授权");
//             wx.showModal({
//               title: '提示',
//               content: '是否确定报名',
//               success(res) {
//                 if (res.confirm) {
//                   console.log('用户点击确定');
//                   that.setData({
//                     hiddenmodalput: !that.data.hiddenmodalput
//                   })
//                   //  that.studentSignUpExperienceCourse();
//                 } else if (res.cancel) {
//                   console.log('用户点击取消')
//                 }
//               }
//             })
//           }
//         });
//       } else {
//         console.log("未授权");
//         wx.navigateTo({
//           url: '/pages/authorize/authorize'
//         })
//       }
//     }
//   })
// },


/**
 * 用户点击右上角分享
 */
// onShareAppMessage: function() {
//   // var that = this;
//   // var listData = JSON.stringify(that.data.experienceCourseDetail);
//   // return {
//   //   title: '儿童编程小程序',
//   //   path: 'pages/experienceCourseDetail/experienceCourseDetail?experienceCourseDetail=' + listData,
//   //   success: function (res) {
//   //     // 转发成功
//   //     console.log("转发成功:" + JSON.stringify(res));
//   //   },
//   //   fail: function (res) {
//   //     // 转发失败
//   //     console.log("转发失败:" + JSON.stringify(res));
//   //   }
//   // }
// },