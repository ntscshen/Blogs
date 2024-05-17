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

## 我们来实现一个， 在github中根据PR的提交信息来自动化添加贡献者的功能，通过all-contributors

```yml
on:
  pull_request_target:
    branches:
      - main
    types: [closed]  # 仅在合并后触发
```

pull_request_target 是什么？ pull_request 又是什么？ 有什么区别？

它们的定义和触发条件都是一致的：在创建、更新、重新打开或关闭拉取请求（PR）时触发。当有人向你的仓库提出拉取请求时，或更新了现有的拉取请求时。
pull_request

1. 在默认情况下，是无法访问 GitHub Secrets。目的是为了防止潜在的恶意代码泄露机密信息
2. 运行在拉取请求的源代码分支上（即外部贡献者的分支上）。

pull_request_target

1. 可以访问 GitHub Secrets，因为运行的代码是能仓库中受信任的代码(主分支)
2. 运行在拉取请求的目标分支上（通常是你的主分支或其他目标分支）。虽然运行的是目标分支的代码，但同时也可以获取到 PR 的上下文信息。

根据操作需求选择 pull_request 或 pull_request_target。

1. 使用 pull_request 进行代码验证和测试，确保不访问机密信息。
2. 使用 pull_request_target 进行需要机密信息的操作，如推送、部署等。

> 根据当前子标题，看出来我们的需求是，当仓库收到PR时候，action 或监听到并且找到PR的提交者信息和提交的类型，在通过 all-contributors 工具
> 去自动生成一些信息，让后自动将信息提交到主分支，让后push到仓库中。
> 这些就需要用到 `pul_request_target` 事件，因为在这个自动化流程中需要访问 `SUCCESS_TOKEN`来自动将生成的新的代码提交到主分支。

```yml
jobs:
  test-pat:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }} # 确保使用PR的最新提交的内容和commit

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install

      - name: Echo Token Length  # 添加一个步骤来检查 token 长度
        run: echo "Token Length is ${#PERSONAL_ACCESS_TOKEN}"
        env:
          PERSONAL_ACCESS_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          
      - name: Setup Git
        run: |
          git config --global user.email "ntscshen@163.com"
          git config --global user.name "ntscshen"
          git remote set-url origin https://x-access-token:${{ secrets.PERSONAL_ACCESS_TOKEN }}@github.com/ntscshen/pr_test.git
        env:
          PERSONAL_ACCESS_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}

      - name: Switch to main branch and pull latest
        run: |
          git fetch --all
          git checkout -f main
          git pull origin main

      - name: Add Contributor
        run: |
          export GITHUB_ACTOR=${{ github.event.pull_request.user.login }}
          node scripts/updateContributors.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_ACTOR: ${{ github.event.pull_request.user.login }}  # 使用PR创建者的用户名

      - name: Push changes to remote
        run: git push origin main
        env:
          PERSONAL_ACCESS_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          
```

`github.event.pull_request.head.sha` 这是PR创建者在其分支上做的最后一次提交，通常用于合并前的各种检查。
当PR被接受并合并到目标分支(如`main`)时，通常会生成一个新的"合并提交"。 `github.event.pull_request.head.sha` 不包括这个合并操作产生的提交。

当工作流由 `pull_request_target` 事件触发时，默认情况下 actions/checkout 会检出一个虚拟的 **merge commit**，这是 `GitHub` 动态创建的。当PR被接受并合并进目标分支，这个虚拟commit会包含这次合并的commit。当使用 **actions/checkout** 而没有指定 **ref** 时，检出的是虚拟合并分支的状态，这个状态包含所有的PR相关的commit信息。

为什么要指定ref：精准控制检出内容，有时候可能需要确保工作流使用的PR的确切内容，在这些情况下，通过明确指定 **ref** 参数可以确保检出的是我们确切希望的代码状态。

### step步骤如下

1. actions/checkout@4
  检出PR分支的代码，确保工作流最新提交的内容上运行， `ref: ${{ github.event.pull_request.head.sha }}` 确保检出的代码是PR中最新的提交
2. pnpm/action-setup@v4
  设置 `pnpm` 包管理并指定版本9
3. actions/setup-node@v4
  设置 Node.js 环境，并启用 pnpm 缓存
4. pnpm install：安装项目的依赖项
5. echo "Token Length is ${#PERSONAL_ACCESS_TOKEN}" 用于验证token的有效性
    在 `pull_request` 当前值为0，在 `pull_request_target` 当前值为40或>0
6. Setup Git
    配置 **Git** 用户信息，设置远程仓库的URL地址，使用 `PERSONAL_ACCESS_TOKEN` 进行身份验证
   `git config --global user.email "ntscshen@163.com"`
   `git config --global user.name "ntscshen"`
   `git remote set-url origin https://x-access-token:${{ secrets.PERSONAL_ACCESS_TOKEN }}@github.com/ntscshen/pr_test.git`
   使用 PERSONAL_ACCESS_TOKEN 代替用户名和密码进行身份验证。这对于 GitHub Actions 工作流中的自动化操作是必要的，因为你不能在工作流中手动输入用户名和密码。
7. Switch to main branch add pull latest
    切换主分支并拉取最新代码
    1. 获取所有分支的最新更新
    2. 强制切换到主分支
    3. 从远程主分支拉取最新的代码
8. Add Contributor：根据PR创建者的信息，运行脚本更新贡献者列表
9. git push origin main：将更改推送到远程分支
  
### node scripts/updateContributors.js

```javascript
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

const typeMap = {
  feat: 'code',
  style: 'code',
  refactor: 'code',
  perf: 'code',
  revert: 'code',
  types: 'code',
  wip: 'code',
  chore: 'tool',
  build: 'tool',
  ci: 'tool',
  test: 'test',
  fix: 'bug',
  docs: 'doc',
};

function updateContributors(username, type) {
  const content = fs.readFileSync('.all-contributorsrc', 'utf-8');
  const contributors = JSON.parse(content);
  
  console.log('contributors: ', contributors);
  console.log('username', username);
  console.log('type: ', type);
  // 检查用户是否已存在
  const exists = contributors.contributors.some((contributor) => contributor.login === username);
  if (!exists) {
    console.log(`Adding new contributor: ${username}`);
    const command = `npx all-contributors-cli add ${username} ${type}`;
    console.log(`Running command: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log('成功添加贡献者.');
    
    // Generate the contributors list after adding a new contributor
    console.log('生成贡献者名单...');
    const generateCommand = 'npx all-contributors-cli generate';
    console.log(`Running command: ${generateCommand}`);
    execSync(generateCommand, { stdio: 'inherit' });
    console.log('贡献者名单已更新.');


    
      // 阅读更新后的 README.md 内容
      const readmeContent = fs.readFileSync('README.md', 'utf-8');

      // 提取贡献者徽章部分
      const badgeStartMarker = '<!-- ALL-CONTRIBUTORS-BADGE:START -->';
      const badgeEndMarker = '<!-- ALL-CONTRIBUTORS-BADGE:END -->';
      const badgeStartIndex = readmeContent.indexOf(badgeStartMarker);
      const badgeEndIndex = readmeContent.indexOf(badgeEndMarker) + badgeEndMarker.length;
      const contributorsBadgeSection = readmeContent.substring(badgeStartIndex, badgeEndIndex);

      // 提取撰稿人名单部分
      const listStartMarker = '<!-- ALL-CONTRIBUTORS-LIST:START -->';
      const listEndMarker = '<!-- ALL-CONTRIBUTORS-LIST:END -->';
      const listStartIndex = readmeContent.indexOf(listStartMarker);
      const listEndIndex = readmeContent.indexOf(listEndMarker) + listEndMarker.length;
      const contributorsListSection = readmeContent.substring(listStartIndex, listEndIndex);

      // 阅读 README.zh-CN.md 内容
      let readmeZhCnContent = fs.readFileSync('README.zh-CN.md', 'utf-8');

      // 删除 README.zh-CN.md 中现有的贡献者徽章部分
      const existingBadgeStartIndex = readmeZhCnContent.indexOf(badgeStartMarker);
      const existingBadgeEndIndex = readmeZhCnContent.indexOf(badgeEndMarker) + badgeEndMarker.length;
      if (existingBadgeStartIndex !== -1 && existingBadgeEndIndex !== -1) {
        readmeZhCnContent = readmeZhCnContent.slice(0, existingBadgeStartIndex) + readmeZhCnContent.slice(existingBadgeEndIndex);
      }

      // 在 README.zh-CN.md 中插入翻译好的贡献者徽章部分
      readmeZhCnContent = readmeZhCnContent.slice(0, existingBadgeStartIndex) + contributorsBadgeSection + readmeZhCnContent.slice(existingBadgeStartIndex);

      // 删除 README.zh-CN.md 中现有的贡献者列表部分
      const existingListStartIndex = readmeZhCnContent.indexOf(listStartMarker);
      const existingListEndIndex = readmeZhCnContent.indexOf(listEndMarker) + listEndMarker.length;
      if (existingListStartIndex !== -1 && existingListEndIndex !== -1) {
        readmeZhCnContent = readmeZhCnContent.slice(0, existingListStartIndex) + readmeZhCnContent.slice(existingListEndIndex);
      }

      // 在 README.zh-CN.md 中插入已翻译的贡献者名单部分
      readmeZhCnContent = readmeZhCnContent.slice(0, existingListStartIndex) + contributorsListSection + readmeZhCnContent.slice(existingListStartIndex);

      // 将更新内容写入 README.zh-CN.md
      fs.writeFileSync('README.zh-CN.md', readmeZhCnContent);

    
  } else {
    console.log('已存在贡献者，跳过...');
  }
}

function main() {
  const username = process.env.GITHUB_ACTOR;
  
  console.log('fix: 111updateContribcutors.js - GITHUB_ACTOR :>> ', username);
  if (!username) {
    console.error('未定义 GITHUB_ACTOR。.');
    process.exit(1);
  }
  
  const lastCommitMessage = execSync('git log -1 --pretty=%B').toString().trim();
  const commitType = lastCommitMessage.split(' ')[0];
  const contributionType = typeMap[commitType] || 'code';
  
  updateContributors(username, contributionType);
  
  // 检查文件状态
  const checkFileStatus = (filePath) => {
    const status = execSync(`git status --porcelain ${filePath}`).toString().trim();
    console.log(`${filePath} status: ${status}`);
    return status;
  };

  const allContributorsrcStatus = checkFileStatus('.all-contributorsrc');
  const readmeStatus = checkFileStatus('README.md');
  
  // 检查 git status 以确认有变更
  const changes = execSync('git status --porcelain').toString().trim();
  console.log('Git changes:', changes);
  if (changes) {
    console.log('检测到更改，继续提交.');
  } else {
    console.log('未检测到更改，跳过提交.');
  }
}

main();

```

1. 获取PR作者信息、获取commit信息(commitType)
2. 更新**contributors**列表
   1. 判断当前PR用户是不是之前就存在在列表中的，如果是则不需要做任何更新
   2. 如果不是则触发列表更新
      1. `npx all-contributors-cli add ${username} ${type}`
      2. `npx all-contributors-cli generate`
   3. `all-contributors` 只会更新 **README.md** 文件，但是我们文档中还有 `README.zh-CN.md` 文件
   4. 所以需要将对应的中文文档也进行更新
