import axios, { AxiosRequestConfig } from "axios";

export default class AxiosUtils {
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TopResult<T>> {
    const p = axios.get(url, config) as Promise<any>;
    const rsp: TopResult<T> = await p;
    return rsp;
  }
  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<TopResult<T>> {
    const p = axios.post(url, data, config) as Promise<any>;
    const rsp: TopResult<T> = await p;
    return rsp;
  }
}

interface TopResult<T = any> {
  code: number;
  msg?: string;
  result?: T;
}