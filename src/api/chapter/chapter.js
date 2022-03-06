import request from '@/utils/request'

export default {
  // 查询所有章节
  getChapterAll(courseId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterAll/${courseId}`,
      method: 'get'
    })
  },
  // 根据id查询章节
  getChapterById(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterById/${chapterId}`,
      method: 'get'
    })
  },
  // 更新章节
  updateChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/updateChapter`,
      method: 'put',
      data: chapter
    })
  },
  // 新增章节
  addChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/deleteChapterById/${chapterId}`,
      method: 'delete'
    })
  }
}
