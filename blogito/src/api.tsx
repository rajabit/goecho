import { resolve } from "path";

const BASE_API = process.env.APP_URL || "http://localhost:1323";

const defaultHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  Accept: "application/json; charset=utf-8",
};

const Methods = {
  Login: "/auth/login",
  Register: "/auth/register",
  User: "/auth/user",
  Home: "/",
  AdminPostIndex: "/admin/posts",
};

const requestBuilder = (
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any
): RequestInit => {
  let req: RequestInit = {
    method: method,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: body !== undefined ? JSON.stringify(body) : null,
  };
  return req;
};

const urlBuilder = (method: string, params?: any): string => {
  const queryString = new URLSearchParams(params).toString();
  if (params === undefined) {
    return `${BASE_API}${method}`;
  }
  return `${BASE_API}${method}?${queryString}`;
};

const get = async (url: string, params?: any): Promise<any> => {
  const response = await fetch(urlBuilder(url, params), requestBuilder("GET"));
  return await response.json();
};

const post = async (url: string, body?: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(urlBuilder(url), requestBuilder("POST", body));
    if (response.ok) return resolve(await response.json());
    else return reject(response);
  });
};

const put = async (url: string, body?: any): Promise<any> => {
  const response = await fetch(urlBuilder(url), requestBuilder("PUT", body));
  return await response.json();
};

const del = async (url: string, params?: any): Promise<any> => {
  const response = await fetch(
    urlBuilder(url, params),
    requestBuilder("DELETE")
  );
  return await response.json();
};

// API Requests
// ===============================================================================

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UserResponse {
  ID: bigint;
  Name: string;
  Email: string;
  Status: string;
  Type: string;
  Token?: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

const login = async ({
  email,
  password,
}: LoginRequest): Promise<UserResponse> => {
  return (await post(Methods.Login, {
    email,
    password,
  })) as UserResponse;
};

const register = async ({
  name,
  email,
  password,
  password_confirmation,
}: RegisterRequest): Promise<UserResponse> => {
  return (await post(Methods.Register, {
    name,
    email,
    password,
    password_confirmation,
  })) as UserResponse;
};

const api = {
  login,
  register,
};

export default api;
