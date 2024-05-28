---
title: "路由架构（三）DashboardLayout"
summary: "DashboardLayout 组件定义了应用的主布局，包含导航栏、头部和主内容区。它还使用了 Suspense 组件进行懒加载，包含了主题和滚动处理逻辑。我们逐步分析每个部分的功能和作用。"
date: "2024-05-24"
draft: false
tags:
- react-router-dom
---

## DashboardLayout

### 依赖项

依赖项，提供了以下功能：

- 滚动处理: 监听和处理页面或元素的滚动事件。
- 状态管理: 管理和获取应用设置、主题等状态。
- 懒加载: 在组件加载时显示加载指示器，优化用户体验。
- 样式管理: 使用 styled-components 编写和管理组件的样式。
- 布局和导航: 定义应用的基本布局，包括头部、导航栏和主内容区。

```typescript
import { useScroll } from 'framer-motion';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { CircleLoading } from '@/components/loading';
import ProgressBar from '@/components/progress-bar';
import { useSettings } from '@/store/settingStore';
import { useThemeToken } from '@/theme/hooks';

import Header from './header';
import Main from './main';
import Nav from './nav';
import NavHorizontal from './nav-horizontal';

import { ThemeLayout, ThemeMode } from '#/enum';
```

#### framer-motion

`import { useScroll } from 'framer-motion';`

`framer-motion` 是一个用于实现复杂动画的库，而 useScroll 是其中一个 Hook，用于处理滚动事件。**解决的问题**: 监听和处理页面或元素的滚动事件，以便根据滚动位置执行相应的逻辑。

#### React 内置 Hook

`import { Suspense, useCallback, useEffect, useRef, useState } from 'react';`

- Suspense: 用于处理组件的懒加载，在等待加载完成时显示一个回退组件（例如加载指示器）。
- useCallback: 返回一个 memoized 版本的回调函数，只有在其依赖项发生变化时才会重新生成，优化性能。
- useEffect: 用于在组件挂载、更新和卸载时执行副作用。
- useRef: 创建一个可变的引用对象，持有对 DOM 元素或组件实例的引用。
- useState: 用于在函数组件中添加状态管理。

#### styled-components

`import styled from 'styled-components';`

**styled-components** 是一个用于编写 CSS 样式的库，支持使用 JavaScript 语法编写样式，并将样式与组件绑定。提供一种直观且模块化的方式编写和管理组件的样式，使样式可以与组件逻辑紧密结合。

#### 自定义组件

- CircleLoading: 一个加载指示器组件，用于在数据或组件加载时显示。
- ProgressBar: 一个进度条组件，用于显示页面加载或数据处理的进度。
- useSettings: 自定义 Hook，用于从状态管理（通常是基于 Zustand 或其他状态管理库）中获取用户设置（例如布局和主题设置）。
- useThemeToken: 自定义 Hook，用于获取主题相关的颜色和样式变量。
- Header: 头部组件，通常包含标题、用户信息和操作按钮。
- Main: 主内容区域组件，包含主要的页面内容。
- Nav: 垂直导航栏组件，包含导航菜单项。
- NavHorizontal: 水平导航栏组件，适用于水平布局。
- ThemeLayout: 枚举，用于定义不同的布局模式（例如水平布局和垂直布局）。
- ThemeMode: 枚举，用于定义不同的主题模式（例如亮色模式和暗色模式）。

## styled-components 详解

`styled-components` 是一个用于编写 CSS 样式的库，它允许在 JavaScript 文件中编写 CSS，并将样式与组件逻辑紧密结合。`styled-components` 提供了一种直观且模块化的方式编写和管理组件的样式。允许你**在 JavaScript 中编写 CSS**，并将其应用到组件上。它利用了模板字面量的语法，使你可以编写内联样式，同时**支持变量和函数**。

```javascript
import styled from 'styled-components';

function DashboardLayout() {
  // ...
  const { themeLayout, themeMode } = useSettings();
  // ...
  return (
    <StyleWrapper $themeMode={themeMode}>
      <ProgressBar />
      <div>主要内容</div>
    </StyleWrapper>
  );
}
export default DashboardLayout;

const StyleWrapper = styled.div<{ $themeMode?: ThemeMode }>`
  /* 设置滚动条的整体样式 */
  ::-webkit-scrollbar {
    width: 8px; /* 设置滚动条宽度 */
  }

  /* 设置滚动条轨道的样式 */
  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#2c2c2c' : '#FAFAFA')};
  }

  /* 设置滚动条滑块的样式 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#6b6b6b' : '#C1C1C1')};
  }

  /* 设置鼠标悬停在滚动条上的样式 */
  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#939393' : '##7D7D7D')};
  }
`;
```

### 带有可选参数的样式组件

`const StyleWrapper = styled.div<{ $themeMode?: ThemeMode }>`：定义了一个 StyleWrapper 组件，它是一个 div 元素，并且接受一个可选的 $themeMode 属性。属性的类型是 ThemeMode，这个类型通常是一个枚举，用于指定不同的主题模式（例如 Dark 或 Light）。

- styled.div: 使用 styled-components 创建一个带有样式的 div 组件。
- 泛型参数 `<{ $themeMode?: ThemeMode }>`: 指定组件可以接受 $themeMode 属性，这个属性的类型是 ThemeMode，并且是可选的。

**定义与使用**: StyleWrapper 变量通过 styled-components 定义了一个带有动态样式的组件。在 JSX 中使用 StyleWrapper 组件时，通过属性传递参数（如 $themeMode），这些参数会被 styled-components 自动传递给样式定义，从而实现动态样式。

```css
/* 这条规则设置了滚动条的宽度为 8 像素。::-webkit-scrollbar 是一个伪元素，用于定制滚动条的外观。 */
::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
}
```

```css
/* 设置滚动条轨道的样式 */
::-webkit-scrollbar-track {
  border-radius: 8px;
  background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#2c2c2c' : '#FAFAFA')};
}
```

这条规则设置了滚动条轨道的样式。

- border-radius: 8px: 设置滚动条轨道的圆角半径为 8 像素。
- background: 根据传入的 $themeMode 属性值，设置滚动条轨道的背景颜色。如果主题模式是 Dark，背景颜色为 #2c2c2c；如果是 Light，背景颜色为 #FAFAFA。

```css
/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#6b6b6b' : '#C1C1C1')};
}
```

这条规则设置了滚动条滑块的样式。

- border-radius: 10px: 设置滚动条滑块的圆角半径为 10 像素。
- background: 根据传入的 $themeMode 属性值，设置滚动条滑块的背景颜色。如果主题模式是 Dark，背景颜色为 #6b6b6b；如果是 Light，背景颜色为 #C1C1C1。

```css
/* 设置鼠标悬停在滚动条上的样式 */
::-webkit-scrollbar-thumb:hover {
  background: ${(props) => (props.$themeMode === ThemeMode.Dark ? '#939393' : '#7D7D7D')};
}
```

这条规则设置了鼠标悬停在滚动条滑块上的样式。

- background: 根据传入的 $themeMode 属性值，设置鼠标悬停时滚动条滑块的背景颜色。如果主题模式是 Dark，背景颜色为 #939393；如果是 Light，背景颜色为 #7D7D7D。

```css

```

## DashboardLayout 函数组件

这个 **DashboardLayout** 函数组件定义了一个典型的仪表盘布局，包含头部、导航栏、主内容区等元素，同时处理了滚动、主题和布局的动态变化。

```typescript
function DashboardLayout() {
  const { colorBgElevated, colorTextBase } = useThemeToken();
  const { themeLayout, themeMode } = useSettings();

  const mainEl = useRef(null);
  const { scrollY } = useScroll({ container: mainEl });
  /**
   * y轴是否滚动
   */
  const [offsetTop, setOffsetTop] = useState(false);
  const onOffSetTop = useCallback(() => {
    scrollY.on('change', (scrollHeight) => {
      if (scrollHeight > 0) {
        setOffsetTop(true);
      } else {
        setOffsetTop(false);
      }
    });
  }, [scrollY]);

  useEffect(() => {
    onOffSetTop();
  }, [onOffSetTop]);

  //  定义垂直导航栏。(左侧边栏导航)
  const navVertical = (
    <div className="z-50 hidden h-full flex-shrink-0 md:block">
      <Nav />
    </div>
  );

  // 根据当前布局设置，选择水平或垂直导航栏
  const nav = themeLayout === ThemeLayout.Horizontal ? <NavHorizontal /> : navVertical;

  return (
    <StyleWrapper $themeMode={themeMode}>
      // 显示加载进度条。
      <ProgressBar />
      <div
        className={`flex h-screen overflow-hidden ${
          themeLayout === ThemeLayout.Horizontal ? 'flex-col' : ''
        }`}
        style={{
          color: colorTextBase,
          background: colorBgElevated,
          transition:
            'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }}
      >
        <Suspense fallback={<CircleLoading />}>
          <Header offsetTop={themeLayout === ThemeLayout.Vertical ? offsetTop : undefined} />
          {nav}
          <Main ref={mainEl} offsetTop={offsetTop} />
        </Suspense>
      </div>
    </StyleWrapper>
  );
}
```

- **useThemeToken**: 自定义 Hook，用于获取主题相关的颜色和样式变量。
- **useSettings**: 自定义 Hook，用于获取当前的布局和主题设置。
- **useRef**: 创建一个引用，用于引用主内容元素。
- **useScroll**: framer-motion 提供的 Hook，用于监听滚动事件。

### 管理滚动状态

- **useState**: 管理 offsetTop 状态，表示内容是否滚动。
- **useCallback**: 优化回调函数，处理滚动事件，设置 offsetTop 状态。
- **useEffect**: 监听 onOffSetTop 回调，确保滚动事件在组件挂载时生效。


