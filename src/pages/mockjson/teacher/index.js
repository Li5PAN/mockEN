/**
 * 教师端模拟数据 - 统一入口文件
 *
 * 已拆分为多个模块，请从对应的模块导入：
 * - tindex.js: 首页相关数据
 * - tmyclass.js: 班级管理相关数据
 * - studentreview.js: 学生申请审核相关数据
 * - task-management.js: 任务管理相关数据
 * - error-management.js: 错题管理相关数据
 * - classdata.js: 班级数据分析相关数据
 *
 * 示例导入方式：
 * import { mockGetTeacherDashboard } from './mockjson/teacher/tindex.js'
 * import { mockGetClassOverview, mockGetTeacherClassList } from './mockjson/teacher/tmyclass.js'
 * import { mockGetApplicationList } from './mockjson/teacher/studentreview.js'
 */

// ==================== 导出所有模块 ====================

// 首页模块
export {
  mockGetTeacherDashboard,
  mockGetLevelDistribution,
  mockGetTaskCompletionData,
  mockGetActivityTrend,
  mockGetErrorTypeDistribution,
  mockTeacherDashboardData,
  mockLevelDistributionData,
  mockTaskCompletionData,
  mockActivityTrendData,
  mockErrorTypeDistributionData
} from './tindex.js'

// 班级管理模块
export {
  mockGetClassOverview,
  mockGetTeacherClassList,
  mockGetAllTeacherClassList,
  mockCreateClass,
  mockPublishTask,
  mockPublishTaskWithQuestions,
  mockDeleteClass,
  mockClassOverviewData,
  mockTeacherClassListData,
  taskTypeMap
} from './tmyclass.js'

// 学生申请审核模块
export {
  mockGetApplicationList,
  mockAuditApplication,
  mockGetJoinApplications,
  mockGetTransferApplications,
  mockGetQuitApplications,
  mockJoinApplicationsData,
  mockTransferApplicationsData,
  mockQuitApplicationsData
} from './studentreview.js'

// 任务管理模块
export {
  mockGetTaskList,
  mockGetTaskDetail,
  mockSendTaskReminder,
  mockDeleteTask,
  mockTaskListData,
  mockTaskDetailData
} from './task-management.js'

// 错题管理模块
export {
  mockGetQuestionList,
  mockGetQuestionDetail,
  mockGetQuestionTemplateUrl,
  mockImportQuestion,
  mockExportQuestion,
  mockBatchDeleteQuestions,
  mockMarkErrorMastered,
  mockGetErrorStats,
  mockGetErrorTypeStats,
  mockErrorQuestionListData,
  mockErrorQuestionDetailData
} from './error-management.js'

// 班级数据分析模块
export {
  mockGetClassList,
  mockGetClassTaskCompletion,
  mockGetStudentActivity,
  mockGetErrorTypeAnalysis,
  mockGetClassStatistics,
  mockClassListData,
  mockClassTaskCompletionData,
  mockStudentActivityData,
  mockErrorTypeAnalysisData
} from './classdata.js'

// ==================== 学生入班/转班/退班模块 ====================
export {
  mockGetCurrentTeacherStudentCount,
  mockGetTeacherStudentCount,
  mockGetClassStudents,
  mockDirectJoinClass,
  mockDirectQuitClass,
  mockApplyJoinClass,
  mockApplyQuitClass,
  mockGetStudentCurrentClass,
  mockGetStudentClassHistory,
  mockGetStudentClassStats,
  mockUpdateStudentTaskStats,
  mockGetClassStudentStats,
  mockResetEnrollmentData,
  mockInitTestData,
  teacherClasses,
  classInfo,
  getEnrollmentData
} from '../student-enrollment.js'
