---
title: "Menu导航菜单组件"
summary: "Menu导航菜单组件"
date: "2024-05-30"
draft: false
tags:
- React
- antd
---

## nav-horizontal.tsx

```typescript
import { Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useState, useEffect, CSSProperties } from 'react';
import { useNavigate, useMatches, useLocation } from 'react-router-dom';

import { useRouteToMenuFn, usePermissionRoutes, useFlattenedRoutes } from '@/router/hooks';
import { menuFilter } from '@/router/utils';
import { useThemeToken } from '@/theme/hooks';

import { NAV_HORIZONTAL_HEIGHT } from './config';
```

```typescript
  const navigate = useNavigate();
  const matches = useMatches();
  const { pathname } = useLocation();

  const { colorBgElevated } = useThemeToken();

  const routeToMenuFn = useRouteToMenuFn();
  const permissionRoutes = usePermissionRoutes();
  const flattenedRoutes = useFlattenedRoutes();
```

useNavigate：获取导航函数，用于在菜单项点击时进行路由跳转。
useMatches：获取当前匹配的路由信息。
useLocation：获取当前的路径信息。
useThemeToken：获取主题相关的颜色。
useRouteToMenuFn、usePermissionRoutes、useFlattenedRoutes：自定义钩子函数，分别用于将路由转换为菜单、获取权限路由、获取拍平后的路由信息。

```typescript
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['']);
  const [menuList, setMenuList] = useState<ItemType[]>([]);
```

openKeys：控制哪些菜单项是展开状态。
selectedKeys：控制当前选中的菜单项。
menuList：存储转换后的菜单列表。

```typescript
  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname, matches]);

  useEffect(() => {
    const menuRoutes = menuFilter(permissionRoutes);
    const menus = routeToMenuFn(menuRoutes);
    setMenuList(menus);
  }, [permissionRoutes, routeToMenuFn]);
```

第一个 useEffect：当路径名或路由匹配变化时，更新选中的菜单项。
第二个 useEffect：当权限路由或转换函数变化时，过滤权限路由并生成菜单列表。

```typescript
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };
  const onClick: MenuProps['onClick'] = ({ key }) => {
    const nextLink = flattenedRoutes?.find((el) => el.key === key);

    if (nextLink?.hideTab && nextLink?.frameSrc) {
      window.open(nextLink?.frameSrc, '_blank');
      return;
    }
    navigate(key);
  };
```

onOpenChange：处理菜单展开状态变化事件。
onClick：处理菜单项点击事件，根据 key 查找对应的路由信息，如果是外链则新开标签页，否则进行路由跳转。

```typescript
  return (
    <div className="w-screen" style={{ height: NAV_HORIZONTAL_HEIGHT }}>
      <Menu
        mode="horizontal"
        items={menuList}
        className="!z-10 !border-none"
        defaultOpenKeys={openKeys}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={onClick}
        style={menuStyle}
      />
    </div>
  );
}
```

mode="horizontal"：设置菜单为水平模式。
items={menuList}：使用转换后的菜单列表数据。
defaultOpenKeys 和 openKeys：控制默认和当前的展开状态。
defaultSelectedKeys 和 selectedKeys：控制默认和当前的选中状态。
onOpenChange 和 onClick：绑定事件处理函数。
style={menuStyle}：设置菜单的样式。

## Nav.tsx

### 依赖导入

```typescript
// 导入了 MenuUnfoldOutlined 和 MenuFoldOutlined 图标，用于菜单折叠和展开按钮。
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
// 导入了 Menu 组件和 MenuProps 类型。
import { Menu, MenuProps } from 'antd';
// ItemType 用于定义菜单项的类型。
import { ItemType } from 'antd/es/menu/hooks/useItems';
// 导入 Color 库，用于颜色处理，例如调整颜色透明度。
import Color from 'color';
// 导入 framer-motion 库中的 m，用于动画效果。
import { m } from 'framer-motion';
// 导入 React 的一些钩子函数：useEffect 和 useState，用于状态管理和副作用处理。
import { CSSProperties, useEffect, useState } from 'react';
// 导入 React Router 的钩子函数：useLocation、useMatches 和 useNavigate，用于获取路由信息和导航。
import { useLocation, useMatches, useNavigate } from 'react-router-dom';

// MotionContainer：自定义动画容器组件，用于包装具有动画效果的元素。
import MotionContainer from '@/components/animate/motion-container';
// varSlide：自定义动画变体，定义了滑动动画的参数和效果。
import { varSlide } from '@/components/animate/variants';
// 导入自定义的 Logo 组件，用于显示网站或应用的标志。
import Logo from '@/components/logo';
// 导入自定义的 Scrollbar 组件，用于实现自定义样式的滚动条。
import Scrollbar from '@/components/scrollbar';
import { useRouteToMenuFn, usePermissionRoutes, useFlattenedRoutes } from '@/router/hooks';
// menuFilter：自定义工具函数，用于过滤菜单项，可能根据权限或其他条件进行过滤。
import { menuFilter } from '@/router/utils';
import { useSettingActions, useSettings } from '@/store/settingStore';
// useThemeToken：自定义钩子，用于获取主题相关的颜色和其他样式变量。
import { useThemeToken } from '@/theme/hooks';

// 导入了两个配置常量，NAV_COLLAPSED_WIDTH(nav_collapsed_width) 和 NAV_WIDTH(nav_width)，用于设置导航菜单在折叠和展开状态下的宽度。
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from './config';

// 导入了 ThemeLayout 枚举，可能用于定义不同的主题布局模式。
import { ThemeLayout } from '#/enum';
```

`useRouteToMenuFn`：自定义钩子，用于将路由转换为菜单项。
`usePermissionRoutes`：自定义钩子，用于获取具有权限的路由。
`useFlattenedRoutes`：自定义钩子，用于获取拍平后的路由信息。

`useSettingActions`：自定义钩子，用于获取和更新全局设置的操作函数。
`useSettings`：自定义钩子，用于获取全局设置的当前状态。

```typescript
```

```typescript
```

```typescript
```

```typescript
```

## Menu组件

```typescript
  // --------- --------- --------- 菜单展开 & 菜单选中 --------- --------- ---------
  useEffect(() => {
    if (themeLayout === ThemeLayout.Vertical) {
      const openKeys = matches
        .filter((match) => match.pathname !== '/')
        .map((match) => match.pathname);
      setOpenKeys(openKeys);
    }
    setSelectedKeys([pathname]);
  }, [pathname, matches, collapsed, themeLayout]);
  // 菜单展开
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };
  // --------- --------- --------- 菜单展开 & 菜单选中 --------- --------- ---------
```

```typescript
export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}
```

条件判断逻辑：目的是根据应用的主题布局设置（themeLayout），以及当前的路径和路由匹配情况，来控制菜单项的展开状态和选中状态。

- `themeLayout === ThemeLayout.Vertical`：首先检查当前的主题布局是否是垂直布局（Vertical）。ThemeLayout 是一个枚举，定义了不同的布局模式，如 Vertical、Mini 等。只有在垂直布局模式下，这段代码的主要逻辑才会执行。
- `matches.filter((match) => match.pathname !== '/')`：matches 是当前路径匹配的路由信息数组，由 useMatches 钩子提供。过滤掉根路径 / 的匹配项，因为通常情况下，根路径不需要展开菜单。
- `.map((match) => match.pathname)`：对过滤后的 matches 数组进行 map 操作，提取每个匹配项的路径名（pathname）。这些路径名代表应该展开的菜单项的 key。
- `setOpenKeys(openKeys)`：将过滤并提取出的路径名数组（openKeys）设置为菜单组件的展开项。通过 setOpenKeys 更新 openKeys 状态，从而控制菜单的展开状态。
- `setSelectedKeys([pathname])`：无论当前布局模式如何，都将当前路径名（pathname）设置为选中的菜单项。通过 setSelectedKeys 更新 selectedKeys 状态，从而控制菜单的选中状态。

垂直布局，找到matches的值，过滤掉 '/' 开头的路由，然后提取里面的pathname，提取出来的值大概如下

1. ['/dashboard', '/dashboard/workbench']
2. ['/components', '/components/chart']
3. ['/management', '/management/user', '/management/user/account']

openKeys 是一个数组，它包含当前菜单中需要展开的所有父级菜单项的 key。这是因为菜单项的展开状态不仅影响当前选中的菜单项，还影响其所有父级菜单项。
**多层级菜单结构**：在一个复杂的菜单系统中，菜单项可能有多层嵌套。例如，/management/user/account 是一个三级菜单项，其中 management 是顶级菜单，user 是二级菜单，account 是三级菜单。为了显示和访问 account 菜单项，需要同时展开 management 和 user 父级菜单项。
**setSelectedKeys** 只是用来高亮当前被选中的菜单项，而不影响菜单的展开状态。具体来说，setSelectedKeys 设置的是当前路径匹配的菜单项，以便在用户界面上高亮显示选中的菜单项。

```typescript
  <Menu
    // 菜单类型，现在支持垂直、水平、和内嵌模式三种
    // mode={menuMode}
    mode="inline"
    // 菜单内容
    items={menuList}
    // --------- --------- 展开菜单 start --------- ---------
    // 初始展开的 SubMenu 菜单项 key 数组 - 获取的是当前数据中的key值(有子菜单的选项的数据)
    defaultOpenKeys={openKeys}
    // 当前展开的 SubMenu 菜单项 key 数组 - 获取的是当前数据中的key值(有子菜单的选项的数据)
    openKeys={openKeys}
    // SubMenu 展开/关闭的回调
    onOpenChange={onOpenChange}
    // --------- --------- 展开菜单 end & 选中菜单 start --------- ---------
    // 初始选中的菜单项 key 数组 - 获取的是当前数据中的key值
    defaultSelectedKeys={selectedKeys}
    // 当前选中的菜单项 key 数组 - 获取的是当前数据中的key值
    selectedKeys={selectedKeys}
    // --------- --------- 选中菜单 end --------- ---------
    onClick={onClick}
    // inline(嵌入) 时菜单是否收起状态 - vertical垂直弹窗显示子级内容 - horizontal水平弹窗显示子级内容
    // 为true时，会只展示icon，不展示文本 - 这是mini状态
    inlineCollapsed={collapsed}
    // inline(嵌入) 模式的菜单缩进宽度(内容的缩进)
    inlineIndent={50}
    className="h-full !border-none"
    style={menuStyle}
  />
```
