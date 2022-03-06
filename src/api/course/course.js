import request from '@/utils/request'

export default {
  // 新增课程
  addCourseAll(courseInfo) {
    return request({
      url: `/eduservice/edu-course/saveCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 查询所有讲师用于显示
  getTeacherAll() {
    return request({
      url: `/eduservice/edu-teacher/findAll`,
      method: 'get'
    })
  },
  // 根据id查询课程用于回显
  getCourseInfoById(courseId) {
    return request({
      url: `/eduservice/edu-course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 修改课程
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/updateCourseInfo`,
      method: 'put',
      data: courseInfo
    })
  },
  // 分页条件查询课程用于显示
  getPageCourseCondition(currentPage, limit, courseQuery) {
    return request({
      url: `/eduservice/edu-course/getPageCourseCondition/${currentPage}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  // 根据courseId删除课程
  deleteCourseByCourseId(courseId) {
    return request({
      url: `/eduservice/edu-course/deleteCourseById/${courseId}`,
      method: 'delete'
    })
  }
}
