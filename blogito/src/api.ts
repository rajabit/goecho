const defaultHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  Accept: "application/json; charset=utf-8",
};

const Methods = {
  Login: "/api/auth/login",
  Register: "/api/auth/register",
  User: "/api/auth/user",
  Home: "/api",
  AdminPostIndex: "/api/admin/posts",
};

const requestBuilder = (
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any
): RequestInit => {
  let req: RequestInit = {
    method: method,
    headers: {
      ...defaultHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : null,
  };
  return req;
};

const urlBuilder = (method: string, params?: any): string => {
  const queryString = new URLSearchParams(params).toString();
  if (params === undefined) {
    return `${method}`;
  }
  return `${method}?${queryString}`;
};

const get = async (url: string, params?: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      urlBuilder(url, params),
      requestBuilder("GET")
    );
    if (response.ok) return resolve(await response.json());
    else return reject(response);
  });
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

const user = async (): Promise<UserResponse> => {
  return (await get(Methods.User)) as UserResponse;
};

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
  user,
  login,
  register,
};

export type { UserResponse };
export default api;
