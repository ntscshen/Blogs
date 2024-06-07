---
title: "Main组件"
summary: "Main组件"
date: "2024-06-07"
draft: false
tags:
- React
- antd
---

## Main

```typescript
import { Content } from 'antd/es/layout/layout';
import { CSSProperties, forwardRef } from 'react';
import { Outlet } from 'react-router-dom';

import { useSettings } from '@/store/settingStore';
import { useResponsive } from '@/theme/hooks';

import { NAV_WIDTH, NAV_COLLAPSED_WIDTH, HEADER_HEIGHT, MULTI_TABS_HEIGHT } from './config';
import MultiTabs from './multi-tabs';

import { ThemeLayout } from '#/enum';
```

Ant Design：导入了 Content 组件，用于布局中的内容区域。
React：导入了 CSSProperties 和 forwardRef，用于样式和创建可以使用 ref 的组件。
React Router：导入了 Outlet 组件，用于渲染匹配的子路由。
自定义钩子：useSettings 和 useResponsive，用于获取应用的设置和响应式信息。
配置常量：如导航栏宽度、高度等。
多标签组件：MultiTabs 组件，用于显示多个标签页。
枚举：ThemeLayout 枚举，用于定义不同的布局主题。

```typescript
const Main = forwardRef<HTMLDivElement, Props>(({ offsetTop = false }, ref) => {
```

Main 组件使用 forwardRef 创建，可以接收 ref，用于向子组件传递 ref。

```typescript
```

### CSSProperties

CSSProperties 是 TypeScript 中用于描述 CSS 样式对象的接口。它提供了类型检查，确保在编写内联样式时，属性名称和属性值都是有效的。

使用这个接口可以帮助我们在编写内联样式时获得类型检查。例如，如果我们尝试写错属性名称或使用错误的值类型，TypeScript 会给出错误提示：

```typescript
const divStyle: CSSProperties = {
  backgroundColor: 'blue', // 正确
  color: 'white', // 正确
  paddin: '10px', // 错误：拼写错误
  padding: 10, // 错误：值类型错误，应该是字符串
};
```

```typescript
import React, { CSSProperties } from 'react';

const divStyle: CSSProperties = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px',
};

const MyComponent: React.FC = () => {
  return <div style={divStyle}>Hello, world!</div>;
};

export default MyComponent;
```

通过这种方式，我们可以确保 divStyle 中的所有属性名称和属性值都是有效的。

CSSProperties 是 TypeScript 中用于描述 CSS 样式对象的接口。它提供了类型检查，确保在编写内联样式时，属性名称和属性值都是有效的。

### forwardRef是什么？解决什么问题？

forwardRef 的主要作用就是允许父组件通过 ref 访问子组件或其内部的 DOM 元素。这个功能在组件封装、库开发、以及需要直接操作子组件内部 DOM 的场景中非常常见和有用

典型的使用场景

1. **访问子组件的 DOM 元素**：在某些情况下，父组件需要直接操作子组件内部的 DOM 元素，例如聚焦一个输入框或控制一个视频元素的播放。通过 forwardRef，父组件可以直接获得子组件的 DOM 元素引用。
2. **高阶组件（HOC）**：高阶组件是一个函数，接收一个组件并返回一个新的组件。在实现高阶组件时，需要确保 ref 能够正确传递到被包裹的组件。forwardRef 可以帮助高阶组件处理 ref 转发。
3. **复合组件模式**：一些复杂的组件库（如表单库）中，组件之间可能需要相互引用和控制。通过 forwardRef，可以更方便地实现这些复杂交互。

#### 访问子组件的 DOM 元素

```typescript
import React, { useRef, forwardRef } from 'react';

// 子组件，使用 forwardRef 包裹
const MyInput = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

const ParentComponent = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <MyInput ref={inputRef} placeholder="Type something..." />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
};

export default ParentComponent;
```

1. 子组件：MyInput 使用 forwardRef 包裹，并将接收到的 ref 传递给内部的 input 元素。
2. 父组件：ParentComponent 创建了一个 ref 对象 inputRef，并将其传递给 MyInput。通过调用 focusInput 函数，可以聚焦 MyInput 内部的 input 元素。

#### 复合组件模式

```typescript
import React, { useRef, forwardRef } from 'react';

// 子组件
const Child = forwardRef((props, ref) => (
  <div ref={ref}>
    <p>Child Component</p>
  </div>
));

// 父组件
const Parent = () => {
  const childRef = useRef(null);

  const handleClick = () => {
    if (childRef.current) {
      alert('Child component clicked');
    }
  };

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleClick}>Check Child</button>
    </div>
  );
};

export default Parent;
```

**子组件**：Child 使用 forwardRef 包裹，将 ref 传递给内部的 div 元素。
**父组件**：Parent 创建 ref 对象 childRef，并传递给 Child。在 handleClick 函数中，可以通过 childRef 访问 Child 的 DOM 元素，并进行相应的操作。

#### 高阶组件

高阶组件（Higher-Order Component，HOC）是一种用于复用组件逻辑的高级技术。它**本质上是一个函数**，**接收一个组件**并**返回一个新的组件**。HOC 的**主要目的是增强组件的功能，而不修改其原始代码**。

类似装饰器用于增强和复用组件逻辑。

```typescript
// 创建一个高阶组件
const withDataFetching = (url) => {
  return (WrappedComponent) => {
    return (props) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setData(data);
            setLoading(false);
          });
      }, [url]);

      return <WrappedComponent data={data} loading={loading} {...props} />;
    };
  }
}


// 使用高阶组件增强组件
const MyComponent = ({ data, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const MyComponentWithData = withDataFetching('https://api.example.com/data')(MyComponent);

export default MyComponentWithData;
```

高阶组件（HOC）本质上就是一个函数，接收一个组件或其他参数（如字符串、对象等），然后返回一个新的函数，这个新的函数再接收一个组件，进行增强后返回新的组件。
在 React 的发展过程中，尤其是在函数组件和钩子（hooks）被引入后，自定义钩子和装饰器变得更加流行，因为它们提供了更直观和易于理解的方式来复用和共享逻辑。

### 自定义钩子(Custom Hooks)

```typescript
import { useState, useEffect } from 'react';

// 定义自定义钩子
const useDataFetching = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
};

// 使用自定义钩子
const MyComponent = () => {
  const { data, loading } = useDataFetching('https://api.example.com/data');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default MyComponent;
```

简单易懂：自定义钩子使用简单的函数来封装逻辑，符合开发者的直觉。
灵活性强：可以在任何函数组件中使用，不受限于类组件。
组合性：可以组合多个钩子，实现复杂的逻辑复用。

## Main方法

使用 forwardRef 来转发 ref
根据不同的布局和屏幕大小动态调整样式

```typescript
const Main = forwardRef<HTMLDivElement, Props>(({ offsetTop = false }, ref) => {
  const { themeStretch, themeLayout, multiTab } = useSettings();
  // 获取响应式布局的信息，通过 screenMap 判断当前屏幕尺寸
  const { screenMap } = useResponsive();

  const mainStyle: CSSProperties = {
    // paddingTop: header_height + (multiTab ? multi_tabs_height : 0),
    // 头部默认80px + 有多标签逻辑的话再加标签的高度 32px
    paddingTop: HEADER_HEIGHT + (multiTab ? MULTI_TABS_HEIGHT : 0),
    transition: 'padding 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms', // 过渡效果
    width: '100%',
  };
  // 水平布局：Menu标签在顶部，paddingTop为 tabs的高度
  if (themeLayout === ThemeLayout.Horizontal) {
    mainStyle.width = '100vw';
    mainStyle.paddingTop = multiTab ? MULTI_TABS_HEIGHT : 0; // multi_tabs_height
  } else if (screenMap.md) {
    // 屏幕尺寸在 md 断点及以上，且布局为垂直布局（Vertical）
    mainStyle.width = `calc(100% - ${
      // themeLayout === ThemeLayout.Vertical ? nav_width : nav_collapsed_width
      themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH
    })`;
  } else {
    mainStyle.width = '100vw';
  }

  return (
    // Content 是一个布局容器组件，将转发的 ref 赋值给 Content 组件，使父组件可以直接访问 Content 组件的 DOM 元素。
    <Content ref={ref} style={mainStyle} className="flex overflow-auto">
      <div
        className={`m-auto h-full w-full flex-grow sm:p-2 ${
          themeStretch ? '' : 'xl:max-w-screen-xl'
        }`}
      >
        {multiTab ? <MultiTabs offsetTop={offsetTop} /> : <Outlet />}
      </div>
    </Content>
  );
});
```

```typescript
// NAV_WIDTH nav_width 导航栏的宽度：定义垂直导航栏（侧边栏）的宽度，单位是像素（px）。
export const NAV_WIDTH = 260;
// NAV_COLLAPSED_WIDTH nav_collapsed_width 折叠后的导航栏宽度：定义折叠后的垂直导航栏的宽度，单位是像素（px）。
export const NAV_COLLAPSED_WIDTH = 90;
// NAV_HORIZONTAL_HEIGHT nav_horizontal_height 水平导航栏的高度：定义水平导航栏的高度，单位是像素（px）。
export const NAV_HORIZONTAL_HEIGHT = 48;

// HEADER_HEIGHT header_height 头部的高度：定义应用头部的高度，单位是像素（px）。
export const HEADER_HEIGHT = 80;
// OFFSET_HEADER_HEIGHT offset_header_height 偏移后的头部高度：定义在某些情况下（例如滚动或固定头部时）应用头部的偏移高度，单位是像素（px）。
export const OFFSET_HEADER_HEIGHT = 64;

// MULTI_TABS_HEIGHT multi_tabs_height 多标签的高度：定义多标签区域的高度，单位是像素（px）。
export const MULTI_TABS_HEIGHT = 32;
```

## use-reponsive.ts

```typescript
import { Grid, theme } from 'antd';
import { Breakpoint, ScreenMap, ScreenSizeMap } from 'antd/es/_util/responsiveObserver';

const { useBreakpoint } = Grid;

export function useResponsive() {
  const {
    token: { screenXS, screenSM, screenMD, screenLG, screenXL, screenXXL },
  } = theme.useToken();
  const screenArray: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  // 存储每个断点对应的具体像素值。一个对象，键是断点名（如 xs、sm 等），值是对应的像素值。
  const screenEnum: ScreenSizeMap = {
    xs: screenXS, // xs：超小屏幕（< 576px）
    sm: screenSM, // sm：小屏幕（≥ 576px）
    md: screenMD, // md：中等屏幕（≥ 768px）
    lg: screenLG, // lg：大屏幕（≥ 992px）
    xl: screenXL, // xl：超大屏幕（≥ 1200px）
    xxl: screenXXL, // xxl：极大屏幕（≥ 1600px）
  };
  // 存储当前视口激活的断点状态。一个对象，键是断点名（如 xs、sm 等），值是布尔值，指示当前视口是否处于该断点范围内。
  const screenMap: ScreenMap = useBreakpoint();

  // 表示当前激活的最大断点。倒序遍历 screenArray，找到第一个值为 true 的断点名。
  const currentScrren = [...screenArray].reverse().find((item) => {
    const result = screenMap[item];
    return result === true;
  });
  return {
    screenEnum,
    screenMap,
    currentScrren,
  };
}
```

完全基于 Ant Design 的 Grid 组件和 theme 提供的内容来做处理的。它主要解决了获取当前屏幕断点信息和断点对应的像素值的问题，以便在组件中实现响应式设计。

### 断点事什么？

> 在响应式设计中，断点（breakpoint）是指当浏览器视口（viewport）达到某个特定的宽度时，布局和样式会发生变化的点。断点的目的在于确保网页在不同设备和屏幕尺寸上都能有良好的显示效果。

断点用于定义不同屏幕尺寸下的布局和样式规则。例如，在桌面设备上显示三列布局，而在移动设备上显示单列布局。断点通常与 CSS 媒体查询结合使用，当视口宽度达到断点时，应用特定的 CSS 规则。

Ant Design 提供了一套默认的断点，用于其 Grid 组件和响应式设计。以下是 Ant Design 默认的断点定义：

1. xs：超小屏幕（< 576px）
2. sm：小屏幕（≥ 576px）
3. md：中等屏幕（≥ 768px）
4. lg：大屏幕（≥ 992px）
5. xl：超大屏幕（≥ 1200px）
6. xxl：极大屏幕（≥ 1600px）

### screenMap.md

```typescript
if (screenMap.md) {
 // 屏幕尺寸在 md 断点及以上，且布局为垂直布局（Vertical）
 mainStyle.width = `calc(100% - ${
   // themeLayout === ThemeLayout.Vertical ? nav_width : nav_collapsed_width
   themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH
 })`;
}
```

1. 如果当前屏幕宽度在 md（中等屏幕，大于等于 768px）及以上范围内（即 screenMap.md 为 true），则执行后续的代码块。
2. calc(100% - ... )：使用 CSS 的 calc 函数来计算宽度。calc 允许在 CSS 中进行动态计算。
3. themeLayout：表示当前的布局模式，它可以是垂直布局（Vertical）或水平布局（Horizontal）。
  1. ThemeLayout.Vertical：这是一个枚举值，表示垂直布局模式。
  2. NAV_WIDTH：垂直布局模式下导航栏的宽度（260px）。
  3. NAV_COLLAPSED_WIDTH：水平布局模式下折叠导航栏的宽度（90px）。

## 核心逻辑

> 根据不同的布局模式和屏幕断点来动态调整 mainStyle 的宽度

水平布局模式（Horizontal）：

1. 菜单在顶部，因此内容区域的宽度应该是 100vw（全屏宽度）。
2. 顶部填充根据 multiTab 来决定是否增加 MULTI_TABS_HEIGHT。

垂直布局模式（Vertical）：

1. 如果屏幕宽度达到 md（中等屏幕）及以上，则根据导航栏是否折叠来调整内容区域的宽度：
2. 展开状态下（正常宽度）：calc(100% - NAV_WIDTH)
3. 折叠状态下（mini 宽度）：calc(100% - NAV_COLLAPSED_WIDTH)

其他情况：

1. 默认宽度为 100vw。

```typescript
  if (themeLayout === ThemeLayout.Horizontal) {
    mainStyle.width = '100vw';
    mainStyle.paddingTop = multiTab ? MULTI_TABS_HEIGHT : 0;
  } else if (screenMap.md) {
    mainStyle.width = `calc(100% - ${
      themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH
    })`;
  } else {
    mainStyle.width = '100vw';
  }
```

综合来看这块逻辑写的很烂，不好理解，下面是优化的逻辑

```typescript
const Main = forwardRef<HTMLDivElement, Props>(({ offsetTop = false }, ref) => {
  const { themeStretch, themeLayout, multiTab } = useSettings();
  const { screenMap } = useResponsive();

  const mainStyle: CSSProperties = {
    transition: 'padding 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  };

  if (themeLayout === ThemeLayout.Horizontal) {
    // 水平布局模式
    mainStyle.width = '100vw';
    mainStyle.paddingTop = multiTab ? MULTI_TABS_HEIGHT : 0;
  } else if (themeLayout === ThemeLayout.Vertical && screenMap.md) {
    // 垂直布局模式(中等屏幕及以上)
    mainStyle.width = `calc(100% - ${NAV_WIDTH})`;
    mainStyle.paddingTop = HEADER_HEIGHT + (multiTab ? MULTI_TABS_HEIGHT : 0);
  } else if (screenMap.md) {
    // 折叠导航栏模式（中等屏幕及以上）
    mainStyle.width = `calc(100% - ${NAV_COLLAPSED_WIDTH})`;
    mainStyle.paddingTop = HEADER_HEIGHT + (multiTab ? MULTI_TABS_HEIGHT : 0);
  } else {
    // 其他情况
    mainStyle.width = '100vw';
    mainStyle.paddingTop = HEADER_HEIGHT + (multiTab ? MULTI_TABS_HEIGHT : 0);
  }

  return (
    <Content ref={ref} style={mainStyle} className="flex overflow-auto">
      <div
        className={`m-auto h-full w-full flex-grow sm:p-2 ${
          themeStretch ? '' : 'xl:max-w-screen-xl'
        }`}
      >
        {multiTab ? <MultiTabs offsetTop={offsetTop} /> : <Outlet />}
      </div>
    </Content>
  );
});

export default Main;
```

```typescript
<div
  className={`m-auto h-full w-full flex-grow sm:p-2 ${
    themeStretch ? '' : 'xl:max-w-screen-xl'
  }`}
>
  {multiTab ? <MultiTabs offsetTop={offsetTop} /> : <Outlet />}
</div>
```

1. **m-auto**：m 代表 margin，auto 表示自动水平居中。使该元素在其父容器中水平居中。 `margin: auto;`
2. **h-full**：h 代表 height，full 表示 100% 高度。使该元素的高度占满其父容器的高度。 `width: 100%;`
3. **w-full**：w 代表 width，full 表示 100% 宽度。使该元素的宽度占满其父容器的宽度。 `height: 100%;`
4. **flex-grow**：使该元素在 flex 布局中可以自由伸展，填充剩余的空间。 `flex-grow: 1;`
5. **sm:p-2**：
   1. p 代表 padding，2 表示一个固定的 padding 值。
   2. sm: 前缀表示这个类在小屏幕（sm，≥576px）及以上设备上应用。
   3. 使该元素在小屏幕及以上设备上有 2 的内边距。
6. **xl:max-w-screen-xl**：
   1. max-w 代表最大宽度，screen-xl 表示屏幕的 xl 尺寸（1280px）。
   2. xl: 前缀表示这个类在超大屏幕（xl，≥1200px）及以上设备上应用。
   3. 使该元素在超大屏幕及以上设备上，最大宽度限制为 1280px。
   4. 根据 themeStretch 的值决定是否应用最大宽度限制。
      1. 如果 themeStretch 为 true，则 div 元素可以伸展到其父容器的全宽。
      2. 如果 themeStretch 为 false，则在超大屏幕及以上设备上，最大宽度限制为 1280px。

`{multiTab ? <MultiTabs offsetTop={offsetTop} /> : <Outlet />}`

1. **multiTab**：这是一个布尔值，用于决定是否启用多标签页功能。
2. **`<MultiTabs />`**
   1. 功能：MultiTabs 组件通常用于在一个页面中显示多个选项卡，用户可以在选项卡之间切换。
   2. offsetTop 属性：这是传递给 MultiTabs 组件的一个属性，用于设置选项卡的顶部偏移量（可能是为了避免与其他固定元素重叠，如导航栏）。
3. **`<Outlet />`**：
   1. 功能：Outlet 组件是 React Router 提供的一个占位符组件，用于在嵌套路由中渲染匹配的子路由组件。
   2. 用途：在没有多标签页的情况下，Outlet 组件将渲染当前匹配的路由组件。


