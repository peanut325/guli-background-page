import request from '@/utils/request'

export default {
  // 讲师列表，条件查询
  // currentPage表示当前页，limit表示每页的记录数,teacherQuery表示条件对象
  getTeacherListPage(currentPage, limit, teacherQuery) {
    return request({
      url: `/eduservice/edu-teacher/pageTeacherCondition/${currentPage}/${limit}`,
      method: 'post',   // post请求后端
      // data表示把对象转换为json格式传输到后端
      data: teacherQuery
    })
  },

  // 删除讲师
  removeById(teacherId) {
    return request({
      url: `/eduservice/edu-teacher/${teacherId}`,
      method: 'delete'
    })
  },

  // 新增讲师
  saveTeacher(teacher) {
    return request({
      url: `/eduservice/edu-teacher/addTeacher`,
      method: 'post',
      // 用json传输
      data: teacher
    })
  },

  // 根据id查找讲师
  getTeacherById(id) {
    return request({
      url: `/eduservice/edu-teacher/${id}`,
      method: 'get'
    })
  },

  // 根据id修改讲师
  updateTeacherById(teacher) {
    return request({
      url: `/eduservice/edu-teacher/${teacher.id}`,
      method: 'put',
      data: teacher
    })
  },

  // 查找所有讲师
  getTeacherAll() {
    return request({
      url: `/eduservice/edu-teacher/findAll`,
      method: 'get'
    })
  }
}
