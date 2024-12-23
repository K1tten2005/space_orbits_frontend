/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUpdateOrbit {
  /** ID */
  id?: number;
  /**
   * Высота орбиты
   * @min -2147483648
   * @max 2147483647
   */
  height: number;
  /**
   * Тип орбиты
   * @minLength 1
   * @maxLength 75
   */
  type: string;
  /**
   * Полное описание
   * @minLength 1
   */
  full_description: string;
  /**
   * Короткое описание
   * @minLength 1
   * @maxLength 200
   */
  short_description: string;
}

export interface Orbit {
  /** ID */
  id?: number;
  /**
   * Высота орбиты
   * @min -2147483648
   * @max 2147483647
   */
  height: number;
  /**
   * Тип орбиты
   * @minLength 1
   * @maxLength 75
   */
  type: string;
  /**
   * Полное описание
   * @minLength 1
   */
  full_description: string;
  /**
   * Короткое описание
   * @minLength 1
   * @maxLength 200
   */
  short_description: string;
  /**
   * Изображение
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  image?: string | null;
}

export interface SingleOrbit {
  /** ID */
  id?: number;
  /**
   * Высота орбиты
   * @min -2147483648
   * @max 2147483647
   */
  height: number;
  /**
   * Тип орбиты
   * @minLength 1
   * @maxLength 75
   */
  type: string;
  /**
   * Полное описание
   * @minLength 1
   */
  full_description: string;
  /**
   * Короткое описание
   * @minLength 1
   * @maxLength 200
   */
  short_description: string;
  /**
   * Изображение
   * @format uri
   * @minLength 1
   * @maxLength 200
   */
  image?: string | null;
  /** Статус */
  status?: true | false;
}

export interface Transition {
  /** ID */
  id?: number;
  /**
   * Запланированная дата
   * @format date
   */
  planned_date?: string | null;
  /** Запланированное время */
  planned_time?: string | null;
  /**
   * Космический аппарат
   * @minLength 1
   * @maxLength 50
   */
  spacecraft?: string | null;
  /** User */
  user?: string;
  /** Moderator */
  moderator?: string;
  /** Статус */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Дата создания перехода
   * @format date
   */
  creation_date: string;
  /**
   * Дата формирования перехода
   * @format date
   */
  formation_date?: string | null;
  /**
   * Дата завершения перехода
   * @format date
   */
  completion_date?: string | null;
  /**
   * Самая высокая орбита
   * @min -2147483648
   * @max 2147483647
   */
  highest_orbit?: number | null;
}

export interface OrbitTransition {
  /** ID */
  id?: number;
  /**
   * Позиция
   * @min -2147483648
   * @max 2147483647
   */
  position: number;
  /** Орбита */
  orbit: number;
  /** Переход */
  transition: number;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string;
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Staff status
   * Designates whether the user can log into this admin site.
   * @default false
   */
  is_staff?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Orbit transitions API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000/api
 * @contact <nikvop05@mail.ru>
 *
 * API for orbit transitions
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  orbits = {
    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsList
     * @request GET:/orbits/
     * @secure
     */
    orbitsList: (
      query?: {
        /** Фильтрация орбит по высоте (начало строки) */
        orbit_height?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Список орбит */
          orbits?: object[];
          /** ID черновика перехода, если существует */
          draft_transition?: number | null;
          /** Количество орбит в черновике */
          orbits_to_transfer?: number | null;
        },
        void
      >({
        path: `/orbits/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsCreateCreate
     * @request POST:/orbits/create/
     * @secure
     */
    orbitsCreateCreate: (data: CreateUpdateOrbit, params: RequestParams = {}) =>
      this.request<Orbit, void>({
        path: `/orbits/create/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsRead
     * @request GET:/orbits/{orbit_id}/
     * @secure
     */
    orbitsRead: (orbitId: string, params: RequestParams = {}) =>
      this.request<SingleOrbit, void>({
        path: `/orbits/${orbitId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsAddToTransitionCreate
     * @request POST:/orbits/{orbit_id}/add_to_transition/
     * @secure
     */
    orbitsAddToTransitionCreate: (orbitId: string, params: RequestParams = {}) =>
      this.request<Transition, void>({
        path: `/orbits/${orbitId}/add_to_transition/`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsDeleteDelete
     * @request DELETE:/orbits/{orbit_id}/delete/
     * @secure
     */
    orbitsDeleteDelete: (orbitId: string, params: RequestParams = {}) =>
      this.request<Orbit[], void>({
        path: `/orbits/${orbitId}/delete/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsUpdateUpdate
     * @request PUT:/orbits/{orbit_id}/update/
     * @secure
     */
    orbitsUpdateUpdate: (orbitId: string, data: CreateUpdateOrbit, params: RequestParams = {}) =>
      this.request<Orbit, void>({
        path: `/orbits/${orbitId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags orbits
     * @name OrbitsUpdateImageCreate
     * @request POST:/orbits/{orbit_id}/update_image/
     * @secure
     */
    orbitsUpdateImageCreate: (
      orbitId: string,
      data: {
        /**
         * Новое изображение для орбиты
         * @format binary
         */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Orbit, void>({
        path: `/orbits/${orbitId}/update_image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  transitions = {
    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsList
     * @request GET:/transitions/
     * @secure
     */
    transitionsList: (
      query?: {
        /** Фильтр по статусу перехода */
        status?: string;
        /**
         * Начальная дата формирования (формат: YYYY-MM-DDTHH:MM:SS)
         * @format date-time
         */
        date_formation_start?: string;
        /**
         * Конечная дата формирования (формат: YYYY-MM-DDTHH:MM:SS)
         * @format date-time
         */
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Transition[], void>({
        path: `/transitions/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsRead
     * @request GET:/transitions/{transition_id}/
     * @secure
     */
    transitionsRead: (transitionId: string, params: RequestParams = {}) =>
      this.request<
        {
          /** ID */
          id?: number;
          /** Orbits to transfer */
          orbits_to_transfer?: number;
          /** Owner */
          user?: string;
          /** Orbits */
          orbits?: {
            id?: number;
            height?: number;
            type?: string;
            full_description?: string;
            short_description?: string;
            /** @format uri */
            image?: string;
          }[];
          /**
           * Запланированная дата перехода
           * @format date
           */
          planned_date?: string | null;
          /**
           * Запланированное время перехода
           * @format date
           */
          planned_time?: string | null;
          /**
           * Название космического аппарата
           * @maxLength 50
           */
          spacecraft?: string | null;
          /** Moderator */
          moderator?: string | null;
          /** Статус */
          status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
          /**
           * Дата создания
           * @format date-time
           */
          creation_date?: string;
          /**
           * Дата формирования
           * @format date-time
           */
          formation_date?: string | null;
          /**
           * Дата завершения
           * @format date-time
           */
          completion_date?: string | null;
          /** Самая высокая орбита */
          highest_orbit?: number | null;
        },
        void
      >({
        path: `/transitions/${transitionId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsDeleteDelete
     * @request DELETE:/transitions/{transition_id}/delete/
     * @secure
     */
    transitionsDeleteDelete: (transitionId: string, params: RequestParams = {}) =>
      this.request<Transition, void>({
        path: `/transitions/${transitionId}/delete/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsDeleteOrbitFromTransitionDelete
     * @request DELETE:/transitions/{transition_id}/delete_orbit_from_transition/{orbit_id}/
     * @secure
     */
    transitionsDeleteOrbitFromTransitionDelete: (transitionId: string, orbitId: string, params: RequestParams = {}) =>
      this.request<Orbit[], void>({
        path: `/transitions/${transitionId}/delete_orbit_from_transition/${orbitId}/`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsUpdateUpdate
     * @request PUT:/transitions/{transition_id}/update/
     * @secure
     */
    transitionsUpdateUpdate: (
      transitionId: string,
      data: {
        /**
         * Запланированная дата отправки (формат: YYYY-MM-DDTHH:MM:SS)
         * @format date-time
         */
        planned_date?: string;
        /**
         * Запланированная дата отправки (HH:MM:SS)
         * @format date-time
         */
        planned_time?: string;
        /** Название космического аппарата, соверщающего переход */
        spacecraft?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Transition, void>({
        path: `/transitions/${transitionId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsUpdateOrbitTransitionUpdate
     * @request PUT:/transitions/{transition_id}/update_orbit_transition/{orbit_id}/
     * @secure
     */
    transitionsUpdateOrbitTransitionUpdate: (transitionId: string, orbitId: string, params: RequestParams = {}) =>
      this.request<OrbitTransition, void>({
        path: `/transitions/${transitionId}/update_orbit_transition/${orbitId}/`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsUpdateStatusAdminUpdate
     * @request PUT:/transitions/{transition_id}/update_status_admin/
     * @secure
     */
    transitionsUpdateStatusAdminUpdate: (
      transitionId: string,
      data: {
        /** Новый статус перехода ('completed' для завершения, 'rejected' для отклонения) */
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Transition, void>({
        path: `/transitions/${transitionId}/update_status_admin/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags transitions
     * @name TransitionsUpdateStatusUserUpdate
     * @request PUT:/transitions/{transition_id}/update_status_user/
     * @secure
     */
    transitionsUpdateStatusUserUpdate: (transitionId: string, params: RequestParams = {}) =>
      this.request<Transition, void>({
        path: `/transitions/${transitionId}/update_status_user/`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (
      data: {
        /** username */
        username: string;
        /** password */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        User,
        {
          error?: string;
        }
      >({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: User, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/update/
     * @secure
     */
    usersUpdateUpdate: (data: User, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
