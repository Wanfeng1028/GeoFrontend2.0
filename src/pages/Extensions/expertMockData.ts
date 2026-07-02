export type ExpertCommand = {
  trigger: string
  description: string
}

export type ExpertDataConnection = {
  name: string
  description: string
  enabled: boolean
}

export type ExpertKnowledgeModule = {
  title: string
  description: string
}

export type ExpertSuite = {
  id: string
  name: string
  author: string
  category: '空间分析' | '遥感解译' | '数据处理' | '专题制图' | '灾害评估'
  description: string
  version: string
  commandCount: number
  knowledgeCount: number
  installed: boolean
  featured?: boolean
  quickCommands: ExpertCommand[]
  dataConnections: ExpertDataConnection[]
  knowledgeModules: ExpertKnowledgeModule[]
}

export const mockExpertSuites: ExpertSuite[] = [
  {
    id: 'spatial-analyst',
    name: '空间分析规划师',
    author: '@GeoWork',
    category: '空间分析',
    description: '面向缓冲区、叠加分析、可达性评估和选址分析的 GIS 工作流专家。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 4,
    installed: true,
    featured: true,
    quickCommands: [
      { trigger: '/缓冲区分析', description: '对指定要素生成缓冲区' },
      { trigger: '/叠加分析', description: '多图层叠加计算' },
      { trigger: '/选址评估', description: '综合因子选址评分' },
      { trigger: '/可达性分析', description: '服务可达性评估' },
      { trigger: '/空间查询', description: '按条件查询空间要素' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的矢量数据', enabled: true },
      { name: '空间数据索引', description: '自动索引 GeoJSON/Shapefile', enabled: true },
    ],
    knowledgeModules: [
      { title: '坐标系统与投影', description: '常见坐标系、投影变换、EPSG 编码' },
      { title: '缓冲区与叠加分析', description: '缓冲区生成策略、多图层叠加算法' },
      { title: '可达性模型', description: '服务半径、网络分析、OD 矩阵' },
      { title: '选址评估方法', description: '多因子加权评分、AHP 层次分析' },
    ],
  },
  {
    id: 'remote-sensing',
    name: '遥感解译助手',
    author: '@GeoWork',
    category: '遥感解译',
    description: '辅助进行 NDVI、土地覆盖识别、变化检测和遥感影像解译。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 3,
    installed: false,
    quickCommands: [
      { trigger: '/NDVI计算', description: '计算归一化植被指数' },
      { trigger: '/土地覆盖解译', description: '土地覆盖类型识别' },
      { trigger: '/变化检测', description: '多期影像变化检测' },
      { trigger: '/云量检查', description: '检查影像云量覆盖' },
      { trigger: '/影像预处理', description: '辐射校正与几何校正' },
    ],
    dataConnections: [
      { name: '遥感影像目录', description: '访问工作区中的遥感影像', enabled: true },
      { name: '当前工作目录', description: '访问工作区中的文件', enabled: true },
    ],
    knowledgeModules: [
      { title: '遥感指数与变化检测', description: 'NDVI、NDWI、NDBI 等常用指数' },
      { title: '土地覆盖分类', description: '监督分类、非监督分类方法' },
      { title: '影像预处理', description: '大气校正、几何校正、融合' },
    ],
  },
  {
    id: 'data-qc',
    name: '空间数据质检员',
    author: '@GeoWork',
    category: '数据处理',
    description: '检查 GeoJSON、Shapefile、CSV 坐标字段、几何有效性和坐标系统一致性。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 3,
    installed: false,
    quickCommands: [
      { trigger: '/检查坐标系', description: '验证坐标系统声明' },
      { trigger: '/检查几何错误', description: '检查自相交、空几何等' },
      { trigger: '/字段完整性检查', description: '检查必填字段缺失' },
      { trigger: '/重复要素检查', description: '检测重复几何要素' },
      { trigger: '/导出质检报告', description: '生成质检结果报告' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的数据文件', enabled: true },
    ],
    knowledgeModules: [
      { title: '数据质量检查', description: '几何有效性、属性完整性、拓扑关系' },
      { title: '坐标系统与投影', description: '坐标系声明、投影一致性验证' },
      { title: '质检报告规范', description: '报告格式、统计口径、问题分级' },
    ],
  },
  {
    id: 'thematic-cartographer',
    name: '专题地图制图师',
    author: '@GeoWork',
    category: '专题制图',
    description: '根据业务目标生成专题地图设计建议、图例规范、配色方案和出图说明。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 4,
    installed: false,
    quickCommands: [
      { trigger: '/生成专题图', description: '根据数据生成专题地图' },
      { trigger: '/设计图例', description: '生成图例规范建议' },
      { trigger: '/地图配色', description: '推荐配色方案' },
      { trigger: '/出图检查', description: '检查出图规范合规性' },
      { trigger: '/制图说明', description: '生成制图技术说明' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的地图数据', enabled: true },
      { name: '空间数据索引', description: '自动索引矢量数据', enabled: true },
    ],
    knowledgeModules: [
      { title: '专题制图规范', description: '图例、比例尺、指北针、注记' },
      { title: '配色方案', description: '分类色、渐变、色盲友好配色' },
      { title: '符号化策略', description: '点、线、面要素符号化' },
      { title: '出图格式', description: 'PNG、PDF、SVG 输出规范' },
    ],
  },
  {
    id: 'urban-renewal',
    name: '城市更新评估专家',
    author: '@GeoWork',
    category: '空间分析',
    description: '面向城市更新、人口服务半径、公共设施覆盖和地块潜力评估的分析专家。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 4,
    installed: false,
    quickCommands: [
      { trigger: '/设施覆盖分析', description: '分析公共设施空间覆盖' },
      { trigger: '/服务半径评估', description: '评估设施服务半径' },
      { trigger: '/地块潜力评分', description: '地块开发潜力综合评分' },
      { trigger: '/人口可达性', description: '人口分布与设施可达性' },
      { trigger: '/更新单元识别', description: '识别城市更新单元' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的城市数据', enabled: true },
      { name: '空间数据索引', description: '索引 POI、建筑、地块数据', enabled: true },
    ],
    knowledgeModules: [
      { title: '城市更新政策', description: '更新单元划定、容积率、用地性质' },
      { title: '公共服务设施标准', description: '教育、医疗、交通服务半径' },
      { title: '地块评估方法', description: '潜力评分、区位因子、交通可达性' },
      { title: '人口空间分析', description: '人口密度、服务覆盖、供需匹配' },
    ],
  },
  {
    id: 'disaster-risk',
    name: '灾害风险评估专家',
    author: '@GeoWork',
    category: '灾害评估',
    description: '辅助进行洪涝、滑坡、火灾等风险因子叠加分析和应急地图生成。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 4,
    installed: false,
    quickCommands: [
      { trigger: '/风险因子叠加', description: '多因子风险叠加分析' },
      { trigger: '/洪涝影响范围', description: '洪涝淹没范围模拟' },
      { trigger: '/应急地图生成', description: '生成应急响应地图' },
      { trigger: '/风险分区', description: '风险等级空间分区' },
      { trigger: '/灾害报告摘要', description: '生成灾害风险评估报告' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的灾害数据', enabled: true },
      { name: '遥感影像目录', description: '访问遥感监测数据', enabled: true },
      { name: '空间数据索引', description: '索引 DEM、水系、地质数据', enabled: true },
    ],
    knowledgeModules: [
      { title: '灾害风险模型', description: '洪涝、滑坡、火灾风险评估方法' },
      { title: '应急响应规范', description: '应急地图、疏散路线、避难场所' },
      { title: '风险分区方法', description: '风险等级划分、敏感性分析' },
      { title: '灾害报告模板', description: '报告结构、统计口径、建议措施' },
    ],
  },
  {
    id: 'dem-analysis',
    name: 'DEM 地形分析专家',
    author: '@GeoWork',
    category: '空间分析',
    description: '面向 DEM 数据的坡度、坡向、汇流、剖面和地形因子分析。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 3,
    installed: false,
    quickCommands: [
      { trigger: '/坡度分析', description: '计算坡度栅格' },
      { trigger: '/坡向分析', description: '计算坡向栅格' },
      { trigger: '/流域提取', description: '流域边界与河网提取' },
      { trigger: '/剖面分析', description: '地形剖面线分析' },
      { trigger: '/地形因子统计', description: '地形因子统计汇总' },
    ],
    dataConnections: [
      { name: '当前工作目录', description: '访问工作区中的 DEM 数据', enabled: true },
      { name: '空间数据索引', description: '索引高程栅格数据', enabled: true },
    ],
    knowledgeModules: [
      { title: '地形分析方法', description: '坡度、坡向、曲率、汇流累积' },
      { title: '流域提取算法', description: 'D8 算法、河网分级、流域划分' },
      { title: '地形因子', description: '地形湿度指数、地形位置指数' },
    ],
  },
  {
    id: 'change-detection',
    name: '遥感变化监测专家',
    author: '@GeoWork',
    category: '遥感解译',
    description: '面向多期遥感影像的变化检测、异常区域标记和变化摘要生成。',
    version: 'v1.0.0',
    commandCount: 5,
    knowledgeCount: 3,
    installed: false,
    quickCommands: [
      { trigger: '/多期影像对比', description: '多时相影像对比分析' },
      { trigger: '/变化区域提取', description: '提取变化图斑' },
      { trigger: '/异常斑块标记', description: '标记异常变化区域' },
      { trigger: '/变化面积统计', description: '统计变化面积与类型' },
      { trigger: '/监测报告生成', description: '生成变化监测报告' },
    ],
    dataConnections: [
      { name: '遥感影像目录', description: '访问多期遥感影像', enabled: true },
      { name: '当前工作目录', description: '访问工作区中的矢量数据', enabled: true },
    ],
    knowledgeModules: [
      { title: '变化检测方法', description: '影像差值、分类后比较、对象级检测' },
      { title: '变化类型体系', description: '土地利用变化分类、转移矩阵' },
      { title: '监测报告模板', description: '报告结构、图表规范、变化摘要' },
    ],
  },
]

export const expertCategories = [
  '全部',
  '空间分析',
  '遥感解译',
  '数据处理',
  '专题制图',
  '灾害评估',
] as const
