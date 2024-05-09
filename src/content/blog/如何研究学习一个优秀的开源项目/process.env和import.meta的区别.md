---
title: "process.env和import.meta的区别"
summary: "在前端应用开发中，如何简单并安全的使用环境变量？"
date: "2024-05-07"
draft: false
tags:
- webpack
- Vite
---

## 为什么要使用 import.meta? 和 process.env有什么关系？

process.env 是 Node.js 中访问环境变量的标准方式，直接与操作系统的环境变量进行交互。

假设你正在开发一个 Web 应用，该应用需要根据不同的部署环境连接到不同的 API 服务器。
例如，你可能在开发环境中使用本地服务器，而在生产环境中使用托管的远程服务器。传统的方法可能会使用 `process.env` 来在运行时解析这些环境变量。
实际上 `process.env` 的使用是通过前端构建工具(如Webpack)实现的，这些工具在构建应用时候将特定的环境变量嵌入到最终的前端代码中。

这两个都是为了解决环境变量而存在的技术，那么环境变量到底在前端开发应用中最主要解决什么问题？

1. 最主要的是**配置管理**：使得开发者能够在不同的环境（如开发、测试、生产）之间切换配置而无需改动代码。这包括API端点、数据库连接字符串、第三方服务的密钥等，从而实现了配置与代码的分离。
2. 次要的是**条件逻辑**：环境变量允许开发者在应用代码中根据当前环境执行不同的逻辑。例如，可以根据环境变量来启用或禁用某些功能，调整日志级别，或者修改错误报告的行为。

### 详细描述一下传统方式的 `process.env` 是如何在前端应用中工作的

- 在前端开发中，构建工具（如 Webpack、Parcel 等）。它们在构建阶段读取环境变量，并将这些变量的值替换到打包后的代码中。
- 这通常是通过插件或配置来实现的。例如，Webpack 使用 DefinePlugin 来定义全局常量。在这个插件中，开发者可以指定将特定的 process.env 变量（或其他全局变量）嵌入到最终的 JavaScript 文件中。

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    })
  ]
};
```

- 在这个示例中，process.env.API_URL 的值（从 Node.js 环境变量中获取）将在构建时被转换为一个字符串，并直接插入到打包后的代码中。在浏览器中运行时，process.env.API_URL 实际上是一个已经被替换的常量字符串。
- 当构建你的应用时，构建工具查看你的代码，找到所有 process.env.XXX 的引用，并将它们替换为在构建时定义的实际值。这意味着这些环境变量的值是固定的，并在用户的浏览器中不会变化。

> 这种方式，`webpack + process.env` 在管理非敏感的配置方面完全可以满足现代前端开发的需求。特别是对于管理不同开发阶段的配置(开发、测试、生成环境的API)非常有效。对于许多现有项目来说这已经成为了标准实践。

### 在更现代的构建工具中(Vite或Snowpack)，将利用 `import.meta.env` 技术实现类似功能，下面将详细描述和对比和传统方式的区别

这两种方式，肯定是新技术有更多优势。我们先说一下这些东西在代码中一般如何用

```javascript
// 传统方式
const apiUrl = process.env.API_URL;
console.log('API URL:', apiUrl);
```

```javascript
// 现代方式
const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);
```

你可以发现在用法上本质上没啥区别，从前端代码看就是换了个变量。但在再这个背后，新方法有一些功能性增强

1. 最直观的好处就是**配置简化**，Vite内置了这个功能，你只需要在 .env 文件中上添加以 VITE_ 为前缀的变量即可。而webpack中你单独配置插件
2. **安全**(比传统方式)：在Vite默认环境下必须以 **VITE_** 开头的环境变量才会被注入到 `import.meta.env` 中（确保这些是开发者明确需要注入的环境变量），在Vite编译过程中所有存在 `import.meta.env` 的地方都会被替换成硬编码，替换进行前端代码中，在线上的前端应用中，import.meta 中是不存在一个叫做 env 的属性或对象的。这就确保了客户端不会保持任何环境变量的内容，而传统方式则是将 process.env 注入到前端代码的全局变了中，在运行过程中去动态判断。
3. 最后也是及重要也不重要的，就是模块化标准：这是一种思维和管理方式，在日常开发中，模块化标准的细节看起来是不重要的，但这是JS语言本身的标准方案，对开发者而言，理解和遵循这些方案有助于多人协作和提升代码质量

### 注入方式

两种环境变量处理方式在技术实现上本质上都是在编译时期将变量值硬编码到输出的代码中，但在如何访问这些变量上存在一些差异。一个使用 process.env 一个使用 import.meta.env

  1. 在webpack中通过插件将环境变量从 .env 文件读取出来，赋值给前端的全局变量中的 process.env.xx ，这个过程是将环境变量的值全局替换到了生成的js代码中
  2. Vite在编译阶段也是将环境变量处理成硬编码的字符串，不过这些变量是作为 import.meta.env 对象的属性提供。这东西(import.meta对象)本身是ECMAScript标准中定义的一个接口， env 是Vite特有的扩展， import.meta.env 在每个模块中都可以被访问，并且引用的都是相同的全局对象，每个模块获取的环境信息是一致的。

#### import.meta的模块特性，import.meta.env是什么？

import.meta 是 ECMAScript 规范定义的一个特性，旨在为 JavaScript 模块提供特定的元信息。每个模块都有其自己的 import.meta 对象，这意味着 import.meta 的某些属性，如 url，是特定于每个模块的。

虽然 import.meta 本身是模块级别的，但是import.meta.env 这里的env是 Vite 构建工具在编译文件的时候生成的。那么它是如何添加进去的，步骤如下：

1. 读取环境变量：在构建开始时，Vite 会从项目的环境配置文件（如 .env、.env.production、.env.development 等）读取环境变量。
2. 预处理：Vite 处理这些环境变量，确保所有以 VITE_ 前缀的变量被包括在内，并创建一个统一的环境变量对象。
3. 编译时注入：在编译各个模块的代码时，Vite 会向每个模块的 import.meta 对象注入 env 属性。这意味着无论项目中有多少模块，每个模块的 import.meta.env 都被设置为相同的环境变量对象。
4. 全局一致性：尽管每个模块的 import.meta 是独立的，import.meta.env 中的内容对所有模块而言是一致的。这是因为它在构建时已被解析和固定，所以在应用的不同部分可以一致地访问相同的环境变量。

#### .env .env.development .env.production 这三个文件是什么？

**.env**：这是主环境变量文件，通常用于存储所有环境通用的配置。它被视为环境配置的基础，通常包含那些在开发、测试、生产等各个环境中都不变的变量。
**.env.development**：这个文件专门用于开发环境。当你在开发模式下启动 Vite，Vite 会自动读取这个文件。如果这个文件中的变量与 .env 文件中的变量重名，.env.development 文件中的设置会覆盖 .env 中的相应设置。
**.env.production**：这个文件用于生产环境。当你构建生产版本的应用（通常是通过 vite build 命令）时，Vite 会读取这个文件。同样，如果有重名变量，.env.production 中的配置会覆盖 .env 文件中的设置。

> 文件名不是随意的，而是按照 Vite 的规定格式来命名。通常包括 .env（基本设置），.env.development（开发环境特定设置），.env.production（生产环境特定设置）
> 默认读取：Vite 默认会读取 .env 文件和与当前环境对应的 .env.{mode} 文件。这里的 {mode} 取决于你的启动命令或构建命令，比如 development 或 production。你可以通过 Vite 的配置文件（vite.config.js）来自定义环境模式。
