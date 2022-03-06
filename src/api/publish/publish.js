import request from '@/utils/request'

export default {
  // 通过courseId获取确认课程内容
  getCoursePublishVO(courseId) {
    return request({
      url: `/eduservice/edu-publish/getCoursePublishVO/${courseId}`,
      method: 'get'
    })
  },
  // 点击发布，修改课程状态
  updateCourseStatus(courseId) {
    return request({
      url: `/eduservice/edu-publish/updateCourseStatus/${courseId}`,
      method: 'put'
    })
  }
}
