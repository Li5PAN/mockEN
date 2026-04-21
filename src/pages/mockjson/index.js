/**
 * 学生端模拟数据 - 统一入口文件
 * 
 * 已拆分为多个模块，请从对应的模块导入：
 * - auth.js: 用户认证相关数据
 * - home.js: 首页相关数据
 * - wordlearn.js: 单词学习相关数据
 * - myclass.js: 我的班级相关数据
 * - mytask.js: 我的任务相关数据
 * - myerror.js: 我的错题相关数据
 * - myprogress.js: 我的学情数据
 * 
 * 示例导入方式：
 * import { mockLogin, mockGetUserInfo } from './mockjson/auth.js'
 * import { mockGetStudentOverview } from './mockjson/home.js'
 * import { mockSearchWord, mockWordsData } from './mockjson/wordlearn.js'
 */

// ==================== 导出所有模块 ====================

// 认证模块
export {
  mockLogin,
  mockRegister,
  mockGetUserInfo,
  mockGetStudentStats,
  mockUsers,
  mockStudentUsers,
  mockTeacherUsers,
  mockAdminUsers,
  getUserInfoByUsername,
  getStudentClassInfo
} from './auth.js'

// 首页模块
export {
  mockGetStudentOverview,
  mockClockIn,
  mockGetClockInStatus,
  mockGetWeeklyQuestions,
  mockGetWeeklyWordsStudied,
  mockGetHomePendingTasks,
  mockGetClassProgress,
  mockStudentOverviewData,
  mockClockInData,
  mockWeeklyTasksData,
  mockWeeklyWordsData,
  mockHomePendingTasksData,
  mockClassProgressData
} from './home.js'

// 单词学习模块
export {
  mockSearchWord,
  mockFetchStudentWords,
  mockGetFavoriteWords,
  mockToggleWordCollect,
  mockDeleteFavoriteWords,
  mockMatchWordAnswer,
  mockRecordProgress,
  mockGetWordProgress,
  mockWordsData,
  mockFavoriteWordsData,
  mockWordProgressData,
  chineseToEnglishMap
} from './wordlearn.js'

// 班级模块
export {
  mockGetClassStatus,
  mockGetMyClassInfo,
  mockGetClassList,
  mockGetClassRanking,
  mockGetClassTrend,
  mockJoinClass,
  mockQuitClass,
  mockApplyChangeClass,
  ClassStatus,
  mockAllClasses,
  mockCurrentClassData,
  mockClassRankingData,
  mockClassTrendData,
  mockClassStatusData
} from './myclass.js'

// 任务模块
export {
  mockGetMyTasks,
  mockGetTaskQuestions,
  mockGetTaskDetail,
  mockSubmitTaskAnswers,
  mockGetTaskStats,
  mockPendingTasksData,
  mockCompletedTasksData,
  mockTaskQuestions,
  taskTypeMap
} from './mytask.js'

// 错题模块
export {
  mockGetWrongQuestions,
  mockDeleteWrongQuestions,
  mockGetWrongQuestionDetail,
  mockMarkErrorMastered,
  mockGetErrorStats,
  mockGetErrorTypeStats,
  mockErrorQuestionsData,
  mockErrorStatsData,
  errorQuestionTypeMap
} from './myerror.js'

// 学情模块
export {
  mockGetStudentStats,
  mockGetWeeklyTasks,
  mockGetWeeklyWords,
  mockGetKnowledgePoints,
  mockGetStudyTimeDistribution,
  mockGetTaskTypeStats,
  mockGetProgressReport,
  mockStudentStatsData,
  mockKnowledgePointsData,
  mockStudyTimeData,
  mockTaskTypeStatsData
} from './myprogress.js'
