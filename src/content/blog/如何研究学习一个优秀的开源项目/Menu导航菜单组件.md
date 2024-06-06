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
    onClick={onClick} // -> 点击 MenuItem 调用此函数
    // inline(嵌入) 时菜单是否收起状态 - vertical垂直弹窗显示子级内容 - horizontal水平弹窗显示子级内容
    // 为true时，会只展示icon，不展示文本 - 这是mini状态
    inlineCollapsed={collapsed}
    // inline(嵌入) 模式的菜单缩进宽度(内容的缩进)
    inlineIndent={50}
    className="h-full !border-none"
    style={menuStyle}
  />
```

点击收缩按钮止呕触发的函数 toggleCollapsed

```typescript
  const toggleCollapsed = () => {
    if (!collapsed) {
      // 将主题布局设置为 Mini
      setThemeLayout(ThemeLayout.Mini);
    } else {
      // 将主题布局设置为 Vertical
      setThemeLayout(ThemeLayout.Vertical);
    }
    setCollapsed(!collapsed); // 切换折叠状态
  };
```

```typescript
  useEffect(() => {
    if (themeLayout === ThemeLayout.Vertical) {
      setCollapsed(false);
      setMenuMode('inline');
    }
    if (themeLayout === ThemeLayout.Mini) {
      setCollapsed(true);
      setMenuMode('inline');
    }
  }, [themeLayout]);
```

toggleCollapsed 函数主要用于处理某个按钮的点击事件，而 useEffect 钩子用于响应 themeLayout 状态的变化。这样设计的目的是确保菜单的 collapsed 状态和 themeLayout 状态在整个应用中始终保持一致。

```typescript
export function useRouteToMenuFn() {
  const { t } = useTranslation(); // 用于国际化处理
  const { themeLayout } = useSettings(); // 获取当前的布局主题设置
  const routeToMenuFn = useCallback(
    (items: AppRouteObject[]) => {
      return items
        .filter((item) => !item.meta?.hideMenu) // 过滤掉不需要显示在菜单中的路由项
        .map((item) => {
          const menuItem: any = [];
          const { meta, children } = item;
          if (meta) {
            const { key, label, icon, disabled, suffix } = meta;
            menuItem.key = key; // 菜单项的唯一标识
            menuItem.disabled = disabled; // 是否禁用该菜单项
            menuItem.label = (
              <div
                className={`inline-flex w-full items-center ${
                  themeLayout === ThemeLayout.Horizontal ? 'justify-start' : 'justify-between'
                } `}
              >
                <div className="">{t(label)}</div>
                {suffix}
              </div>
            );
            if (icon) {
              if (typeof icon === 'string') {
                if (icon.startsWith('ic')) {
                  menuItem.icon = <SvgIcon icon={icon} size={24} className="ant-menu-item-icon" />;
                } else {
                  menuItem.icon = <Iconify icon={icon} size={24} className="ant-menu-item-icon" />;
                }
              } else {
                menuItem.icon = icon; // 直接使用传入的图标
              }
            }
          }
          if (children) {
            menuItem.children = routeToMenuFn(children); // 递归处理子路由
          }
          return menuItem as ItemType; // 返回符合 Ant Design Menu 组件的菜单项类型
        });
    },
    [t, themeLayout],
  );
  return routeToMenuFn;
}
```

将路由对象数组转换为 Ant Design Menu 组件所需要的菜单项格式

useCallback：为了优化性能，使用 useCallback 钩子来记忆转换函数，只有当依赖项 t 或 themeLayout 变化时才会重新创建该函数。
过滤不显示的菜单项：通过 filter 方法，过滤掉 meta.hideMenu 为 true 的路由项。
生成菜单项：
  meta 属性：从路由对象中提取 meta 属性，用于生成菜单项的属性。
  key：设置菜单项的唯一标识符。
  disabled：是否禁用该菜单项。
  label：使用国际化处理后的标签和可选的后缀生成菜单项的标签。
  icon：根据图标类型生成菜单项的图标。支持字符串类型（SVG 图标或 Iconify 图标）和直接传入的图标组件。
  递归处理子菜单项：如果路由项有子路由（children），则递归调用 routeToMenuFn 处理子路由，生成子菜单项。
返回菜单项：将生成的菜单项转换为符合 Ant Design Menu 组件要求的 ItemType 类型。

```typescript
  const onClick: MenuProps['onClick'] = ({ key }) => {
    // 从扁平化的路由信息里面匹配当前点击的那个
    const nextLink = flattenedRoutes?.find((el) => el.key === key);

    // 处理菜单项中，外链的特殊情况 - 处理外链情况
    // 点击外链时，不跳转路由，不在当前项目添加tab，不选中当前路由，新开一个 tab 打开外链
    if (nextLink?.hideTab && nextLink?.frameSrc) {
      window.open(nextLink?.frameSrc, '_blank');
      return;
    }
    // 导航到新路由
    navigate(key);
    props?.closeSideBarDrawer?.();
  };
```

1. 使用 flattenedRoutes 数组的 find 方法，根据 key 查找被点击菜单项对应的路由信息。
2. flattenedRoutes 是拍平后的路由信息数组，其中每个元素代表一个路由项。
3. 如果 props 中存在 closeSideBarDrawer 函数，则调用该函数关闭侧边栏。

### HideTab和frameSrc两个属性问题

从功能设计的角度来看，hideTab 和 frameSrc 确实可以被视为一对属性，因为它们通常一起使用来决定一个菜单项是否是外链以及如何处理它。

为什么使用两个属性：虽然只使用一个属性（如 frameSrc）也可以实现同样的功能，但使用两个属性有其设计上的考虑和好处：

明确意图：

1. hideTab 明确表示这个菜单项不应该在当前项目的标签或导航中显示。这是一种显式的设计，可以让代码的意图更加清晰。
2. frameSrc 表示外链的目标地址。

代码可读性：

1. 通过分离 hideTab 和 frameSrc，可以更直观地理解和维护代码。即使 frameSrc 存在，但没有 hideTab，开发者也知道这个菜单项的处理方式。

灵活性：

1. 这种设计允许更复杂和灵活的配置。例如，未来可能会有不需要隐藏但仍需要处理的其他类型的菜单项，这时可以单独使用 frameSrc 而不需要 hideTab。

### 核心逻辑

#### Menu 展开和关闭逻辑 - 通过 openKeys 状态和 onOpenChange 事件处理菜单项的展开和关闭。

```typescript
const [openKeys, setOpenKeys] = useState<string[]>([]);

const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
  setOpenKeys(keys);
};
```

openKeys 状态：

1. openKeys 是一个数组，存储当前展开的菜单项的 key 值。
2. setOpenKeys 用于更新 openKeys 状态。

onOpenChange 事件：

1. onOpenChange 是 Menu 组件的事件处理函数，当菜单项的展开状态变化时触发。
2. 每当用户展开或关闭某个菜单项时，onOpenChange 函数被调用，keys 参数包含当前所有展开的菜单项的 key 值。
3. setOpenKeys(keys) 更新 openKeys 状态，控制哪些菜单项是展开的。

#### 菜单选中状态管理 - 通过 selectedKeys 状态和 useEffect 钩子管理菜单项的选中状态，确保菜单项正确高亮显示当前选中的路由。

```typescript
const [selectedKeys, setSelectedKeys] = useState<string[]>(['']);
const { pathname } = useLocation();

useEffect(() => {
  setSelectedKeys([pathname]);
}, [pathname, matches]);
```

selectedKeys 状态：

1. selectedKeys 是一个数组，存储当前选中的菜单项的 key 值。
2. setSelectedKeys 用于更新 selectedKeys 状态。

同步选中状态：

1. useLocation 钩子用于获取当前的路径名（pathname）。
2. 每当 pathname 或 matches 变化时，useEffect 钩子会将 selectedKeys 设置为当前的路径名，确保菜单项正确高亮显示当前选中的路由。

#### 将路由规则转换为 Menu 数据的规则（菜单数据转换） - 通过自定义钩子和转换函数，将路由规则转换为符合 Menu 组件要求的菜单项数据。

```typescript
const routeToMenuFn = useRouteToMenuFn();
const permissionRoutes = usePermissionRoutes();
const [menuList, setMenuList] = useState<ItemType[]>([]);

useEffect(() => {
  const menuRoutes = menuFilter(permissionRoutes);
  const menus = routeToMenuFn(menuRoutes);
  setMenuList(menus);
}, [permissionRoutes, routeToMenuFn]);
```

自定义钩子函数：

1. useRouteToMenuFn：返回一个函数，用于将路由对象转换为 Menu 数据格式。
2. usePermissionRoutes：返回权限过滤后的路由数据。

菜单数据转换：

1. 使用 menuFilter 函数过滤 permissionRoutes，得到菜单需要的路由数据 menuRoutes。
2. 使用 routeToMenuFn 将 menuRoutes 转换为符合 Menu 组件要求的菜单项数据 menus。
3. 更新 menuList 状态，将生成的菜单项数据设置为 Menu 组件的 items 属性。

#### 菜单点击事件处理 - 处理菜单项的点击事件，包括外链处理和路由导航。

```typescript
const onClick: MenuProps['onClick'] = ({ key }) => {
  const nextLink = flattenedRoutes?.find((el) => el.key === key);

  if (nextLink?.hideTab && nextLink?.frameSrc) {
    window.open(nextLink?.frameSrc, '_blank');
    return;
  }

  navigate(key);
};
```

点击事件处理：

1. onClick 是 Menu 组件的点击事件处理函数，当用户点击菜单项时触发。
2. 根据点击的菜单项 key，在 flattenedRoutes 中查找对应的路由信息 nextLink。

处理外链：

1. 如果 nextLink 存在且具有 hideTab 和 frameSrc 属性，则表示这是一个外链。
2. 使用 window.open(nextLink.frameSrc, '_blank') 在新标签页中打开外链，不进行路由导航。

导航：

1. 如果不是外链，调用 navigate(key) 进行路由导航。
