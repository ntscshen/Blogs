---
title: "apiClient - axios"
summary: "axios"
date: "2024-05-29"
draft: false
tags:
- axios
---

## axios

```typescript
import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { isEmpty } from 'ramda';

import { t } from '@/locales/i18n';

import { Result } from '#/api';
import { ResultEnum } from '#/enum';
```

antd：从 antd 库中导入 message 用于显示全局错误信息。
axios：导入 axios 及其类型定义，用于发送 HTTP 请求。
ramda：导入 isEmpty 用于检查错误消息是否为空。
i18n：导入国际化函数 t 用于获取本地化的错误信息。
Result 和 ResultEnum：导入自定义类型和枚举，用于处理 API 响应。

```typescript
export interface Result<T = any> {
  status: number;
  message: string;
  data?: T;
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
  TIMEOUT = 401,
}
```

```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});
```

baseURL：设置基础 URL，从环境变量中获取。
timeout：请求超时时间设置为 50000 毫秒（50 秒）。
headers：默认请求头，设置内容类型为 application/json;charset=utf-8。

请求拦截器

```typescript
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer Token';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
```

请求拦截器：在请求发送之前，可以对请求进行处理，例如添加 Authorization 头部。
错误处理：请求错误时，返回一个被拒绝的 Promise。

响应拦截器

```typescript
axiosInstance.interceptors.response.use(
  // 成功处理部分
  (res: AxiosResponse<Result>) => {
    // 如果响应没有数据，抛出一个错误，并显示国际化的错误信息 sys.api.apiRequestFailed(请求出错，请稍后重试)
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));
    // 从响应数据中解构 status、data 和 message。
    const { status, data, message } = res.data;
    // 检查 data 是否存在，响应数据中是否包含 status 属性，并且 status 是否等于 ResultEnum.SUCCESS === 0。
    const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }
    // 如果业务逻辑失败，抛出一个错误，并显示响应中的 message 或默认的国际化错误信息 sys.api.apiRequestFailed(请求出错，请稍后重试)
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  // 错误处理部分
  (error: AxiosError<Result>) => {
    // 从错误对象中解构出 response 和 message 属性。如果错误对象不存在，则使用空对象作为默认值。
    const { response, message } = error || {};
    // 初始化一个空的错误消息变量 errMsg。
    let errMsg = '';
    try {
      // 使用可选链操作符 (?.) 和逻辑或操作符 (||) 尝试获取 response.data.message 或 message 作为错误消息。
      errMsg = response?.data?.message || message;
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    if (isEmpty(errMsg)) {
      // 使用 isEmpty 函数检查错误消息是否为空。如果为空，则使用国际化函数 t 获取默认的错误消息 sys.api.errorMessage（操作失败，系统异常！）。
      errMsg = t('sys.api.errorMessage');
    }
    // 使用 antd 库的 Message.error 方法显示错误消息。
    Message.error(errMsg);
    // 返回一个被拒绝的 Promise，确保调用该请求的代码能够正确处理错误。
    return Promise.reject(error);
  },
);
```

可选链操作符 (?.)：如果 response 或 response.data 为 null 或 undefined，则不会引发错误，而是返回 undefined。
逻辑或操作符 (||)：如果 response.data.message 不存在，则使用 message。


### Reflect.has

Reflect.has 是 JavaScript 的一个原生方法。它是 Reflect 对象的一部分，Reflect 对象提供了一些与对象操作相关的静态方法，这些方法与现有的对象操作方法类似，但通常更加统一和规范。Reflect.has(target, propertyKey) 方法用于判断对象 target 是否具有某个属性 propertyKey。它的行为与 in 操作符类似，但作为函数使用更灵活。

```typescript
const obj = {
  name: 'John',
  age: 30,
};

console.log(Reflect.has(obj, 'name')); // true
console.log(Reflect.has(obj, 'gender')); // false
```

```typescript
const obj = {
  name: 'John',
};

console.log('name' in obj); // true
console.log(Reflect.has(obj, 'name')); // true
```

## axios中的必学必会的方法有哪些？

Axios 是一个基于 Promise 的 HTTP 客户端，适用于浏览器和 Node.js。它提供了一个简洁的 API，用于执行各种 HTTP 请求（如 GET、POST、PUT、DELETE），并自动处理 JSON 数据转换。Axios 的主要目标是简化与 HTTP 服务器交互的过程，使得发送请求和处理响应更加直观和高效。

基本请求方法

1. axios.get(url[, config])：发送 GET 请求。
2. axios.post(url[, data[, config]])：发送 POST 请求。
3. axios.put(url[, data[, config]])：发送 PUT 请求。
4. axios.delete(url[, config])：发送 DELETE 请求。

创建实例

- axios.create(config)：创建一个新的 Axios 实例，带有自定义配置。

拦截器

1. axios.interceptors.request.use(onFulfilled, onRejected)：添加请求拦截器。
2. axios.interceptors.response.use(onFulfilled, onRejected)：添加响应拦截器。

取消请求

- axios.CancelToken：用于创建取消令牌，以便在需要时取消请求。

### AxiosRequestConfig 请求配置对象 ， AxiosError 错误对象，AxiosResponse 响应对象

```typescript
import { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  url: '/user',
  method: 'get', // 请求方法
  baseURL: 'https://api.example.com', // 基础 URL
  headers: { 'X-Requested-With': 'XMLHttpRequest' }, // 自定义请求头
  params: { ID: 12345 }, // URL 参数
  data: { key: 'value' }, // 请求体数据（POST、PUT等请求）
  timeout: 1000, // 请求超时时间
  responseType: 'json', // 响应数据类型
  // 其他配置选项...
};
```

这是 Axios 的错误对象，用于捕获和处理请求中的错误。

```typescript
import { AxiosError } from 'axios';

axios.get('/user/12345')
  .catch((error: AxiosError) => {
    if (error.response) {
      // 服务器返回了一个状态码，但不是在 2xx 范围内
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.log(error.request);
    } else {
      // 发送请求时出现了一些问题
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

```typescript
import { AxiosResponse } from 'axios';

axios.get('/user/12345')
  .then((response: AxiosResponse) => {
    console.log(response.data); // 响应数据
    console.log(response.status); // 响应状态码
    console.log(response.statusText); // 响应状态文本
    console.log(response.headers); // 响应头
    console.log(response.config); // 请求配置
  });
```

## APIClient类

定义了一个 APIClient 类，用于封装 axios 的 HTTP 请求。这个类提供了常见的 HTTP 请求方法（GET、POST、PUT、DELETE），并通过一个通用的 request 方法来处理所有请求。

```typescript
class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
```

```typescript
class APIClient {
  // 方法定义...
}

export default new APIClient();
```

APIClient 类提供了常见的 HTTP 请求方法，并将其实例导出，以便在其他模块中使用。

```typescript
get<T = any>(config: AxiosRequestConfig): Promise<T> {
  return this.request({ ...config, method: 'GET' });
}
```

作用：发送 GET 请求。
参数：接受一个 AxiosRequestConfig 对象作为请求配置。
返回值：返回一个 Promise，其解析值为请求响应数据。

```typescript
post<T = any>(config: AxiosRequestConfig): Promise<T> {
  return this.request({ ...config, method: 'POST' });
}
```

作用：发送 POST 请求。
参数：接受一个 AxiosRequestConfig 对象作为请求配置。
返回值：返回一个 Promise，其解析值为请求响应数据。

```typescript
put<T = any>(config: AxiosRequestConfig): Promise<T> {
  return this.request({ ...config, method: 'PUT' });
}
```

作用：发送 PUT 请求。
参数：接受一个 AxiosRequestConfig 对象作为请求配置。
返回值：返回一个 Promise，其解析值为请求响应数据。

```typescript
delete<T = any>(config: AxiosRequestConfig): Promise<T> {
  return this.request({ ...config, method: 'DELETE' });
}
```

作用：发送 DELETE 请求。
参数：接受一个 AxiosRequestConfig 对象作为请求配置。
返回值：返回一个 Promise，其解析值为请求响应数据。

### 通用请求方法 request

```typescript
request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request<any, AxiosResponse<Result>>(config)
      .then((res: AxiosResponse<Result>) => {
        resolve(res as unknown as Promise<T>);
      })
      .catch((e: Error | AxiosError) => {
        reject(e);
      });
  });
}
```

作用：处理所有类型的 HTTP 请求。
参数：接受一个 AxiosRequestConfig 对象作为请求配置。
返回值：返回一个 Promise，其解析值为请求响应数据。
内部逻辑：
  调用 axiosInstance.request 发送请求。
  如果请求成功，解析响应并将其解析值传递给 resolve。
  如果请求失败，将错误传递给 reject。

### axios.request 方法

axiosInstance.request 是 Axios 提供的一个底层方法，所有具体的 HTTP 方法（如 get、post、put、delete 等）都是基于这个 request 方法实现的。通过 request 方法，你可以发送任意类型的 HTTP 请求，并配置所有的请求选项。

axios.request 是 Axios 的一个通用请求方法，可以用于发送各种 HTTP 请求。它接受一个配置对象作为参数，允许你设置请求的 URL、方法、头部、数据、参数等。

你可以使用 axios.request 方法来发送各种 HTTP 请求，比如 GET、POST、PUT 和 DELETE。这些具体的请求方法其实都是对 axios.request 方法的封装。

```typescript
import axios from 'axios';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 发送 GET 请求
axiosInstance.request({
  url: '/user',
  method: 'GET',
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

// 发送 POST 请求
axiosInstance.request({
  url: '/user',
  method: 'POST',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com'
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});
```

```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});
```

baseURL：设置请求的基础 URL，所有请求的 URL 都会基于这个基础 URL。
timeout：设置请求超时时间，单位为毫秒。
headers：设置默认的请求头，这里设置了 Content-Type 为 application/json;charset=utf-8。
通过 axios.create 创建的 axiosInstance 是一个带有自定义配置的 Axios 实例，之后可以通过这个实例发送请求。

```typescript
axiosInstance
  .request<any, AxiosResponse<Result>>(config)
  .then((res: AxiosResponse<Result>) => {
    resolve(res as unknown as T);
  })
  .catch((e: Error | AxiosError) => {
    reject(e);
  });
```

config：一个包含请求配置的对象，类型为 AxiosRequestConfig，可以包含 URL、方法、头部、数据等。
request 方法：发送 HTTP 请求，根据 config 中的配置决定请求的具体类型（GET、POST 等）。
axiosInstance.request 方法的核心作用是根据传入的配置对象发送 HTTP 请求，无论是 GET 请求、POST 请求还是其他请求类型。

为什么使用 request 方法

统一接口：通过 request 方法，可以使用一个统一的接口来处理各种 HTTP 请求，使代码更简洁和一致。
增强灵活性：request 方法可以根据配置对象动态决定请求类型（GET、POST、PUT、DELETE 等），提高了代码的灵活性。
集中处理逻辑：在 request 方法中可以集中处理请求的响应和错误，避免在每个请求方法中重复编写相同的逻辑。
扩展性：如果需要添加额外的功能（如日志记录、特殊的错误处理等），只需修改 request 方法即可，无需修改每个请求方法。

> axiosInstance.request 方法是 Axios 提供的底层方法，所有具体的 HTTP 方法（如 get、post、put、delete）都是基于这个方法实现的。通过封装 request 方法，可以实现统一的请求处理逻辑，提高代码的灵活性和可维护性。
