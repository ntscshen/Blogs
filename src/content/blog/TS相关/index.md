---
title: "prune-admin项目中的TS类型"
summary: "研究学习prune-admin项目中的TS类型"
date: "2024-05-08"
draft: false
tags:
- TypeScript
---



## 项目中通用的TS类型解析

在项目目录的types文件夹中，存放TypeScript的类型定义文件

> 有四组文件，分别为 `api.ts`, `entity.ts`, `enum.ts`, `router.ts` 下面将一一进行解析

## 文件1：api.ts

```javascript
export interface Result<T = any> {
    status: number;
    message: string;
    data?: T;
}
```

该文件定义了一个通用接口 `Result<T>` ，用于封装API响应的结构，当前接口包括三个属性：

- `status`： 数字类型，代表响应的状态码
- `message`： 字符串类型，代表响应的消息内容
- `data`： 泛型 `T`，可选，代表响应中包含的数据

这种结构通常用于前端应用中处理不同类型的数据响应，保持API调用的统一和可预测。对于当前`Result`举3个实际例子，以加深印象

```javascript
// 使用 Result 泛型接口示例1 - 用户信息
interface User {
    id: number;
    name: string;
}
const result: Result<User> = {
    status: 200,
    message: '成功获取用户数据',
    data: { id: 1, name: 'Alice' }
}
```

```javascript
// 使用 Result 泛型接口示例2 - 产品列表
interface Product {
    productId: number;
    productName: string;
    price: number;
}
const productsResult: Result<Product[]> = {
    status: 200,
    message: '成功获取产品列表',
    data: [
        { productId: 101, productName: '电脑', price: 10000 }
        { productId: 102, productName: '手机', price: 5000 }
    ]
}
```

```javascript
// 使用 Result 泛型接口示例3 - 操作结果(有些接口结果不需要具体数据，只需要状态和消息)

const operationResult: Result<null> = {
    status: 200,
    message: '操作成功完成',
    data: null
}
```

这三个例子完美展示了泛型接口 `Result<T>` 在不同情况下的应用，提供了丰富的类型支持和灵活性。

#### 上面3个例子我们完全可以写成三个更简单的接口类型。如下

```javascript
export interface Result1 {
    status: number;
    message: string;
    data?: {
        id: number;
        name: string;
    };
}
```

```javascript
export interface Result2 {
    status: number;
    message: string;
    data?: {
        productId: number;
        productName: string;
        price: number;
    }
}
```

```javascript
interface Product {
    productId: number;
    productName: string;
    price: number;
}
export interface Result3 {
    status: number;
    message: string;
    data?: Product[]
}
```

如果是有经验的开发者，会本能会想将这三个东西通过某种方式进行封装和抽象。因为这三个interface除了data不一样其他是一致的。
那么就回到了前面的**Result**接口中了。把多个接口中的共同部分抽取出来形成一个更通用的模板。然后根据不同的需求，传递不同的类型参数给这个泛型模板，以适应各种具体的场景。

```javascript
export interface Result<T = any> {
    status: number;
    message: string;
    data?: T;
}
```

> 这个就是type文件夹下的 `api.ts` 文件中的 **Result** 泛型接口

## 文件2：enum.ts

枚举（Enums）是一种特殊的数据类型，它允许为一组相关的值定义一个友好的名字。
从实际开发角度看，这东西主要是为了解决**硬编码字符串或数字常量**容易出错的问题，在正常的开发团队中魔法数字和字符串不应该出现在代码中，而是应该被被聚合起来通过语义化的方式进行划分，以方便后期维护和理解。

通常来说在没有使用ts的项目中，会将这些值通过**定义常量对象的方式**存储在某个预先定义好的文件中。在现代化项目中使用了ts之后，默认使用ts中的枚举(enum)。
这个枚举很有意思，它既可以用作值(像变量一样直接使用)，也可以作为类型(ts中类型校验)。也就是说你可以把他当做旧项目中的常量对象的增强版来使用。
除了具有const变量所具备的能力外，还具备一些更强大的能力，有如下几个：

### 第一条，它可以作为类型去使用

```javascript
enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
}

let myColor: Color; // 声明一个类型为 Color 的变量
myColor = Color.Green; // 正确
myColor = "yellow"; // 错误，TypeScript 会提示类型错误
```

#### 第二条，枚举可以反向映射

```javascript
enum StatusCode {
    OK = 200,
    NotFound = 404,
    BadRequest = 400
}

// 可以通过枚举值反查到名称
console.log(StatusCode[200]); // 输出 "OK"
```

#### 第三条，提供了更强的类型安全，在大型项目中尤其重要

```javascript
enum Color {
    Red,
    Green,
    Blue
}

function setColor(color: Color) {
    // 只接受 Color 枚举类型的参数
}
setColor(Color.Red); // 正确
setColor('Red');     // 错误，类型 '"Red"' 的参数不能赋给类型 'Color' 的参数。
```

#### 第四条，命名空间/清晰度/工具广泛支持

枚举本身作为一个命名空间存在，枚举的所有成员都被封装在一个明确定义的作用域内。在TS生态中，枚举类型可以得到很好的支持。
enum在编译成js时，通常会被转换成一个**立即执行的函数表达式**（IIFE），这种方式用于创建局部作用域以避免变量污染全局命名空间。

```javascript
enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue'
}
```

```javascript
var Color;
(function (Color) {
    Color["Red"] = "red";
    Color["Green"] = "green";
    Color["Blue"] = "blue";
})(Color || (Color = {}));
```

> 通常来说，在实际的业务开发中，我们会将枚举（enum）视为一种语义化的全局对象来使用

### 当前文件中(enum.ts)，定义了多个枚举类型

包括 `BasicStatus`, `ResultEnum`, `StorageEnum`, `StorageEnum`, `ThemeMode`, `ThemeLayout`, `ThemeColorPresets`, `LocalEnum`, `MultiTabOperation`，下面将每一个接口都进行描述

```javascript
// 这个枚举定义了基本的状态值，通常用于开关状态或激活状态的表示。
// 当 Enum 的成员的名称和值相同时，可以使用简写形式来定义。可以用 DISABLE 和 ENABLE 作为 Enum 的成员名称和值，而不需要重复书写。
export enum BasicStatus {
    DISABLE, // disable 被禁用或非激活态
    ENABLE // enable 被启用或激活态
}
```

```javascript
// 定义操作结果的状态
export enum ResultEnum {
    SUCCESS = 0,
    ERROR = -1,
    TIMEOUT = 401, // 超时，通常用于身份验证或会话超时
}
```

```javascript
// 定义了本地存储中用于保存的关键数据项的键名
export enum StorageEnum {
    User = 'user',
    Token = 'token', // 用于存储认证令牌
    Settings = 'settings', // 用于存储用户设置
    I18N = 'i18nextLng' // 用于存储国际化设置
}

```

```javascript
// 定义了应用的主题模式
export enum ThemeMode {
    Light = 'light', // 浅色模式
    Dark = 'dark', // 深色模式
}
```

```javascript
// 定义了应用布局的样式。
export enum ThemeLayout {
    Vertical = 'vertical', // 垂直布局
    Horizontal = 'horizontal', // 水平布局
    Mini = 'mini'
}
```

```javascript
// 定义了预设的主题颜色
export enum ThemeColorPresets {
    Default = 'default',
    Cyan = 'cyan',
    Purple = 'purple',
    Blue = 'blue',
    Orange = 'orange',
    Red = 'red',
}
```

```javascript
// 定义类应用支持的本地化语言选项
export enum LocalEnum {
    en_US = 'en_US',
    zh_CN = 'zh_CN'
}
```

```javascript
// 定义了多标签操作的相关命令。
// 这个枚举似乎是专为管理多标签操作设计的。在多标签用户界面（如Web应用或桌面应用）中，用户可以在一个窗口内打开多个标签页，每个标签页可能对应不同的视图或功能。
export enum MultiTabOperation {
    FULLSCREEN = 'fullscreen', // 全屏显示当前标签
    REFRESH = 'refresh', // 筛选当前标签
    CLOSE = 'close',
    LOSEOTHERS = 'loseothers', // 关闭除当前之外的其他所有标签。
    CLOSEALL = 'closeAll',
    CLOSELEFT = 'closeLeft',
    CLOSERIGHT = 'closeRight', // 关闭当前标签右侧的所有标签。
}

```

```javascript
// 定义了权限资源的类型，区分不同级别的用户界面元素 Permission(许可，允许)
export enum PermissionType {
    CATALOGUE = '10', // catalogue(目录) 有子级的菜单，用于表示要展开的菜单项
    MENU = '10', // menu(菜单) 无子级菜单，表示单一页面链接
    BUTTON = '60', // button(按钮)
}
```

> 通过当前的**enum.ts**的文件，我们就可以推断出应用程序的某些功能和特性

1. 基础状态管理（BasicStatus）
应用可能包含启用（ENABLE）和禁用（DISABLE）状态，这可能用于**用户账户、服务、功能模块等的状态管理。**
1. 操作结果处理（ResultEnum）
应用有处理操作结果的机制，能够区分成功（SUCCESS）、错误（ERROR）、超时（TIMEOUT）等情况。**这暗示应用有一套错误处理和反馈系统。**
1. 本地存储和配置（StorageEnum）
应用使用本地存储来保存用户数据、令牌、设置和国际化语言偏好。这表明应用**支持个性化设置和可能的多语言支持。**
1. 主题和布局配置（ThemeMode, ThemeLayout, ThemeColorPresets）
应用支持主题模式（浅色和深色）、布局风格（垂直、水平、迷你）以及颜色预设。这表明**应用界面高度可定制**，用户可以根据个人喜好调整视觉体验。
1. 多语言支持（LocalEnum）
通过支持英语和中文，应用显示了其多语言能力，**适合不同地区的用户使用。**
1. 多标签操作（MultiTabOperation）
应用支持复杂的多标签操作，如全屏、刷新、关闭标签等，**适用于复杂的用户界面，可能是一个具有丰富交互的网页应用或企业软件。**
1. 权限类型（PermissionType）
应用管理不同类型的权限，包括目录、菜单和按钮，这表明**应用有复杂的权限管理系统，支持细粒度的访问控制。**

## 文件3：entity.ts

这个文件涉及了用户和组织相关的接口，包括 `UserToken`, `UserInfo`, `Organization`, `Permission`, `Role`

```javascript
// 包含访问令牌和属性令牌
export interface UserToken {
    accessToken?: string;
    refreshToken?: string;
}
```

```javascript
// 角色结构，包括角色名、描述、权限列表等，用于实现基于角色的访问控制（RBAC）
export interface Role {
    id: string;
    name: string;
    label: string; // 角色标签，通常用于界面显示，可能比 name 更正式或更具描述性。
    status: BasicStatus; // 角色状态是否激活，当前类型服务于安全性和权限控制
    order?: number; // 定义角色在列表或界面中的排序顺序。
    desc?: string;
    permission?: Permission[]; // 分配给该角色的权限列表，每个 permission 对象定义了角色在系统重可执行的具体操作或访问的资源。通过这个字段，可是实现基于角色的权限控制(RBAC)，根据用户的角色分配权限
}
```

```javascript
// 定义了系统中权限的细节，这些权限通常指定了用户可以访问的功能和资源
// 权限管理是任何企业级应用的核心组成部分，非常重要
export interface Permission {
    id: string;
    parentId: string; // 上级权限的ID，用于构建权限的层级关系
    name: string;
    label: string;
    resourceType: PermissionType; // 资源类型，根据定义的 PermissionType 枚举指明权限是菜单、按钮还是其他类型。
    path: string; // 与权限相关联的路径或路由。例如，如果权限涉及特定页面的访问，此路径可能是用户导航到该页面的 URL 路径。
    status?: BasicStatus; // 指示权限的启用或禁用状态。
    sortValue?: number; // 权限在列表或菜单中的排序值，数值较小表示位置较前。
    icon?: string; // 与权限关联的图标
    component?: string; // 关联的前端组件名称。如果权限是打开某个界面，该字段指定渲染该界面的组件。
    hide?: boolean; // 是否在用户界面中隐藏该权限。用于可能暂时不想显示，但又不想删除的权限。
    frameSrc?: string; // 如果权限是在 iframe 中显示外部内容，此字段指定外部内容的源地址。
    newFeature?: boolean; //  标识权限是否为新功能。有助于在用户界面中对新功能进行突出显示。
    children?: Permission[]; // 子权限列表。允许构建具有多层级的权限结构，每个权限可以包含多个子权限。
}
```

```javascript
// 定义用户的基本信息，如邮箱、用户名、密码、头像和角色等。
export interface UserInfo {
    id: string;
    email: string;
    account: string; // 账户
    password?: string;
    avatar?: string; // 头像
    roles?: Role;
    status?: BasicStatus;
    permissions?: Permission[]; // 权限
}
```

```javascript
// 定义了组织结构的关键元素。这种接口常用于表示和管理组织的层级关系，如公司、部门、分支机构等
export interface Organization {
    id: string; // 组织的唯一标识符。
    name: string; // 组织名称
    status: 'enable' | 'disable'; // 组织的启用状态。与角色或权限的状态相似，这可以控制组织单元是否活跃或者暂时禁用。
    desc?: string; // 组织的描述或注释
    order?: number; // 用于定义组织在列表或导航中的显示顺序。通常，较小的数值表示较高的优先级
    children?: Organization[]; // 子组织列表。这允许构建具有层次结构的组织架构
}
```

> 这个文件名很有意思，叫**entity.ts**， **entity**在后端的开发中，特别是使用对象关系映射(ORM)技术时，Entity(实体)通常对于数据库中的一个表，每个实体实力对应表中的一行。
> 在全栈开发中，前后端边界越来越模糊，前端经常需要定义模型（或类型定义），这些模型反应了后端系统中的实体，这样可以确保前后端之间的数据结构和业务逻辑的一致性。使用entity命名文件，意味着这些类型与后端实体直接对应。特别是在诸如用户、权限、组织架构等核心数据接口上，这也有助于前端开发者更好地管理状态、实现逻辑、以及提供接口调用时的类型安全。并且有助于团队成员理解和维护应用程序的各个部分

## 文件4：router.ts

定义了路由相关的接口 `RouteMeta`、`AppRouteObject`，用于管理应用程序的路由配置，特别是在使用诸如 antd 和 React Router 这类库构建的应用中。

### RouteMeta

用于描述路由的元数据，这些元数据可以用于控制路由的表现和行为。
利用了 **antd** 的导航组件 `Menu`，以及 `React Router` 的路由功能，该接口可以是开发者详细定义每个路由链接的表现和行为

```javascript
export interface RouteMeta {
    key: string; // 通常用作在 `antd` 的菜单组件中指定 `selectedKeys`，帮助确定哪个菜单项应当被激活或高亮显示。
    label: string; // 菜单选项的显示文本，支持国际化
    icon?: ReactNode; // 定义菜单项前的图标
    suffix?: ReactNode; // 菜单项后的图标
    hideMenu?: boolean; // 指定是否在菜单中隐藏这个路由项。这可以用来在不同权限下控制路由的可见性。
    hideTab?: boolean; // 指定是否在多标签视图中隐藏这个路由项。
    disabled?: boolean; // 用于在菜单中禁用此路由项，防止用户选择或访问。
    outlet?: any; // 对应于 react-router 的 outlet，用于嵌套路由的渲染位置。
    timeStamp?: string; // 用于控制标签的刷新，改变此值通常会触发组件的重新渲染。
    frameSrc?: string; // 如果路由项需要加载外部页面，如通过 iframe 嵌入，这个属性指定了资源的 URL。
}
```

### AppRouteObject

用于定义应用中的路由对象，它扩展了 **React Router** 的 **RouteObject** 类型，但省略了 children 属性以便重新定义。
通过将 **RouteObject** 和 **RouteMeta** 的组合，允许创建一个即包含路由信息、也包含视觉和功能元数据的路由定义

```javascript
export type AppRouteObject = {
    sortValue?: number; // 定义路由在列表或菜单中的排序顺序。
    meta?: RouteMeta; // 为这个路由提供元数据。
    children?: AppRouteObject[];
} & Omit<RouteObject, 'children'>;
```
