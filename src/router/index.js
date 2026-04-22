import { createRouter, createWebHistory } from 'vue-router'

// 自动加载 modules 目录下的所有路由模块
const files = import.meta.glob('./modules/*.js', {
  eager: true,
})

// 路由暂存
const routeModuleList = []

// 遍历路由模块
Object.keys(files).forEach((key) => {
  const module = files[key].default || {}
  const moduleList = Array.isArray(module) ? [...module] : [module]
  routeModuleList.push(...moduleList)
})

// 存放动态路由（从modules加载的路由）
const asyncRouterList = [...routeModuleList]

// 存放固定路由（登录、注册等无需鉴权的路由）
const defaultRouterList = [
  // 根路径重定向到登录页
  {
    path: '/',
    redirect: '/login',
  },
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/login.vue'),
    meta: {
      title: '登录'
    }
  },
  // 注册页
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/register.vue'),
    meta: {
      title: '注册'
    }
  },
  // 404路由（放在最后）
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

// 合并所有路由
const routes = [...defaultRouterList, ...asyncRouterList]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

// 路由前置守卫（核心：权限校验 + 身份匹配）
router.beforeEach((to, from, next) => {
  // 1. 获取用户信息
  const token = localStorage.getItem('token')
  const userInfoStr = localStorage.getItem('userInfo')
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

  // 兼容多种角色字段名
  // 后端 roles 是对象数组：[{ roleKey: 'student', ... }]
  const rolesArr = userInfo?.roles
  const rawRole = userInfo?.role
    || userInfo?.userType
    || userInfo?.type
    || rolesArr?.[0]?.roleKey
    || rolesArr?.[0]?.roleName
    || (typeof rolesArr?.[0] === 'string' ? rolesArr[0] : undefined)

  // 统一角色值为小写字符串
  const roleMap = {
    '0': 'student', 'student': 'student', 'STUDENT': 'student',
    '1': 'teacher', 'teacher': 'teacher', 'TEACHER': 'teacher',
    '2': 'admin',   'admin': 'admin',     'ADMIN': 'admin',
  }
  const userRole = roleMap[rawRole] || rawRole

  const hasToken = !!token || !!userInfo

  console.log('路由守卫检查:', {
    to: to.path,
    from: from.path,
    hasToken,
    rawRole,
    userRole,
    userInfo
  })

  // 2. 定义无需鉴权的路由白名单
  const whiteList = ['/login', '/register']

  // 3. 定义角色路由映射
  const roleRouteMap = {
    student: '/student/home',  // 学生 -> 学生首页
    teacher: '/teacher/home',  // 老师 -> 老师首页
    admin: '/admin/home',      // 管理员 -> 管理员首页
  }

  // 4. 白名单路由直接放行（登录、注册页）
  if (whiteList.includes(to.path)) {
    // 已登录且有有效角色 → 跳到对应首页
    if (hasToken && userRole) {
      next(roleRouteMap[userRole])
    } else {
      // 未登录，或 token 存在但角色无效 → 清掉脏数据，放行到登录页
      if (!userRole && (token || userInfo)) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
      }
      next()
    }
    return
  }

  // 5. 非白名单路由需要鉴权
  if (!hasToken) {
    next('/login')
    return
  }

  // 有 token 但角色未就绪 → 放行（login.vue 里 getInfo 还没返回）
  if (!userRole) {
    next()
    return
  }

  // 6. 检查路由权限（访问的路由和身份是否匹配）
  const routeRole = to.meta?.role
  if (routeRole && routeRole !== userRole) {
    console.log('用户身份与路由不匹配，跳转到对应首页:', roleRouteMap[userRole])
    // 跳转到对应身份的首页
    next(roleRouteMap[userRole] || '/login')
    return
  }

  // 7. 所有校验通过，放行
  console.log('路由校验通过，允许访问')
  next()
})

export default router
