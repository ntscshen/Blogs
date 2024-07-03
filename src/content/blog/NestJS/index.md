---
title: "NestJS(1)初始启动"
summary: "NestJS 理解整体框架"
date: "2024-04-30"
draft: false
tags:
- NestJS
---

在理解架构之前，先详细过一遍官方默认打开的基础案例，理解了每一行代码之后，再去描述架构

## 基础案例

### main.ts

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

1. 首先导入`NestFactory`类，当前类名语义化很明确，是 `NestJS` 中用来创建应用实例的工厂类，大白话说就是用来专门生成NestJS应用的工厂。
2. 其次导入`AppModule`类，当前类名语义化依旧很明确，是整个应用的根模块，是整个 `NestJS` 架构的核心入口模块。
3. 最后，调用 `bootstrap` 函数，在软件开发语境中 `bootstrap` 通常被翻译为启动。
   1. 调用 `NestFactory.create(AppModule)` 函数创建一个应用实例，这是启动的第一步，负责配置根模块和整个应用的依赖关系。
   2. 调用 `app.listen(3000)` 监听3000端口

> tip: `bootstrap` 这个词源自短语 "pull oneself up by one's bootstraps"，意指依靠自己的力量改善自己的情况或完成某些困难的任务。这个短语形象地描述了一个看似不可能的行为——一个人试图通过拉动自己的靴带来把自己举起来。

### app.module.ts

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

AppModule 通常是应用的根模块，主入口模块。这个模块快通过组织和协调应用中的各个部分来设置应用的整体结构

1. `import { Module } from '@nestjs/common';` 从官方包中导入Module函数，这是一个非常关键的函数，它用于定义和组织应用程序的模块。当前函数会通过装饰器的形式将导出的AppModule类标记为模块。至于如何转化为模块的暂时放一边，暂时先记住用NestJS就必须将类转换成模块，转换成模块的方式就是使用在当前类上添加 `@Module()`，这东西`@Module()` 是TS提供的一种特性(装饰器)。至于原理下一篇文章会进行详细阐述
2. `@Module()`装饰器是必须的，并且它需要接收一些参数来定义模块的结构和行为。这些参数在NestJS中非常关键，因为它们指定了模块如何与其他模块协同工作。这些参数又被称为"元数据"，因为这些参数和当前的类有着非常重要关联关系，可以理解为关于`AppModule`类的额外数据信息，元数据不仅描述了类的结构，还指定了类的行为。所以，我们可以将提供给类、方法或属性的这些额外信息视为元数据。

## imports、controllers、providers 这三个元数据分别是什么？解决什么问题？为什么要怎么加？

imports 导入其他模块，
controllers 是每个模块最核心的部分，它主要控制某个路由，从请求到响应的过程，决定当前的控制器响应什么样的路由，并且决定用户的请求经过了控制器这一步，如何转换为一个响应包。
  声明当前模块的控制器，用于处理传入的 HTTP 请求，解析这些请求并响应给客户端
  解决的问题1：请求的处理，控制器负责路由和处理 HTTP 请求，调用相应的服务方法，并返回响应
  解决的问题2：组织路由逻辑，通过控制器，可以将不同的路由逻辑分离到不同的类中，保持代码的整洁和可维护性
providers 提供者，这是NestJS中的一个基本概念，在语义上指的是"提供服务或功能的实体"，可以理解为现实里面的企业外包 - 这些公司的简称里面都有一行描述叫做"解决方案与服务提供商"，这里的提供商和我们的提供者，是一个意思
    在NestJS中，提供者通常是一个服务类（比如: AppServer, UserServer, AuthServer, TokenServer等等），这里面包含的是具体的业务逻辑，我们的controller控制器通常只做两件事情，监听HTTP请求，然后返回NestJS处理完的数据，这中间的业务逻辑通常不在 controller中添加，一般都写在对应的 server中。
<!-- 解决方案与服务提供商 -->
控制器和提供者，是一个依赖和被依赖的关系。


依赖注入机制：
你可以补充说明一下 NestJS 中的依赖注入机制，这个机制是如何使得控制器和服务之间的依赖关系得以解耦的。例如：
在 NestJS 中，提供者通过依赖注入机制在需要使用它们的地方被实例化和注入。依赖注入使得我们的控制器和服务类之间的依赖关系得以解耦，提高了代码的可维护性和可测试性。