# Dash PDF Renderer Components 转换计划

状态：已实施确认的首版转换范围。Q1–Q5 的决定已落实；实现、验证证据与上游限制见第 7 节。后续新增需求单独记录并确认。

## 1. 基线与目标

基线：当前 `dash-pdf-renderer-components` 0.1.0 脚手架；锁文件中的 `@react-pdf/renderer` 4.9.0。

首版范围已确认：覆盖所有浏览器可用的公开 API，包括 Canvas、PDF 表单和实验性分页。逐项标注直接映射、适配方式或浏览器运行时限制；不能将上述能力默认推迟到后续版本。函数型 API 已确认采用 `{function, options}` 命名 JavaScript 引用，同时保留常用模板和 JSON 配置。首版仅在浏览器生成 PDF，通过显式启用的 Base64 输出支持 Python 接收文件；Node.js 服务端生成不纳入首版。PDF 表单仅生成可填写的文件，不要求填写结果实时回传 Dash；读取填好的文件作为后续独立需求。

目标：将 renderer 的公开 API 转换为具有完整 Python 属性说明、JSON 安全输入、Dash 回调输出及明确运行环境限制的组件库。保持底层属性名称与语义，针对函数、日期、Blob、Ref 和 Node 流提供显式适配，避免把“有同名组件”当作“完整 API 覆盖”。

参考：

- [renderer 官方文档](https://react-pdf.org/docs/v4/components)、[高级功能](https://react-pdf.org/docs/v4/advanced)、[字体](https://react-pdf.org/docs/v4/fonts)、[样式](https://react-pdf.org/docs/v4/styling)。
- 安装包 `@react-pdf/renderer/lib/react-pdf.d.ts`，以及 `@react-pdf/types`、对应浏览器入口的实际实现。
- `../dash-antd-components/src/components/core` 与 `src/components/fragments`：同步公开包装与内部实现分离。
- `../dash-antd-components/src/props`：共享 Dash 属性、组件专属属性及底层类型引用。
- `../dash-antd-components/src/utils/funcs.ts`：`FunctionProps` 命名引用、参数追加、专用注册表及错误处理。
- `../dash-antd-components/src/utils/dash3.ts`：Dash 上下文与组件插槽适配。
- `../dash-antd-components/dash_prop_typing.py`：标准生成器无法准确恢复的 Python 类型补充。
- `plotly-dash-component-converter` 技能的转换与资源注册规则。
- [Dash 组件开发文档](https://dash.plotly.com/build-your-own-components)、[Dash 3 开发兼容规则](https://dash.plotly.com/dash-3-for-component-developers)。

`upstream-api-inventory.json` 已从当前安装包的类型声明提取公开导出、接口及字段，作为审计快照。类型声明可能与实际实现不同；包含的导入类型也需继续追踪。实现阶段逐项确认运行时行为，不能仅凭文档版本号推断支持范围。

## 2. 实施前的覆盖与缺口

实施前脚手架已实现 21 个 PDF 描述节点，以及 `PDFViewer`、`PDFDownloadLink` 两个输出组件。基础两页生成、SVG 矩形、页码、下载、Base64 回调及嵌套 Text 更新已有浏览器验证；其他节点和属性不能因此视为已完整验证。

| API 组 | 当前状态 | 转换工作 |
| --- | --- | --- |
| Document | 基础元数据 | 补齐日期、pageMode/pageLayout、密码、permissions、conformance；onRender 映射为 JSON 状态/事件；验证格式与加密兼容性 |
| Page | 名称尺寸、数组尺寸、方向、dpi 和共享分页属性 | 补齐底层 PageSize 的所有受支持 JSON 形式、debug、experimentalPagination、layout 函数适配 |
| View | 基础容器与分页属性 | 补齐 debug、动态 render；按底层真实属性拆分共享接口 |
| Text | 文本、分页、孤行控制、两个页码模板变量 | 补齐 debug、完整 render 参数、hyphenationCallback/penalty，以及 SVG Text 的坐标与展示属性 |
| Image | src、cache 及共享属性 | 补齐 source 别名、srcSet、sizes、debug；定义二进制来源适配；验证两种来源同时提供的规则 |
| ImageBackground | 未实现 | 新增节点、图片来源、imageStyle 和内容布局 |
| Link | src 和共享属性 | 补齐 href、hitSlop、debug；验证内部目的地与别名优先级 |
| Note | 节点已导出，但使用了过宽共享类型 | 按底层要求限定字符串内容；补齐真实属性并验证注释输出 |
| Canvas | 未实现 | paint 函数引用；可选 JSON 绘图指令适配，不能把原始 Python 函数当作 paint |
| SVG | 基础形状、分组、渐变、Defs、Tspan | 新增 ClipPath、Marker；补齐 SVGPresentationAttributes、SVG Text、渐变引用及变换；纠正当前 d/points 等字段过宽类型 |
| PDF 表单 | 未实现 | FieldSet、TextInput、Checkbox、Select、List；名称、值、格式、选项及 PDF 实际字段验证；仅生成可填写 PDF，填写结果实时回传和填好文件读取不纳入首版 |
| 输出组件 | 预览、下载、loading/error/url/size/data | 对齐 document/children 语义；补齐 HTML 插槽、下载事件与非可序列化属性适配 |
| BlobProvider | 未实现 | 提供无预览生成组件，以 Dash 输出替代 Blob 和必需的 render-prop |
| Font | 输出组件上的 fonts 字典列表 | 补齐字体变体、断词、emoji 来源及全局注册生命周期；明确可序列化配置与方法适配 |
| StyleSheet | 直接使用字典和字典列表 | 建立 PDF 专属样式类型、媒体查询与单位支持；不将浏览器 CSS 全量照搬为 PDF 样式 |
| usePDF/pdf | 内部使用 pdf().toBlob() | 将 hooks/实例方法归入组件控制 API；保留命令式更新语义，无需为 hook 创建同名 Python 函数 |
| Node 输出 | 未实现 | renderToFile/Stream/Buffer 等 Node 专用 API 不纳入首版，标注运行环境限制；Python 通过 Base64 接收浏览器生成结果，不直接调用 JS 引擎 |
| Ref、PDFRenderer、container、version | 未提供对应对象 API | Ref 不跨 JSON 边界；低层 reconciler/container 不作为普通 Dash 属性；版本可通过诊断信息提供 |

底层目前有 33 个公开组件声明。已确认的全覆盖范围需要新增 10 个同名组件，但仍需补齐原有组件的属性；导出数量只用于审计，不是完成标准。

## 3. 固定转换规则

### 3.1 源码与生成结构

沿用本项目 `src/components`、`src/props`、`src/fragments`、`src/utils`、`src/index.ts`。参考 antd 的职责分离，无需为了目录名称一致进行无意义迁移。

公开组件保持同步默认导出、docgen 可识别的属性接口及每项属性的文档注释。底层库类型优先引用；生成器无法恢复时显式声明 JSON 可用类型，并通过 API 审计防止漂移。功能重的实现才考虑懒加载，公开包装不能隐藏在异步入口中。

`dash_pdf_renderer_components/` 除 `__init__.py` 外均为构建产物，不手动编辑或纳入 Git。新增组件必须同时更新 TS 导出、描述节点转换表、生成元数据及 Python 绑定验证。

### 3.2 Dash 边界与描述节点

输入仅允许 JSON 可序列化数据和明确的组件插槽。日期使用 ISO 8601 字符串，进入 renderer 前验证并转换为 Date；图片二进制使用明确的 Base64/字节适配，不直接暴露 Buffer、Blob 或 Python 文件对象。

PDF 内容树从 Dash 上下文获得序列化节点，转换为底层 PDF primitives，不能把 Dash DOM 包装器送入 PDF reconciler。普通 HTML/Antd/Mantine 组件仅能进入输出组件的 UI 插槽，不能直接进入 PDF 内容树。

保留嵌套节点属性回调更新能力。补齐父子约束、错误路径及字符串位置校验：输出接收一个 Document，Document 接收 Page；Text/Note/SVG 内容分别按底层语义验证，不采用一个过宽共享接口覆盖所有节点。

HTML 通用属性仅用于真正的 HTML 输出容器。PDF 节点的 `id` 需区分 Dash 回调身份、PDF 内部链接目标、SVG 引用目标；不能默认将模式匹配对象 ID 传入 renderer。兼容方案在实施前评估并写入 API 映射。

### 3.3 属性与回调

底层 JSON 可用属性尽量保持名称、枚举、默认值和互斥规则。生成状态、事件通过 `setProps` 输出 JSON；不传出 Error、Blob、DOM 事件、Ref 或内部排版树。

拟定公共状态：loading、error、url、size、data；新增完成事件计数与下载 n_clicks 时须定义递增时机。`onRender` 不直接接收 Python 函数，而提供生成完成的可监听属性；可选命名 JS 回调需与事件输出明确分工。

生成中的状态不同于 Dash 回调加载状态。后者使用 Dash 3 上下文，不把旧版 loading_state 作为主要 API。只对真实用户编辑状态设计 persistence；Blob URL、生成结果和密码不作为默认持久化属性。

### 3.4 函数型 API（Q2 已确认）

已确认采用 `{function: "namespace.name", options: {...}}`，解析到本库专用 `window.dashPdfRendererComponentsFunctions` 注册表。沿用 antd 的“底层参数 + options + context”约定，逐 API 记录实际签名。

仅解析明确的函数型字段；不对任意 style/图片配置里的 function 键进行无差别递归解释。禁止 eval/字符串代码执行；使用自有数据属性查找，拒绝原型链和 getter，校验 JSON options，缺失引用通过 error 明确报告。

- Text.render：页码参数及 subPage 信息；保留 renderTemplate，定义二者互斥规则。
- View.render：返回 PDF 描述节点或受控创建的 renderer 节点；不能返回任意 HTML。
- Page.layout：接收已创建的 PDF children，返回 renderer 布局节点；使用 JS 函数时提供受控 PDF primitive 创建能力，不把 React Element 再序列化成 JSON。
- Canvas.paint：接收 painter、宽高，遵循底层同步绘制约定。
- hyphenationCallback：返回断词片段，分别定义全局与 Text 覆盖配置。
- 图片函数来源：若当前浏览器入口支持，则通过单独来源字段适配，并验证 Promise/error 语义。
- BlobProvider/UI render：与 PDF 内容 render 分开定义，避免 PDF primitives 与 DOM 混用。

底层 render/layout 的 hooks 限制、Text render 可能多次执行等行为写入文档与测试。注册表函数应无副作用，不能把一次 render 等同于一次完成事件。

### 3.5 输出、资源与生命周期

已确认 PDFViewer 保持 Document children；PDFDownloadLink/BlobProvider 对齐底层语义：`document` 传入 PDF 文档，`children` 定义下载或状态 UI。保留现有示例将 Document 放在 children 中的兼容入口。

兼容解析规则：提供 `document` 时，children 按 UI 插槽解析；未提供 document 且 children 为单个 Document（或单元素 Document 列表）时，使用旧入口并提供默认 UI。不得从任意 UI 子树中猜测文档，也不得让兼容入口吞掉正常 UI。同时使用 document 和 Document children 时报告明确的冲突错误。下载或状态 UI 的函数形式使用 Q2 已确认的命名引用。实施时更新 usage.py 展示标准入口，并保留旧入口的回归测试。

Blob URL 仅供当前浏览器使用。Base64 显式启用；新任务清除旧状态并保证完成事件只发布最新结果。所有成功、失败、替换、卸载及取消路径释放 URL；取消发布不等于可以中断正在执行的底层排版。

统一管理字体、断词和 emoji 等全局配置及渲染队列，验证并发输出之间不存在文档/配置串扰。相同字体 family 的冲突需明确报错或限定规则，不静默覆盖。

懒加载或 Worker 属于性能阶段的独立方案。若采用，需同步注册异步 JS 资源，处理函数引用、字体数据与 Worker 的通信限制；不能假定浏览器主线程函数自动存在于 Worker。

React/ReactDOM 外置，由 Dash 提供；执行 React 18/19 兼容验证。主 bundle、proptypes.js、metadata、package-info 和 ICC 等资源均在 `_js_dist`、package-data、MANIFEST 及 npm files 中对齐。

### 3.6 Python 类型与文档

采用 `dash_prop_typing.py` 补充标准生成器丢失的类型。PDFStyle、SVGPresentationAttributes、Bookmark、PageSize、FontRegistration、Permissions、FunctionProps、图片来源和表单配置分别建类型；PDFStyle 与输出容器 CSSStyle 分离。

每个组件文档提供可运行 Python 示例、支持属性、函数适配说明、运行环境限制和回调输出。样式类型从 renderer 的类型定义推导，不直接复用 antd/csstype 的所有 CSS 属性。

## 4. 分阶段转换与验收

| 阶段 | 工作 | 完成条件 |
| --- | --- | --- |
| P0 需求与 API 审计 | 落实已确认的 Q1–Q5；核对公开声明、导入类型和运行时；建立逐属性映射清单 | 每项标记 direct/adapted/deferred/unsupported，并说明理由；待确认项不伪装为已支持 |
| P1 转换基础 | 准确共享类型、描述节点校验、日期/来源适配、专用函数注册表、Python typing | TS/docgen/Python 属性一致；函数/日期/子树回调有边界验证；错误可定位节点 |
| P2 核心文档 API | Document/Page/View/Text/Image/ImageBackground/Link/Note/Canvas 与字体样式 | 分页、元数据、字体、图片、Canvas、动态内容、内部链接有生成结果验证 |
| P3 SVG 与表单 | 补齐 SVG；实现首版要求的 PDF 表单与实验分页 | 裁剪、标记、渐变、SVG 文本可生成；表单字段通过 PDF 解析验证；实验 API 单独标注 |
| P4 输出与交互 | PDFViewer/PDFDownloadLink/BlobProvider、生成控制、完成/下载事件及 UI 插槽 | 输出 API 与文档匹配；生成状态/错误/Base64/事件经 Dash 回调验证；无 URL 泄漏或旧任务回写 |
| P5 兼容、性能与发布准备 | React/Dash 矩阵、并发、较长文档、打包、示例和 CI | 生产 bundle 与浏览器正常；wheel/sdist/npm 含全部资源；完整 API 映射可审阅；不自动发布或合并 |
| 后续独立需求：Node 生成 | Q3 已确认首版不包含；未来明确提出需求后另行设计 | 不影响首版浏览器 API 覆盖；不作为首版验收条件 |

P2–P4 均属于首版范围，Canvas、PDF 表单和实验性分页必须纳入。函数型 API 使用已确认的命名引用与模板/JSON 配置；PDF 表单仅生成可填写的文件；输出组件采用 Q5 已确认的 document/UI children 语义及旧入口兼容规则，不能以阶段排序隐含排除已确认的 API。浏览器不可用或非组件型的公开 API 必须明确标注限制或等价适配；发现无法覆盖首版要求的能力时单独说明并确认。

## 5. 验证设计

- 元数据审计：每个公开组件及适配字段出现在正确的 Python 绑定；检查导出、必填、枚举和互斥关系。JSON 适配是明确差异，不能机械地比较所有底层类型名称。
- 生成结果：用 PDF 解析器检查页数、文字、元数据、内部目的地、书签、加密与表单字段；图形/字体/分页外观补充浏览器或图像验证，文字提取不能证明视觉正确。
- Dash 浏览器：节点回调更新、document 插槽、UI children、加载/失败/恢复、下载、Base64、函数注册及缺失引用；控制台错误按预期行为分类，不吞掉真实异常。
- 生命周期：连续更新只发布最新结果；两个输出并发；字体/断词配置冲突；替换和卸载 URL 回收；资源加载失败后恢复。
- 兼容：最低 Dash 版本、实际使用的 Dash 4、React 18/19；确认生产与开发模式下 proptypes.js 和资源加载。
- 打包：构建后检查 wheel、sdist、npm 包；如新增异步 chunk/Worker，验证安装后实际服务 URL，而非只检查本地目录。

只运行与改动相关的检查。文档计划阶段无需重新运行代码测试；实施后按组件组执行窄范围验证，再进行发布前整体验证。

## 6. askme 需求记录

| 编号 | 待确认问题 | 建议 | 状态 |
| --- | --- | --- | --- |
| Q1 | 首版覆盖所有浏览器公开 API，还是核心排版优先？ | 所有浏览器可用 API，包括 Canvas、PDF 表单和实验性分页；逐项标注适配方式 | 已确认：采用全覆盖范围 |
| Q2 | 函数型 API 是否允许命名 JavaScript 引用？ | 命名引用 `{function, options}` + 常用模板/JSON 配置 | 已确认：采用命名引用及模板/JSON 配置 |
| Q3 | 首版是否包含 Node 服务端生成？ | 浏览器生成 + Base64 给 Python | 已确认：仅浏览器生成；Python 通过 Base64 接收文件；首版不含 Node 服务端生成 |
| Q4 | PDF 表单是否要求填写结果实时回传 Dash？ | 只生成可填写 PDF；读取填写文件单列需求 | 已确认：只生成可填写 PDF；不要求实时回传；读取填好的文件为后续独立需求 |
| Q5 | 输出 API 是否对齐 renderer 的 document 和 UI children 语义？ | 对齐底层语义，并保留脚手架入口兼容适配 | 已确认：document 传 PDF，children 定义 UI；为现有示例提供兼容入口 |

Q4 已明确首版只生成可填写的 PDF。验收应检查实际 PDF 表单字段、初始值及可填写性，不要求读取填写后的值或实时同步 Dash。读取填好的文件作为后续独立需求，届时另行设计输入文件、字段解析和回调输出。

既定边界：本库创建 PDF；任意 Dash 页面转 PDF、已有 PDF 编辑/合并及替换自定义阅读器均不属于这次节点 API 转换。用户提出这些能力时补充独立需求，不将它们宣称为 renderer 的原生覆盖。


## 7. 实施结果（2026-09-14）

P0–P5 的首版工作已落实：

- 对当前 renderer 4.9.0 的 33 个公开组件生成同步包装、完整继承属性接口与逐属性映射；补齐 ImageBackground、Canvas、FieldSet、TextInput、Checkbox、Select、List、ClipPath、Marker、BlobProvider。Image 的 SVG x/y 坐标另外根据浏览器实际实现补充，注明声明缺口。
- 描述树转换处理 Dash 身份/PDF 身份、父子约束、枚举、必需几何字段、日期、图片来源、函数及互斥输入。函数引用采用专用注册表及 `{function, options}`，支持受控创建 PDF 节点；实验性 layout 保留上游测量节点。
- 输出支持标准 document/UI children 和旧入口、嵌套回调、手动生成、Base64、完成计数、下载事件、字体诊断、串行任务和最新结果发布。字体冲突、损坏字体、失败恢复及 URL 回收有浏览器回归。
- 从上游类型生成 PDFStyle、SVGPresentationAttributes 与其他 JSON 边界 Python 类型；生成器的 aria/data 通配属性脚本问题通过构建后的自动修正处理。
- 重写 usage.py 与 assets/pdf-renderer.js，提供三页报告、表单、SVG、Canvas、动态函数、实验分页和三种输出。组件参考、属性级映射、适配文档与 CI 同步完善。构建文件继续忽略，只有包 __init__.py 纳入源码。

验证证据：TypeScript、Prettier、Ruff、Python 绑定生成和生产 webpack 构建通过。浏览器/Python 测试在 Dash 4.4.1 和最低 Dash 3.0.0 下各 9 项全部通过；独立 React 19.2.4 环境生成 24 页文档。解析生成 PDF 核对文字、日期、书签、图片、表单初始值和加密；实际 usage.py 三个输出生成三页 PDF。wheel、sdist 和 npm 打包清单核对绑定、metadata、proptypes、bundle 与 ICC 资源。CodeGraph 索引已更新。

验证边界及上游限制：

- Dash 内置最高 React 版本为 18.3.1；React 19 使用同一生产 bundle 的独立浏览器 harness，不能据此宣称 Dash/React 19 集成已验证。
- renderer 4.9.0 的 Select/List 不继承 FieldSet 前缀，而 TextInput/Checkbox 会继承。包装保留该行为并在 PDF 字段解析测试中确认。
- 图像检查确认 Canvas 色块、SVG 线性/径向渐变、形状、标记与 SVG 文本；Poppler 对 Checkbox 的 ZaDb 字体资源发出警告。表单字段和初始值可解析，但没有对所有外部 PDF 阅读器中的编辑外观作兼容保证。
- 字体测试包括标准字体别名注册/加载、来源冲突以及损坏字体失败与恢复；不代表所有字体文件、文字语言和 CORS 服务都已验证。
- API 映射与绑定审计覆盖所有声明属性；浏览器测试覆盖组件组和关键路径，不表示每种属性组合均经过视觉验证。实验性分页仍遵循上游约束；PDF/A 设置转发不等于合规认证。
- Node 文件/流服务、读取填写结果、React ref 和低层 reconciler 对象仍属于已确认的范围外能力，具体适配说明见 adapters.md。
