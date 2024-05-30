---
title: "如何研究学习一个优秀的开源项目"
summary: "研究学习一个使用TypeScript和React构建的现代Web开发项目开源项目"
date: "2024-05-07"
draft: false
tags:
- React
- TypeScript
---

## 基于React的后台管理系统

地址： [slash-admin](https://github.com/d3george/slash-admin)

学习开源项目，第一步首先查看项目目录结构，我们将目录结构中的每一块是干什么的进行详细描述。不废话直接干

![目录结构](https://low-code-bucket.oss-cn-hangzhou.aliyuncs.com/blogs/iShot_2024-05-07_14.41.44.png)

### 根目录文件夹部分

- **.github**：是GitHub特定的配置文件，如`GitHub Actions`的工作流程，这些工作流程可以直接在您的仓库中自动化软件工作流程。
- **.husky**：是一个工具，用于在提交代码前自动触发Git钩子，通常用于帮助团队在提交代码时遵循特定的规范和标准，以确保代码的质量和一致性。除了代码风格检查和单元测试之外，.husky还可以用于其他各种预提交操作，例如检查提交信息格式、验证文件权限等。通过定义预提交钩子，团队可以在代码提交前自动运行这些检查和操作，从而降低出错的可能性，保证项目的整洁和可维护性。
- **.vscode**：存放Visual Studio Code编辑器的配置文件，如编辑器设置或扩展推荐。
- **node_modules**：包含项目依赖的npm包。这些是通过npm或yarn安装的外部JavaScript库或工具。
- **public**：存放公共资源，如HTML文件、图标或可公开访问的静态资源。
- **src**：源代码目录，包含项目的主要代码文件。
- **types**：存放TypeScript的类型定义文件，用于定义项目中使用的复杂类型。

### 根目录文件部分

- **.dockerignore**：指定Docker在构建镜像时应忽略的文件和目录。
- **.editorconfig**：包含代码编辑器的通用配置，目的是确保团队成员在不同的编辑器中编辑代码时能够遵循统一的代码风格和格式。
  - 也许你会疑惑这个配置为什么不放在前面的.vscode配置中呐？理由如下：
  - **.vscode**目录下的配置文件是特定于 `Visual Studio Code` 编辑器的设置，它包含了项目或工作区的特定配置，例如工作区设置、调试配置、任务配置等。这些配置文件只会在使用 `Visual Studio Code` 编辑器时生效，无法在其他编辑器中应用。
  - **.editorconfig** 文件是用来定义编辑器中的通用配置，包括空格、换行符等常规操作，而且可以被许多不同的编辑器识别和应用。它的目的是确保团队成员在不同的编辑器中编辑代码时能够遵循统一的代码风格和格式。
  - 一个是通用的编辑器配置，一个是特定于 `Visual Studio Code` 编辑器的设置。
- **.env, .env.development, .env.production**：包含环境变量的文件，.env为默认环境，其他两个分别对应开发和生产环境。
- **.eslintignore**：指定ESLint（一个代码质量和代码风格检查工具）应忽略的文件。
- **.eslintrc.js**：ESLint的配置文件，定义代码检查的规则。
- **.gitignore**：指定git版本控制系统应忽略的文件。
- **.lintstagedrc**：lint-staged 是一个工具，它可以在提交文件到版本控制系统（如 Git）之前，对指定的文件进行 lint 检查并自动修复。这样可以确保提交的代码符合团队定义的代码规范和质量标准。
- **.prettierignore**：指定Prettier（一个代码格式化工具）应忽略的文件。
- **.prettierrc**：Prettier的配置文件，定义代码格式化的规则。Prettier 是一个代码格式化工具，可以帮助开发者自动格式化代码，使其符合统一的风格和规范。
- **.stylelintignore**：指定Stylelint（一个样式文件检查工具）应忽略的文件。
- **.stylelintrc**：Stylelint的配置文件。Stylelint 是一个强大的样式文件检查工具，可以帮助开发者检查 CSS、SCSS、Less 等样式文件中的代码，以确保其符合规范和最佳实践。

- **commitlint.config.js**：commitlint 是一个用于检查 Git 提交信息格式的工具，通过配置 commitlint 工具，团队可以约束提交信息的格式，确保提交信息清晰明了，方便快速了解提交的内容和目的。
- **docker-compose.yaml**：Docker Compose的配置文件，用于定义和运行多容器Docker应用程序。
- **Dockerfile**：Docker的配置文件，用于自动构建Docker镜像。
- **index.html**：Web应用的入口HTML文件。
- **LICENSE**：项目的许可证文件，说明他人可以如何使用此项目 MIT。
- **package.json**：记录项目的依赖、脚本和配置信息的npm配置文件。
- **pnpm-lock.yaml**：pnpm的锁文件，确保依赖的一致性。
- **postcss.config.js**：PostCSS的配置文件，用于转换CSS的工具。PostCSS不是一种预处理器，而是一种处理CSS的工具链，通过插件系统可以扩展CSS的处理功能。这使得PostCSS既可以实现类似Less和Sass这样的预处理器的功能，如变量、混合和嵌套等，同时也能提供这些工具所不具备的特性和优势，例如添加前缀 autoprefixer，扩展尚未被广泛支持的CSS未来特性通过像postcss-preset-env这样的插件来支持。可以作为一个增强版的CSS预处理器使用，还能为现代Web开发提供强大的支持和灵活性。它能够补充传统预处理器的功能，同时提供额外的优势，如通过其生态系统中的各种插件来实现高级优化和未来CSS特性的支持。
- **README.md, README.zh-CN.md**：项目的README文件，描述项目信息，其中包括一个中文版本。
- **tailwind.config.js**：是 Tailwind CSS 项目的配置文件。这个文件用于定制和扩展 Tailwind CSS 的默认设置，包括颜色、字体、断点和其他很多实用工具类。开发者可以在这个文件中调整预设值，添加新的实用工具类，或者根据项目的特定需求定制主题。
- **tsconfig.json, tsconfig.node.json**：TypeScript的编译配置文件。
- **vite-env.d.ts**：Vite项目中用于声明环境变量类型的TypeScript定义文件。
- **vite.config.ts**：Vite的配置文件，Vite是一个为了现代Web应用而设计的高效前端构建工具。

> 下面描述几个类库信息

## tailwind是什么？

简介: **Tailwind CSS** 是一个功能强大的实用工具优先的 CSS 框架，它允许开发者通过在 HTML 文件中直接使用预定义的类来快速构建用户界面。不同于传统的 CSS 框架，Tailwind 提供了大量的原子类，每个类对应一个单一的 CSS 属性，如边距、颜色、字体大小等。

**Tailwind CSS** 提供了大量预定义的类名，每个类名都对应固定的 CSS 样式。这样的设计使得开发者在大多数情况下无需直接编写 CSS 代码，而是可以通过组合这些预定义的类名来快速构建和定制界面。

对于手写css来说，tailwind你需要记忆一堆类名(非常语义化)，在转换设计稿时首先观察设计稿的布局、颜色、字体、间距等元素。这一步是关键，因为它决定了你将如何选择和应用 Tailwind 的类。基于观察的结果，选择合适的 Tailwind 类来实现设计。例如，如果你看到一个元素需要较大的上边距，你可能会选择使用 mt-8 或 mt-12。

**对比传统的开发方式**

- 优势：能显著提升开发速度
- 优势：用工具类的一致性有助于保持整个项目的样式一致。由于样式直接在 HTML 中定义，因此也更容易维护和更新。
- 劣势：对于复杂的样式逻辑，尤其是在大型项目中，使用大量重复的类可能会导致 HTML 结构臃肿。
- 劣势：虽然tailwind提供了广泛的预定义类，但在定制场景下，可能实现起来会比较复杂(相对于直接使用类名来说)

tailwind特别适合需要快速开发和原型设计的环境
对于需要深度定制或非常具体的样式表达的项目，传统的 CSS 编写方法更有优势

## public中添加mockServiceWorker.js文件是什么？什么是msw？

一般来说public中存放的是公共资源，如HTML文件、图标或可公开访问的静态资源。这mockServiceWorker.js是什么？
这个文件主要是为了解决模拟数据问题而存在的，这个类库本身叫做MSW。然儿在浏览器端使用 Mock Service Worker (MSW) 需要添加 mockServiceWorker.js 文件，这主要是因为 MSW 利用了 Service Worker 技术来拦截和处理网络请求。
Service Worker 是一种在浏览器后台运行的脚本，可以拦截和修改访问和管理的网络请求。MSW 使用 Service Worker 来拦截发出的请求，并根据定义的模拟逻辑返回响应。罗列一下里面的关系如下：

1. 我们的需求是在本地开发前端应用时使用相对真实的模拟服务
2. 使用的是msw类库去实现
3. 然儿在浏览器端使用msw需要添加mockServiceWorker.js
4. 这个文件是一个预先编写的 Service Worker 脚本，其职责是在网络请求级别拦截请求。
5. 所以当前文件是实现模拟服务的必要静态文件

MSW是什么？Mock Service Worker（MSW）是一个旨在浏览器和Node.js中使用的API模拟库。它能够拦截和模拟网络请求，这对开发者来说极为有用，因为它允许你在不需要实际后端服务器的情况下模拟网络响应，从而实现无缝的测试体验​，在浏览器中的用法如下。

### 浏览器端中创建虚拟模拟服务步骤如下

#### 创建模拟服务器

```javascript
// mocks/browser.js
// 生成大量虚假（但看上去真实）数据，用于测试和开发。
import { faker } from '@faker-js/faker';
// 引入 msw 库中的相关函数
import { setupWorker, http, delay } from 'msw';
// 定义请求处理程序
const handles = [
    http.get('/api/user', async (req, res, ctx) => {
        await delay(1000),
        return HttpResponse.json(
            Array.from({ length: 10 }).map(() => ({
                fullname: faker.person.fullName(), // 生成全名
                email: faker.internet.email(),
                avatar: faker.image.avatar(),
                address: faker.location.streetAddress()
            })),
            {
                status: 200,
            },
        )
    })
];
// 创建一个模拟服务器实例
const worker = setupWorker(...handlers);
// 导出 worker 以便在其他文件中启用
export { worker };
```

#### 启动模拟服务器

```javascript
import { worker } from './mocks/browser';
if (process.env.NODE_ENV === 'development') {
    worker.start();
}
```

**工作原理**：当在项目中调用 worker.start() 时，会发生如下几个步骤：

1. MSW 通过 **mockServiceWorker.js** 脚本在浏览器中注册一个 **Service Worker**。这个过程涉及到将 **mockServiceWorker.js** 文件作为 **Service Worker** 安装到浏览器中。
2. 一旦注册成功，这个 **Service Worker** 就开始拦截页面发出的所有或特定的 HTTP 请求（取决于如何配置 MSW）。
3. 对于拦截的每个请求，**Service Worker** 会根据定义的处理逻辑生成响应。这包括根据模拟的定义返回数据、错误或其他网络响应。
4. 由于所有的拦截和数据模拟都是在 **Service Worker** 中完成的，它不会侵入或修改应用的实际代码。这使得模拟过程对应用透明，且易于启用或禁用。

#### 使用模拟的API

一旦服务工作器启动，所有定义的请求处理程序将自动拦截对应的网络请求，并返回模拟的响应。
例如，当你的应用尝试访问 /api/user，MSW 将拦截这个请求并返回你在处理程序中定义的模拟响应。

> tip: 那什么是 **Service Worker**？是一种运行在浏览器背后的脚本，允许开发人员以编程方式控制缓存和网络请求的技术，使网站能够提供更丰富的离线体验和性能优化。

## 菜单和权限管理

id: 唯一标识符。
parentId: 父级权限的标识符，用于构建层次结构。
label: 用于国际化的标签。
name: 权限项的名称。
icon: 图标。
type: 权限类型（如目录或菜单）。
route: 路由路径。
component: 关联的前端组件路径。
order: 菜单顺序（用于排序）。
children: 子权限项的数组。

```typescript
export enum PermissionType {
  CATALOGUE, // 0 catalogue 目录
  MENU, // 1 menu 菜单
  BUTTON, // 2 button 按钮
}
```

### DASHBOARD_PERMISSION dashboard_permission 仪表盘

```typescript
const DASHBOARD_PERMISSION = {
  id: '9100714781927703',
  parentId: '',
  label: 'sys.menu.dashboard',
  name: 'Dashboard',
  icon: 'ic-analysis',
  type: PermissionType.CATALOGUE,
  route: 'dashboard',
  order: 1,
  children: [
    {
      id: '8426999229400979',
      parentId: '9100714781927703',
      label: 'sys.menu.workbench',
      name: 'Workbench',
      type: PermissionType.MENU,
      route: 'workbench',
      component: '/dashboard/workbench/index.tsx',
    },
    {
      id: '9710971640510357',
      parentId: '9100714781927703',
      label: 'sys.menu.analysis',
      name: 'Analysis',
      type: PermissionType.MENU,
      route: 'analysis',
      component: '/dashboard/analysis/index.tsx',
    },
  ],
};
```

DASHBOARD_PERMISSION 是一个目录类型的权限项，代表仪表盘（Dashboard）。
其下包含两个子权限项 Workbench 和 Analysis，这两个是菜单类型的权限项，分别对应不同的前端组件路径。

### MANAGEMENT_PERMISSION management_permission 管理

```typescript
const MANAGEMENT_PERMISSION = {
  id: '0901673425580518',
  parentId: '',
  label: 'sys.menu.management',
  name: 'Management',
  icon: 'ic-management',
  type: PermissionType.CATALOGUE,
  route: 'management',
  order: 2,
  children: [
    {
      id: '2781684678535711',
      parentId: '0901673425580518',
      label: 'sys.menu.user.index',
      name: 'User',
      type: PermissionType.CATALOGUE,
      route: 'user',
      children: [
        {
          id: '4754063958766648',
          parentId: '2781684678535711',
          label: 'sys.menu.user.profile',
          name: 'Profile',
          type: PermissionType.MENU,
          route: 'profile',
          component: '/management/user/profile/index.tsx',
        },
        {
          id: '2516598794787938',
          parentId: '2781684678535711',
          label: 'sys.menu.user.account',
          name: 'Account',
          type: PermissionType.MENU,
          route: 'account',
          component: '/management/user/account/index.tsx',
        },
      ],
    },
    {
      id: '0249937641030250',
      parentId: '0901673425580518',
      label: 'sys.menu.system.index',
      name: 'System',
      type: PermissionType.CATALOGUE,
      route: 'system',
      children: [
        {
          id: '1985890042972842',
          parentId: '0249937641030250',
          label: 'sys.menu.system.organization',
          name: 'Organization',
          type: PermissionType.MENU,
          route: 'organization',
          component: '/management/system/organization/index.tsx',
        },
        {
          id: '4359580910369984',
          parentId: '0249937641030250',
          label: 'sys.menu.system.permission',
          name: 'Permission',
          type: PermissionType.MENU,
          route: 'permission',
          component: '/management/system/permission/index.tsx',
        },
        {
          id: '1689241785490759',
          parentId: '0249937641030250',
          label: 'sys.menu.system.role',
          name: 'Role',
          type: PermissionType.MENU,
          route: 'role',
          component: '/management/system/role/index.tsx',
        },
        {
          id: '0157880245365433',
          parentId: '0249937641030250',
          label: 'sys.menu.system.user',
          name: 'User',
          type: PermissionType.MENU,
          route: 'user',
          component: '/management/system/user/index.tsx',
        },
        {
          id: '0157880245365434',
          parentId: '0249937641030250',
          label: 'sys.menu.system.user_detail',
          name: 'User Detail',
          type: PermissionType.MENU,
          route: 'user/:id',
          component: '/management/system/user/detail.tsx',
          hide: true,
        },
      ],
    },
  ],
};
```

MANAGEMENT_PERMISSION 是一个目录类型的权限项，代表管理（Management）。
其下包含用户管理（User）和系统管理（System）两大子目录，每个子目录下又有多个子权限项，分别对应不同的前端组件路径。

### COMPONENTS_PERMISSION components_permission 组件

```typescript
const COMPONENTS_PERMISSION = {
  id: '2271615060673773',
  parentId: '',
  label: 'sys.menu.components',
  name: 'Components',
  icon: 'solar:widget-5-bold-duotone',
  type: PermissionType.CATALOGUE,
  route: 'components',
  order: 3,
  children: [
    {
      id: '2478488238255411',
      parentId: '2271615060673773',
      label: 'sys.menu.icon',
      name: 'Icon',
      type: PermissionType.MENU,
      route: 'icon',
      component: '/components/icon/index.tsx',
    },
    {
      id: '6755238352318767',
      parentId: '2271615060673773',
      label: 'sys.menu.animate',
      name: 'Animate',
      type: PermissionType.MENU,
      route: 'animate',
      component: '/components/animate/index.tsx',
    },
    {
      id: '9992476513546805',
      parentId: '2271615060673773',
      label: 'sys.menu.scroll',
      name: 'Scroll',
      type: PermissionType.MENU,
      route: 'scroll',
      component: '/components/scroll/index.tsx',
    },
    {
      id: '1755562695856395',
      parentId: '2271615060673773',
      label: 'sys.menu.markdown',
      name: 'Markdown',
      type: PermissionType.MENU,
      route: 'markdown',
      component: '/components/markdown/index.tsx',
    },
    {
      id: '2122547769468069',
      parentId: '2271615060673773',
      label: 'sys.menu.editor',
      name: 'Editor',
      type: PermissionType.MENU,
      route: 'editor',
      component: '/components/editor/index.tsx',
    },
    {
      id: '2501920741714350',
      parentId: '2271615060673773',
      label: 'sys.menu.i18n',
      name: 'Multi Language',
      type: PermissionType.MENU,
      route: 'i18n',
      component: '/components/multi-language/index.tsx',
    },
    {
      id: '2013577074467956',
      parentId: '2271615060673773',
      label: 'sys.menu.upload',
      name: 'upload',
      type: PermissionType.MENU,
      route: 'Upload',
      component: '/components/upload/index.tsx',
    },
    {
      id: '7749726274771764',
      parentId: '2271615060673773',
      label: 'sys.menu.chart',
      name: 'Chart',
      type: PermissionType.MENU,
      route: 'chart',
      component: '/components/chart/index.tsx',
    },
  ],
};
```

COMPONENTS_PERMISSION 是一个目录类型的权限项，代表组件（Components）。
包含多个子权限项，每个子项都是菜单类型，对应不同的组件路径。

### FUNCTIONS_PERMISSION functions_permission

```typescript
const FUNCTIONS_PERMISSION = {
  id: '8132044808088488',
  parentId: '',
  label: 'sys.menu.functions',
  name: 'functions',
  icon: 'solar:plain-2-bold-duotone',
  type: PermissionType.CATALOGUE,
  route: 'functions',
  order: 4,
  children: [
    {
      id: '3667930780705750',
      parentId: '8132044808088488',
      label: 'sys.menu.clipboard',
      name: 'Clipboard',
      type: PermissionType.MENU,
      route: 'clipboard',
      component: '/functions/clipboard/index.tsx',
    },
  ],
};
```

FUNCTIONS_PERMISSION 是一个目录类型的权限项，代表功能（Functions）。
目前只有一个子权限项 Clipboard，对应相应的组件路径。

### MENU_LEVEL_PERMISSION menu_level_permission 多级菜单

```typescript
const MENU_LEVEL_PERMISSION = {
  id: '0194818428516575',
  parentId: '',
  label: 'sys.menu.menulevel.index',
  name: 'Menu Level',
  icon: 'ic-menulevel',
  type: PermissionType.CATALOGUE,
  route: 'menu-level',
  order: 5,
  children: [
    {
      id: '0144431332471389',
      parentId: '0194818428516575',
      label: 'sys.menu.menulevel.1a',
      name: 'Menu Level 1a',
      type: PermissionType.MENU,
      route: 'menu-level-1a',
      component: '/menu-level/menu-level-1a/index.tsx',
    },
    {
      id: '7572529636800586',
      parentId: '0194818428516575',
      label: 'sys.menu.menulevel.1b.index',
      name: 'Menu Level 1b',
      type: PermissionType.CATALOGUE,
      route: 'menu-level-1b',
      children: [
        {
          id: '3653745576583237',
          parentId: '7572529636800586',
          label: 'sys.menu.menulevel.1b.2a',
          name: 'Menu Level 2a',
          type: PermissionType.MENU,
          route: 'menu-level-2a',
          component: '/menu-level/menu-level-1b/menu-level-2a/index.tsx',
        },
        {
          id: '4873136353891364',
          parentId: '7572529636800586',
          label: 'sys.menu.menulevel.1b.2b.index',
          name: 'Menu Level 2b',
          type: PermissionType.CATALOGUE,
          route: 'menu-level-2b',
          children: [
            {
              id: '4233029726998055',
              parentId: '4873136353891364',
              label: 'sys.menu.menulevel.1b.2b.3a',
              name: 'Menu Level 3a',
              type: PermissionType.MENU,
              route: 'menu-level-3a',
              component: '/menu-level/menu-level-1b/menu-level-2b/menu-level-3a/index.tsx',
            },
            {
              id: '3298034742548454',
              parentId: '4873136353891364',
              label: 'sys.menu.menulevel.1b.2b.3b',
              name: 'Menu Level 3b',
              type: PermissionType.MENU,
              route: 'menu-level-3b',
              component: '/menu-level/menu-level-1b/menu-level-2b/menu-level-3b/index.tsx',
            },
          ],
        },
      ],
    },
  ],
};
```

MENU_LEVEL_PERMISSION 是一个目录类型的权限项，代表多级菜单（Menu Level）。
包含多个层级的子权限项，展示了复杂的层次结构。

### ERRORS_PERMISSION errors_permission 错误页面

```typescript
const ERRORS_PERMISSION = {
  id: '9406067785553476',
  parentId: '',
  label: 'sys.menu.error.index',
  name: 'Error',
  icon: 'bxs:error-alt',
  type: PermissionType.CATALOGUE,
  route: 'error',
  order: 6,
  children: [
    {
      id: '8557056851997154',
      parentId: '9406067785553476',
      label: 'sys.menu.error.403',
      name: '403',
      type: PermissionType.MENU,
      route: '403',
      component: '/sys/error/Page403.tsx',
    },
    {
      id: '5095669208159005',
      parentId: '9406067785553476',
      label: 'sys.menu.error.404',
      name: '404',
      type: PermissionType.MENU,
      route: '404',
      component: '/sys/error/Page404.tsx',
    },
    {
      id: '0225992135973772',
      parentId: '9406067785553476',
      label: 'sys.menu.error.500',
      name: '500',
      type: PermissionType.MENU,
      route: '500',
      component: '/sys/error/Page500.tsx',
    },
  ],
};
```

ERRORS_PERMISSION 是一个目录类型的权限项，代表错误页面（Error）。
包含多个子权限项，对应不同的错误页面组件。

### OTHERS_PERMISSION others_permission

```typescript
const OTHERS_PERMISSION = [
  {
    id: '3981225257359246',
    parentId: '',
    label: 'sys.menu.calendar',
    name: 'Calendar',
    icon: 'solar:calendar-bold-duotone',
    type: PermissionType.MENU,
    route: 'calendar',
    component: '/sys/others/calendar/index.tsx',
  },
  {
    id: '3513985683886393',
    parentId: '',
    label: 'sys.menu.kanban',
    name: 'kanban',
    icon: 'solar:clipboard-bold-duotone',
    type: PermissionType.MENU,
    route: 'kanban',
    component: '/sys/others/kanban/index.tsx',
  },
  {
    id: '5455837930804461',
    parentId: '',
    label: 'sys.menu.disabled',
    name: 'Disabled',
    icon: 'ic_disabled',
    type: PermissionType.MENU,
    route: 'disabled',
    status: BasicStatus.DISABLE,
    component: '/sys/others/calendar/index.tsx',
  },
  {
    id: '7728048658221587',
    parentId: '',
    label: 'sys.menu.label',
    name: 'Label',
    icon: 'ic_label',
    type: PermissionType.MENU,
    route: 'label',
    newFeature: true,
    component: '/sys/others/blank.tsx',
  },
  {
    id: '5733704222120995',
    parentId: '',
    label: 'sys.menu.frame',
    name: 'Frame',
    icon: 'ic_external',
    type: PermissionType.CATALOGUE,
    route: 'frame',
    children: [
      {
        id: '9884486809510480',
        parentId: '5733704222120995',
        label: 'sys.menu.external_link',
        name: 'External Link',
        type: PermissionType.MENU,
        route: 'external_link',
        hideTab: true,
        component: '/sys/others/iframe/external-link.tsx',
        frameSrc: 'https://ant.design/',
      },
      {
        id: '9299640886731819',
        parentId: '5733704222120995',
        label: 'sys.menu.iframe',
        name: 'Iframe',
        type: PermissionType.MENU,
        route: 'frame',
        component: '/sys/others/iframe/index.tsx',
        frameSrc: 'https://ant.design/',
      },
    ],
  },
  {
    id: '0941594969900756',
    parentId: '',
    label: 'sys.menu.blank',
    name: 'Disabled',
    icon: 'ic_blank',
    type: PermissionType.MENU,
    route: 'blank',
    component: '/sys/others/blank.tsx',
  },
];
```

OTHERS_PERMISSION 是一个包含多个独立权限项的数组，这些项不属于特定的目录。
包含各种类型的菜单项，如日历、看板、禁用项等。

## 整体权限和菜单系统的设计理念

在复杂的前端应用中，尤其是涉及到后台管理系统时，通常需要一个灵活的权限和菜单系统。这个系统需要能够描述不同的用户角色、权限，以及基于权限动态生成的菜单结构。

主要考虑因素
层次结构：菜单和权限项通常是嵌套的，形成一个树状结构。比如，一个顶级菜单项下可能有多个子菜单项，每个子菜单项下又可能有更多的子菜单。
灵活性：系统应该能够灵活地定义不同类型的权限项（如目录、菜单），并且可以轻松地增加或修改这些权限项。
可维护性：数据结构应该是可读性强、易于维护和扩展的。
国际化支持：需要支持多语言的菜单项描述。

## 理解 catalogue和menu的含义

catalogue 和 menu 是用于描述权限项类型的术语，在菜单和权限管理系统中有特定的含义：
**这种分类方式在实践中非常常见和标准化。**

**catalogue**：代表一个目录类型的权限项。目录类型通常是没有具体功能的，它们主要用作组织和分组其他菜单项。目录项可以包含子目录和子菜单。代表一个目录或分类，通常包含子菜单或子目录，主要用于组织和分组其他菜单项。它本身通常没有直接的功能或路由，但可以有子级。**通常有 children 属性，包含子级的菜单项或目录**。
**menu**：代表一个菜单类型的权限项。菜单项通常是具体的功能或页面，它们有对应的路由和组件，用户可以通过点击这些菜单项导航到特定的页面。代表一个具体的菜单项，通常是应用的某个功能或页面，直接指向一个路由并关联一个组件，没有子级。**没有 children 属性，是具体的功能项**。

> 这套数据结构只是用于初始化菜单系统的配置数据
> 当涉及到真实的 **Menu** 组件和**路由规则**时，需要通过一个单独的函数将这套数据结构转换为对应的 Menu 组件规则和路由规则。

通过设计一套配置规则数据，可以将数据的定义与组件的实现分离开来。配置规则数据专注于描述菜单和权限的结构，而组件实现则专注于如何展示和使用这些数据。这样可以使代码更清晰、模块化，便于维护和扩展。