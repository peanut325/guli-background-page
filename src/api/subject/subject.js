import request from '@/utils/request'

export default {
  // 查询课程分类列表
  getSubjectAll() {
    return request({
      url: `/eduservice/edu-subject/listSubject`,
      method: 'get'   // get请求后端
    })
  }
}
