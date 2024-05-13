---
title: "根目录下的中第一条workflows是什么？解决什么问题的？"
summary: "我们将使用workflows功能，向当前项目添加一个自动的更新贡献者信息的功能"
date: "2024-05-11"
draft: false
tags:
- workflows
---

1. 首先解释：.github是什么？workflows是什么？ci.yml是什么？
2. 详细了解ci.yml中的每一个内容
3. 基于此上述两个内容，我们将向当前文件中添加一个自动的更新贡献者信息的功能

## .github是什么？workflows是什么？ci.yml是什么？

### .github目录

这个名词是固定的，这是 GitHub 存放特定配置文件的地方。

这是一个特殊的目录，用于存放所有与 GitHub 特定功能相关的配置文件。
这包括 GitHub Actions 工作流配置、issue 模板、pull request 模板 等等

## workflows目录

在 .github 目录下，专门用于存放 GitHub Actions 的工作流配置文件。
这些配置通常是 YAML 格式，主要定义一些自动化步骤，在指定事件被触发时自动执行某些操作

### ci.yml文件

这就是一个工作流配置文件， ci 代表 "Continuous Integration"（持续集成）

## 详细描述 ci.yml 中的内容

```YAML
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-deploy:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install and Build 🔧
        run: |
          pnpm install
          pnpm build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          TOKEN: ${{ secrets.ACCESS_TOKEN }}
          FOLDER: dist
          CLEAN: true
```

### name on push push_request 分别是什么？

name：工作流名称，帮助用户快速识别工作流的目的和功能。

on：指定了触发工作流的事件。在这个上下文中，on 关键字后面列出了哪些 GitHub 事件应该触发这个工作流。

`push: branches: ["main"]`：这段代码指定当有新的代码被推送（push）到 main 分支时，触发 CI 工作流。这是持续集成中最常见的设置，明确列出了哪个分支(main)的推送会触发工作流
`pull_request.branches: ["main"]`：在处理 GitHub 上的拉取请求(Pull Requests)时，触发 CI 工作流。

### jobs build-and-deploy runs-on 分别是什么？

**jobs**：jobs 是 GitHub Actions 工作流中的顶级键，用于定义工作流中包含的一个或多个作业。每个作业包含一系列步骤，这些步骤定义了具体要执行的任务，如代码检出、依赖安装、测试运行、构建应用和部署等。
**build-and-deploy**：是作业的唯一标识符，也是该作业的名称。在 YAML 中，作业的标识符（如 build-and-deploy）直接作为键出现，这是定义作业的必需部分。
**runs-on**：指定作业环境的键，定义了作业应该在哪种类型的虚拟机或容器上执行。 `ubuntu-latest` 指定作业将在 GitHub 提供的最新稳定版本的 Ubuntu 虚拟环境中运行。

> 作业？：build-and-deploy 就是一个作业，你也可以理解为一个工作，其父级名称就是 **jobs**
> 特点就是：每个作业都在一个全新的运行器实例中启动，拥有干净的、隔离的执行环境。这意味着作业之间不会共享环境状态，例如环境变量或文件系统的变化。多个作业可以并行执行，除非它们之间存在明确的依赖关系。作业可以配置为依赖于其他作业的完成。
> 在 GitHub Actions 中，作业（Job） 是构成工作流（Workflow）的基本组成部分。

### strategy matrix node-version 分别是什么？

strategy（策略/战略）：用于指定一个或多个策略这些策略控制如何运行作业。

matrix（矩阵/模型）：是 strategy 下的一个常见策略，允许定义多个不同的配置变量，GitHub Actions会为矩阵中的每个组合创建并运行作业。主要是在多环境下测试应用，确保应用在不同配置或不同高版本的环境中均能正确运行

#### node-version

它指定 Node.js 版本，在这个例子中 `node-version: [16.x]` 指明使用 Node.js 的16.x版本进行构建和测试

数组形式：`[16.x]` 表示这是一个数组，当前只包含一个元素（16.x）。如过失 [14.x, 16.x, 18.x]，这样的话 GitHub Actions 将为这三个 Node.js 版本各自执行一次作业。

指定 Node.js 版本时，16.x 表示使用 Node.js 16 的任何次版本（minor version），也称为“次要”版本。x 代表的是通配符，意味着它会匹配该主版本（major version）下的最新发布的次版本。使用 x 不是必需的，但它是一种常见的做法，它提供了一种确保使用最新兼容次版本的自动方式，无需每次手动更新配置文件。你完全可以直接指定完整的版本号，例如 16.13.0。

> 如果应用需要支持多个node版本，可以进行扩展，GitHub Action 会自动为每个版本运行相同的构建和测试脚本，确保应用和这些版本是兼容的。
> tip：对于大多数前端开源项目，不需要为多个Node.js本不能构建和测试，一种常见的做法是选择一个活跃维护状态的LTS版本。就当前项目而言构建工具依赖于Vite应该参考 [Node 支持 Node.js 18 / 20+ ](https://cn.vitejs.dev/guide/migration.html#nodejs-support)

### steps步骤

```YAML
 steps:
   - name: Checkout 🛎️
     uses: actions/checkout@v3

   - name: Setup pnpm
     uses: pnpm/action-setup@v2
     with:
       version: 8
```

**Checkout**：这一行提供了步骤的描述性名称，这里使用 "Checkout 🛎️" 来说明这个步骤的作用是检出（Checkout）代码
**uses: actions/checkout@v3**：关键字指定了要在此步骤中使用的动作（Action）。这里使用的是官方提供的 actions/checkout 动作，版本为 3。用于检出仓库中的代码，使其可在后续步骤中使用，例如构建或测试。这是大多数工作流中的第一步，后续操作通常需要访问这些仓库代码。就当前写这篇文章的时间来看， `actions/checkout@v3` 应该升级到v4，actions/checkout@v3 action在后台使用了node 16，这被github弃用了。Node16于2023年9月11日终止生命周期。v4运行环境为node20

**Setup pnpm**：描述性名称，这一步骤用于设置 pnpm 包管理器。这是一个由社区或第三方开发的 GitHub Action，专门用于在 GitHub Actions 的运行环境中安装和设置 pnpm（Performant npm），一个流行的 Node.js 包管理器。

### pnpm是什么? npm是什么？yargs又是什么？

`pnpm` 是一种用于 Node.js 的包管理器，它类似于 npm 和 yarn，用于自动化管理项目的依赖项。pnpm 的核心特性是高效地管理节点模块，从而优化了存储空间和加快了依赖项的安装速度。它通过使用硬链接（hard links）和符号链接（symlinks）来共享一个版本的模块多次使用而不是重复下载，从而达到节省空间的效果。
`npm` 是 Node.js 的官方包管理器，广泛使用于 JavaScript 生态中。它易于使用，支持广泛，并直接集成在 Node.js 安装包中。
`yarn` 是由Facebook提供的包管理工具，旨在提高性能和安全性。

就当前时间节点的社区下载量看，pnpm下载量是npm的2倍，也是yarn的2倍。

社区的开源项目，都在向新的node版本转移，就当前项目的自动化构建和部署

pnpm: https://github.com/pnpm/pnpm/releases/tag/v9.0.0

```YAML
- name: Setup Node.js ${{ matrix.node-version }}
 uses: actions/setup-node@v3
 with:
   node-version: ${{ matrix.node-version }}
   cache: 'pnpm'
```

`name: Setup Node.js ${{ matrix.node-version }}`：指定了一个名称，显示在 GitHub Actions 的执行日志中。这里使用了表达式 ${{ matrix.node-version }} 来动态显示使用的 Node.js 版本，这个版本是通过策略矩阵（strategy matrix）指定的。例如，如果矩阵中指定了版本 16.x，步骤名称将显示为 “Setup Node.js 16.x”。

`uses: actions/setup-node@v3`：指令用来指定 GitHub Action。在这里，它使用了 setup-node Action 的第三版（v3），这是一个官方提供的用于安装 Node.js 的 Action。

`node-version: ${{ matrix.node-version }}`：这条指令设置 Action 要安装的 Node.js 的版本。这里同样使用了 ${{ matrix.node-version }}，它会从工作流的策略矩阵中取得 Node.js 的版本。

`cache: 'pnpm'`：这条指令启用缓存，用于加速后续的包管理操作。在这个配置中，它设置为使用 pnpm 的缓存机制。这意味着 GitHub Actions 将会缓存 pnpm 的依赖文件，以便在后续的运行中重用，减少安装依赖所需的时间。

```YAML
- name: Install and Build 🔧
  run: |
    pnpm install
    pnpm build
```

> 这段代码是 GitHub Actions 工作流中的一个步骤（step），用于在设置好的 Node.js 环境中执行 pnpm 命令来安装依赖并构建项目。

`run` 指令用于执行命令行操作。它可以执行单个命令或多行命令。在这里，它通过 | 符号引入了一个命令块，允许多个命令顺序执行。
`pnpm install`：这个命令用于安装项目的依赖。pnpm 是一个包管理器，类似于 npm 和 yarn，但它以一种更高效的方式处理依赖和磁盘空间。这一步确保所有在项目的 package.json 文件中声明的依赖项都被安装到虚拟环境中。
`pnpm build`：这个命令通常用于执行项目的构建脚本，这在 package.json 文件中的 scripts 部分定义。构建过程可能包括编译代码、压缩资源、打包等，具体取决于项目的具体配置和需求。

> 此步骤是许多 CI/CD 流程中的核心部分

```YAML
- name: Deploy 🚀
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    TOKEN: ${{ secrets.ACCESS_TOKEN }}
    FOLDER: dist
    CLEAN: true
```

> 代码配置了 GitHub Actions 工作流中的一个部署步骤，专门用来将项目部署到 GitHub Pages。这里使用的是 James Ives 开发的 github-pages-deploy-action。

`name: Deploy 🚀`：此行定义了步骤的名称，"Deploy"，配以一个火箭 emoji 🚀，表示这个步骤是将项目部署到服务器或云环境。
`uses: JamesIves/github-pages-deploy-action@v4`：使用 uses 关键词来引入外部的 GitHub Action。这里指定的是 James Ives 的 github-pages-deploy-action，版本号为 v4。
这个 Action 封装了将代码部署到 GitHub Pages 的过程，包括处理文件上传、历史版本控制等，简化了部署步骤。
`with`：关键词用来定义传递给 Action 的参数。
`TOKEN: ${{ secrets.ACCESS_TOKEN }}`：TOKEN 参数需要一个访问令牌，这里使用 secrets.ACCESS_TOKEN。这是一个在 GitHub 仓库设置的密钥，用于授权这个 Action 访问你的 GitHub 仓库。这样的设置增强了安全性，确保敏感数据不在配置文件中硬编码。
`FOLDER: dist`：指定要部署的文件夹，这里是 dist。通常这个文件夹包含了构建过程生成的所有静态文件，这些是要被上传到 GitHub Pages 的内容。
`CLEAN: true`：启用清理选项。当设置为 true 时，这个 Action 会在部署前清除旧的文件，确保只有最新的构建输出被发布。这有助于避免旧文件积累或可能的冲突。

> 这个部署步骤是自动化流程的关键环节，允许开发者将静态网站或文档自动部署到 GitHub Pages。

#### ACCESS_TOKEN是什么？GITHUB_TOKEN是什么？那么他们是否可以互相替换？

`ACCESS_TOKEN` 通常指的是一个个人访问令牌（Personal Access Token, PAT）。这种令牌由用户手动在 GitHub 中创建，并可以具有广泛的权限，从而让持有者可以进行各种操作，比如访问私有仓库、写入仓库、管理组织和项目等。
`GITHUB_TOKEN` 是自动由 GitHub Actions 生成的，用于授权在当前仓库中进行操作的内置令牌。每次工作流运行时，GitHub 都会自动创建一个新的 GITHUB_TOKEN，并在运行结束后使其失效。

在大多数常规的部署场景中，GITHUB_TOKEN 是足够的，特别是**当操作限于当前仓库时**。如果你的部署任务（例如部署到 GitHub Pages）不需要跨仓库或其他高级权限，可以使用 GITHUB_TOKEN。