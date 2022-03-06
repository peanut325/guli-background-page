import request from '@/utils/request'

export default {
  // 根据chapterid查询小节
  getVideoById(chapterId) {
    return request({
      url: `/eduservice/edu-video/getVideoById/${chapterId}`,
      method: 'get'
    })
  },
  // 更新小节
  updateVideo(eduVideo) {
    return request({
      url: `/eduservice/edu-video/updateVideo`,
      method: 'put',
      data: eduVideo
    })
  },
  // 新增小节
  addVideo(eduVideo) {
    return request({
      url: `/eduservice/edu-video/addVideo`,
      method: 'post',
      data: eduVideo
    })
  },
  // 删除小节
  deleteEduVideo(eduVideoId) {
    return request({
      url: `/eduservice/edu-video/deleteVideo/${eduVideoId}`,
      method: 'delete'
    })
  },
  // 删除视频
  deleteVideo(videoId) {
    return request({
      url: `/eduvod/video/deleteVideo/${videoId}`,
      method: 'delete'
    })
  }
}
