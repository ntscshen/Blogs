---
title: "状态管理（一）zustand"
summary: "状态管理"
date: "2024-05-28"
draft: false
tags:
- zustand
- react-query
---

## 状态管理 `zustand`

必学：这是2021、2022、2023年最火的状态管理工具 https://risingstars.js.org/2023/zh#section-statemanagement
有一些核心方法和概念是必须要掌握的，内容如下

### `create`

这是 Zustand 中最重要的函数，用于创建一个 store。它接受一个回调函数，这个回调函数接收一个 set 函数用于更新状态，并返回一个包含初始状态和更新方法的对象。

```typescript
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
```

### `set`

这是用来更新状态的函数。它可以接受一个新的状态对象，或者一个返回新状态对象的函数。

```typescript
const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));
```

### `get`

Zustand 的 get 函数用于获取当前的状态值。这个函数通常在内部使用较多，而不是在组件中直接使用。

```typescript
const useStore = create((set, get) => ({
  count: 0,
  increase: () => set({ count: get().count + 1 }),
}));
```

### `subscribe`

这个方法用于订阅状态变化，可以在状态变化时执行一些副作用函数。它返回一个用于取消订阅的函数。

```typescript
const unsubscribe = useStore.subscribe(
  (count) => console.log("Count changed to", count),
  (state) => state.count
);

// 取消订阅
unsubscribe();
```

### `destroy`

销毁当前 store 的订阅和状态。这通常用于组件卸载或不再需要状态管理时。

```typescript
const useStore = create((set) => ({
  count: 0,
}));

useStore.destroy();
```

## useUserStore

管理用户信息和用户令牌

```typescript
type UserStore = {
    userInfo: Partial<UerInfo>;
    userToken: UserToken;
    actions: {
        setUserInfo: (userInfo: UserInfo) => void;
        setUserToken: (token: UserToken) => void;
        clearUserInfoAndToken: () => void;
    }
}
```

**Partial** 是 TypeScript 提供的一个实用类型（Utility Type），用于构建一个类型，使其所有属性变为可选。
**void** 是 TypeScript 的一个基本类型，表示函数没有返回值。每个函数返回 void，表示它们执行操作，但不返回任何值。
**actions** 将所有的操作函数放在 actions 命名空间下
    - 组织清晰：将所有的操作函数集中在一起，使代码结构更加清晰。
    - 命名空间：避免与状态属性命名冲突。
    - 易于调用：通过 state.actions 可以轻松访问所有操作函数。

```typescript
{
  // 设置新的用户信息，并存储到本地存储中
  setUserInfo: (userInfo) => {
    set({ userInfo });
    setItem(StorageEnum.User, userInfo);
  },
  // 设置新的用户令牌，并存储到本地存储中
  setUserToken: (userToken) => {
    set({ userToken });
    setItem(StorageEnum.Token, userToken);
  },
  // 清除用户信息和令牌，从状态和本地存储中移除
  clearUserInfoAndToken() {
    set({ userInfo: {}, userToken: {} });
    removeItem(StorageEnum.User);
    removeItem(StorageEnum.Token);
  },
}
```

**setUserInfo** 接受一个 UserInfo 对象，表示新的用户信息
    - 使用 **set** 函数更新 **userInfo** 状态
    - 使用 **setItem** 函数将新的用户信息存储到本地存储中
**setUserToken** 接受一个 UserToken 对象，表示新的用户令牌
    - 使用 **set** 函数更新 **userToken** 状态。
    - 使用 **setItem** 函数将新的用户令牌存储到本地存储中。
**clearUserInfoAndToken**
    - 使用 **set** 函数清空 **userInfo** 和 **userToken** 状态。
    - 使用 **removeItem** 函数从本地存储中移除用户信息和用户令牌。

在当前代码中为什么要将数据状态分别存储与全局中和浏览器的本地存储中这两个地方呐？
全局状态管理 (**Zustand**)优点

1. 实时响应: 当状态改变时，依赖该状态的组件会自动重新渲染，确保 UI 与状态同步。
2. 跨组件共享: 通过 **Zustand** 这样的状态管理库，不同组件可以轻松共享和更新状态。
3. 性能优化: 使用 **Zustand** 可以避免不必要的重新渲染，从而优化性能。

本地存储 (**Local Storage**)优点

1. 持久性: 即使用户刷新页面或关闭浏览器后再重新打开，数据仍然存在。
2. 不依赖服务器: 数据存储在用户的浏览器中，不需要每次都从服务器获取数据。
3. 减少加载时间: 可以减少从服务器获取数据的时间，提高页面加载速度。

两种存储方式的结合，是实时性和持久性的结合

- 实时性: 在应用运行时，使用 Zustand 的全局状态管理可以确保状态变化即时反映在 UI 上。
- 持久性: 使用本地存储确保数据在页面刷新或浏览器关闭后仍然存在，提高用户体验。

1. **初始化状态**: 在创建 Zustand store 时，从本地存储初始化状态。这确保了应用启动时就有正确的数据。
2. **更新状态**: 当状态改变时，既更新全局状态，也更新本地存储。这确保了 UI 实时更新，并且数据持久保存。
3. **清除状态**: 当用户登出时，清除全局状态和本地存储中的数据。

> 通过这种方式，你可以在保证应用的实时响应能力的同时，也确保数据在页面刷新或浏览器关闭后仍然存在。
> 这种方法虽然看起来有点麻烦，但实际上能够提供更好的用户体验和数据一致性。

```typescript
// 需要访问用户信息时，从 store 中提取 userInfo 状态。
export const useUserInfo = () => useUserStore((state) => state.userInfo);
// 需要访问用户令牌时，从 store 中提取 userToken 状态。
export const useUserToken = () => useUserStore((state) => state.userToken);
// 需要访问用户的权限时，从 store 中提取 userInfo 中的 permissions 属性。
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
// 在组件中需要调用设置或清除用户信息和令牌的操作时，从 store 中提取 actions 对象。
export const useUserActions = () => useUserStore((state) => state.actions);
```

### 用于用户登录逻辑 `useSignIn`

```typescript
export const useSignIn = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { notification, message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();

  const signInMutation = useMutation(userService.signin);

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);
      const { user, accessToken, refreshToken } = res;
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${data.username}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};
```

- **useTranslation**: 来自 react-i18next，用于国际化处理。t 函数用于获取翻译的文本。
- **useNavigate**: 来自 react-router-dom，用于页面导航。navigate 函数用于导航到不同的路由。
- **App.useApp**: 来自 antd，用于获取全局的 notification 和 message 对象，分别用于显示通知和消息提示。
- **useUserActions**: 来自自定义的 Zustand store，用于获取操作用户状态的函数 setUserToken 和 setUserInfo。

## @tanstack/react-query

是一个专门为处理异步数据请求和状态管理而设计的库。它的核心功能是简化数据获取、缓存、同步和更新的过程。

对于在国内经常用的 ahooks 它们有什么区别？

`**@tanstack/react-query**`

 - 专注于数据获取和变异、缓存管理、同步、分页和无限滚动。非常适合处理复杂的异步数据请求和状态管理。
 - 功能专一，侧重于处理服务器状态。
 - 提供自动缓存和后台同步功能，数据管理更为强大。

`**ahooks**`

- 功能多样，提供广泛的实用 Hook。
- 虽然提供了 useRequest 钩子处理异步请求，但没有专门的缓存和同步功能。
- 提供了一系列广泛的实用 Hook，涵盖状态管理、异步处理、生命周期、Dom 操作和性能优化。适合需要大量通用 Hook 的项目。

侧重点不同，一个大而全，一个专而精。对于开发者来说其实更推荐使用专注的库去处理问题，有问题就去查找业界更多人使用的方案。而不是使用一套大而全的方案解决所有

### 必须要学习的几个方法

`useQuery` ：是最常用的钩子，用于获取数据并管理数据请求的状态。
`useMutation` ：用于处理数据的创建、更新和删除操作。
`useQueryClient` ：
`useInfiniteQuery` ：用于处理无限滚动或分页加载的场景。
`QueryClient` ：
`QueryClientProvider` ：

如果使用当前类库，就必须使用 `QueryClientProvider`，它是一个 React 组件，用于在应用中提供全局的 QueryClient 实例。它允许你在整个应用中使用 @tanstack/react-query 提供的钩子，如 useQuery 和 useMutation。如果你不使用 QueryClientProvider，useQuery 和 useMutation 将无法访问 QueryClient 实例，因此无法正常工作。

#### 为什么 useQuery 和 useMutation 分开实现

核心原因：

1. **不同的使用场景**：
   1. 查询操作(useQuery)通常需要**缓存**和**后台刷新**
   2. 变动操作(useMutation)则需要处理**乐观更新**和**错误回滚**
2. **不同的生命周期管理**
   1. **useQuery** 需要管理数据的缓存、过期和后台刷新。
   2. **useMutation** 需要管理变动操作的乐观更新、错误处理和回滚。
3. **职责单一原则**
   1. **useQuery** 专注于数据的获取。
   2. **useMutation** 专注于数据的增删改操作。


`const { data, error, isLoading } = useQuery(['user'], fetchUser);` 这里面的 **'user'** 是什么

1. 在 useQuery 中的第一个参数 ['user'] 被称为“查询键”（Query Key）
2. 查询键：是一个唯一标识符，用于标识和区分不同的查询。查询键可以是一个字符串或字符串数组，通常使用数组形式来支持更复杂的查询标识符。
3. 命名空间：查询键可以视为一种命名空间，它帮助 @tanstack/react-query 确定缓存数据的位置和管理查询。
   1. 唯一标识：每个查询都有一个唯一的键，用于区分不同的查询。
   2. 缓存管理：查询键用于管理和缓存查询结果。
   3. 依赖跟踪：查询键允许 @tanstack/react-query 确定何时重新获取数据。
   4. 命名空间：查询键可以帮助组织和区分不同的数据请求。

#### QueryClient概念和使用

QueryClient 是 @tanstack/react-query 的核心管理器，负责处理所有的查询和变异操作。它提供了一整套的 API，用于管理查询缓存、后台刷新、错误处理等。

在你的应用程序中，你需要创建一个 QueryClient 实例并通过 QueryClientProvider 提供给整个应用。

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppComponents />
    </QueryClientProvider>
  );
};

export default App;
```

useQueryClient 主要用于在特定场景下执行一些需要直接操作查询客户端的高级操作。具体真实使用场景如下：

1. 手动刷新查询：当数据被更新或需要重新获取时，手动触发查询重新获取数据。
2. 访问缓存数据：直接从缓存中读取数据，而不触发重新获取。
3. 预取数据：在用户导航到页面之前提前获取数据，并将其缓存以便更快的响应。
4. 取消查询：需要取消正在进行的查询，例如在组件卸载时或用户主动取消操作时。

### useInfiniteQuery

用于处理无限滚动或分页加载的场景。
主要功能：

1. 分页加载：处理分页数据的获取和管理。
2. 无限滚动：在用户滚动到页面底部时自动加载更多数据。
3. 数据缓存：缓存已经加载的数据，避免重复请求。
4. 状态管理：自动管理加载状态、错误状态等。

基本使用步骤

- 定义数据获取函数：一个用于获取数据的异步函数。
- 使用 useInfiniteQuery 钩子：将数据获取函数和查询键传递给 useInfiniteQuery。
- 渲染数据：根据查询结果渲染数据，并在需要时触发下一页加载。


假设我们有一个 API 端点 /api/posts，它支持分页查询。

步骤1：定义数据获取函数

```typescript
const fetchPosts = async ({ pageParam = 0 }) => {
  const response = await fetch(`/api/posts?page=${pageParam}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
```

步骤2：使用 useInfiniteQuery 钩子
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const Posts = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['posts'],
    fetchPosts,
    {
      getNextPageParam: (lastPage, allPages) => lastPage.nextPage ?? false,
    }
  );

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Posts</h1>
      {data.pages.map((page) =>
        page.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No More Posts'}
      </button>
    </div>
  );
};
```

参数和选项
    查询键（Query Key）：['posts'] 是查询的唯一标识符。
    数据获取函数：fetchPosts 用于获取数据。
    配置选项：
        getNextPageParam：指定如何获取下一页的参数。这里使用 lastPage.nextPage 判断是否还有下一页。
钩子的返回值
    data：包含所有已加载的数据页。
    error：如果请求出错，包含错误信息。
    fetchNextPage：一个函数，用于触发下一页数据的加载。
    hasNextPage：一个布尔值，指示是否还有下一页数据。
    isFetchingNextPage：一个布尔值，指示下一页数据是否正在加载。
    status：当前查询的状态（loading、error、success）

## useMutation

useMutation 是 @tanstack/react-query 提供的一个钩子，用于管理数据的修改操作（例如创建、更新、删除）。**主要用于修改数据**

useMutation 函数的参数主要有两个：一个是执行变更操作的函数（mutationFn），另一个是可选的配置对象。

### mutationFn

是一个函数，用于执行数据的修改操作，例如创建、更新、删除等。这个函数需要返回一个 Promise。

```typescript
const mutationFn = async (data) => {
  const response = await axios.post('/api/resource', data);
  return response.data;
};
```

### 配置对象

配置对象用于设置一些钩子函数和选项，这些钩子函数可以在操作的不同阶段调用。主要属性有：

- onSuccess：操作成功时调用。
- onError：操作失败时调用。
- onSettled：操作无论成功还是失败都会调用。
- onMutate：操作开始之前调用，可以用来乐观更新数据。

> 乐观更新数据：它假设操作会成功，在服务器响应之前立即更新 UI。
> 对于大多数情况下会成功的操作，乐观更新可以显著提高响应速度和用户体验。然而，确实存在操作失败需要回滚的风险，可能会导致用户体验不佳。
> 适用的场景：
> 1 - 高成功率操作：例如，点赞、收藏、简单表单提交等。
> 2 - 可容忍短暂不一致的操作：例如，评论区的评论发布、列表中的项删除等。
> 对于高风险或失败概率较高的操作，可以使用加载指示器（loading）来提示用户操作正在进行中。

```typescript
const config = {
  onSuccess: (data, variables, context) => {
    console.log('Success:', data);
  },
  onError: (error, variables, context) => {
    console.error('Error:', error);
  },
  onSettled: (data, error, variables, context) => {
    console.log('Settled:', { data, error });
  },
  onMutate: (variables) => {
    console.log('Mutate:', variables);
    return { previousData: 'someData' };
  },
};
```

`useMutation` 返回对象的主要属性

1. mutate：用于触发变更操作的函数。
2. mutateAsync：用于以异步方式触发变更操作的函数。
3. status：表示当前变更操作的状态，可以是 idle、loading、error 或 success。
4. data：变更操作成功时返回的数据。
5. error：变更操作失败时返回的错误。
6. isIdle：布尔值，表示变更操作是否处于空闲状态。
7. isLoading：布尔值，表示变更操作是否正在进行。
8. isError：布尔值，表示变更操作是否失败。
9. isSuccess：布尔值，表示变更操作是否成功。
10. reset：重置变更操作的状态。

useMutation 和 useQuery 这些方法是如何知道请求状态的？
> useMutation 和 useQuery 依靠传递给它们的函数返回的 Promise 来确定请求的状态。这些钩子会自动处理 Promise 的状态，并相应地更新内部的状态属性。
> 请求状态管理：useQuery 和 useMutation 使用 Promise 的状态（pending、fulfilled、rejected）来更新组件的状态。

useMutation 分为两个部分（定义和执行）

```typescript
// 定义 useMutation
const mutation = useMutation(postDataFunction, {
onSuccess: () => {
  // 在变更成功后重新获取数据
  queryClient.invalidateQueries('dataKey');
}
});
```

参数1：是突变过程中需要执行的函数。
参数2：是突变的一些回调设置，如 onSuccess、onError 等。

```typescript
// 手动触发突变操作
await mutation.mutateAsync({ key: inputValue });
```

- useMutation 的定义部分只会设置好突变操作及其回调。
- 你需要通过 mutate 或 mutateAsync 手动触发突变操作。
- 如果不手动触发，突变操作不会执行。

> 也就是说 useMutation 需要定义并且执行，才能正确使用
> 为什么？useMutation 的设计目标是处理需要用户交互或特定事件触发的突变操作。例如，表单提交、按钮点击等。因为这些操作往往是用户触发的行为，所以需要手动调用 mutate 或 mutateAsync 来执行。

useQuery却能做到自动触发这是为什么？

useQuery 之所以能自动触发，是因为它的设计目标就是在组件挂载时自动获取数据。

1. 自动执行：当组件挂载时，useQuery 会立即执行你传入的获取数据的函数。这使得数据能够自动加载，而不需要额外的手动触发。
2. 内部管理状态：useQuery 会自动管理数据获取的状态，包括加载状态、错误状态和数据状态。这使得你可以轻松地在组件中使用这些状态来控制 UI 显示。

useQuery通过第一个参数去传递 `['dataKey', { search, page }], // 查询键`

### useQuery 和 useMutation 的区别和共性

`useQuery`

- 用途：主要用于获取数据。
- 自动执行：在组件挂载时自动执行。
- 传递参数：通过查询键（第一个参数中的数组）传递参数，通常使用组件内的状态来动态改变参数。
- 结构出状态：可以解构出异步状态（如 data, error, isLoading, isFetching）。
- 配置项：通过第三个参数传递配置项，控制查询行为。

```typescript
const { data, error, isLoading } = useQuery(['dataKey', { search, page }], fetchDataFunction, {
  staleTime: 1000 * 60 * 5,
  cacheTime: 1000 * 60 * 10,
});
```

`useMutation`

- 用途：主要用于变更数据（创建、更新、删除）。
- 手动触发：定义和执行是分开的，需要通过 mutate 或 mutateAsync 手动触发。
- 传递参数：在调用 mutate 或 mutateAsync 时传递参数，通常是在事件处理器中触发。
- 结构出状态：可以解构出异步状态（如 isSuccess, isError, isLoading）。
- 配置项：通过第二个参数传递配置项，控制突变行为。

```typescript
const mutation = useMutation(postDataFunction, {
  onSuccess: () => {
    queryClient.invalidateQueries('dataKey');
  },
});

mutation.mutate({ key: inputValue });
```

共性

- 异步状态管理：都可以解构出异步状态，如成功、失败、进行中、获取的数据等。
- 灵活配置：通过配置项可以灵活地控制查询和突变的行为。
- 结合使用：可以结合使用，以在数据变更后重新获取数据。

```typescript
export const useSignIn = () => {
  const { t } = useTranslation(); // 国际化翻译函数
  const navigatge = useNavigate(); // 导航
  const { notification, message } = App.useApp(); // 获取通知和消息处理函数
  const { setUserToken, setUserInfo } = useUserActions(); // 用于设置用户信息和令牌的动作

  // 定义 signInMutation 通过 useMutation
  const signInMutation = useMutation(userService.signin);

  // 定义一个 signIn 异步函数
  const signIn = async (data: SignInReq) => {
    try {
      // 手动触发突变操作，并传递数据(登录突变操作)
      const res = await signInMutation.mutateAsync(data);
      const { user, accessToken, refreshToken } = res;

      // 设置用户令牌和信息
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      // 导航到首页，并替换历史记录
      navigatge(HOMEPAGE, { replace: true });

      // 显示登录成功通知
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${data.username}`,
        duration: 3,
      });
    } catch (err) {
      // 处理登录失败，显示警告消息
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };
  // 使用 useCallback 来缓存 signIn 函数，依赖项为空数组表示只创建一次
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};

```

## userService

定义用户身份验证和用户信息相关API调用

```typescript
// 定义登录请求的接口
export interface SignInReq {
  username: string;
  password: string;
}

// 定义注册请求的接口，继承登录请求的接口
export interface SignUpReq extends SignInReq {
  email: string;
}

// 定义登录响应的类型，包含用户令牌和用户信息
export type SignInRes = UserToken & { user: UserInfo };

// 定义用户相关的 API 路径
export enum UserApi {
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}
```

signin：登录
signup：注册

```typescript
// 定义登录请求函数
const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
// 定义注册请求函数
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
// 定义登出请求函数
const logout = () => apiClient.get({ url: UserApi.Logout });
// 定义根据用户ID获取用户信息的请求函数
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
  signin,
  signup,
  findById,
  logout,
};

```
