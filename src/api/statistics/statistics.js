import request from '@/utils/request'

export default {
  // 保存统计统计数据
  saveStatisticsData(day) {
    return request({
      url: `/statisticsservice/statistics-daily/countRegister/${day}`,
      method: 'post'
    })
  },
  getStatisticsData(searchObj) {
    return request({
      url: `/statisticsservice/statistics-daily/getData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
