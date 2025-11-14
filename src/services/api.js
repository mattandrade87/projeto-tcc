// Centralized API service using axios
import axios from "axios";

// ✅ Lê apenas o BASE_URL do ambiente
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Token e role stores
const tokenStore = {
  get: () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
  set: (t) =>
    typeof window !== "undefined" &&
    localStorage.setItem("auth_token", t || ""),
  clear: () =>
    typeof window !== "undefined" && localStorage.removeItem("auth_token"),
};

const roleStore = {
  get: () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_role") : null,
  set: (r) =>
    typeof window !== "undefined" && localStorage.setItem("auth_role", r || ""),
  clear: () =>
    typeof window !== "undefined" && localStorage.removeItem("auth_role"),
};

// ✅ Cria o cliente Axios principal
export const apiClient = axios.create({
  baseURL: BASE_URL, // Ex: https://pi-contrucaocivil.onrender.com
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Intercepta e injeta o token JWT se existir
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err?.message || "Erro desconhecido";
    return Promise.reject({ ...err, message });
  }
);

// ✅ APIs
export const AuthAPI = {
  login: async (payload) => {
    console.log("Payload recebido:", payload); // Verifica email e password recebidos

    // Envio para o Supabase
    const supabaseResp = await axios.post(
      "https://pi-contrucaocivil.onrender.com/public/auth/login",
      { email: payload.email, password: payload.password },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_KEY,
        },
      }
    );

    console.log("Resposta do Supabase:", supabaseResp.data); // Verifica resposta do Supabase

    return supabaseResp.data;
  },
  recoverPassword: async (payload) => {
    const { data } = await apiClient.post(
      "/public/auth/recover-password",
      payload
    );
    return data;
  },
  updatePassword: async (payload) => {
    const { data } = await apiClient.patch("/common/auth/update-password", {
      password: payload.password,
    });
    return data;
  },
  registerAdmin: async (payload) => {
    const { data } = await apiClient.post(
      "/admin/auth/register/new-admin",
      payload
    );
    return data;
  },
  registerUser: async (payload) => {
    const { data } = await apiClient.post(
      "/admin/auth/register/new-user",
      payload
    );
    return data;
  },
  // Supabase Auth direto
  supabaseSignup: async (payload) => {
    const resp = await axios.post(
      "https://ssfurhkqaoyuaqwzsvnx.supabase.co/auth/v1/signup",
      {
        email: payload.email,
        password: payload.password,
        data: {
          first_name: payload.firstName || "",
          last_name: payload.lastName || "",
          display_name: payload.displayName || "",
          role: payload.role || "USER",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_KEY,
        },
      }
    );
    return resp.data;
  },
  supabaseAdminUsers: async () => {
    const resp = await axios.get(
      "https://ssfurhkqaoyuaqwzsvnx.supabase.co/auth/v1/admin/users",
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_KEY,
        },
      }
    );
    return resp.data;
  },
};

export const UserAPI = {
  getMe: async () => {
    const { data } = await apiClient.get("/common/user");
    return data;
  },
  updateMe: async (payload) => {
    const { data } = await apiClient.patch("/common/user", payload);
    return data;
  },
};

export const AdminAPI = {
  listUsers: async () => {
    const { data } = await apiClient.get("/admin/user/get-all");
    return data;
  },
  getUserById: async (id) => {
    const { data } = await apiClient.get(`/admin/user/${id}`);
    return data;
  },
  updateUserById: async (id, payload) => {
    const { data } = await apiClient.patch(`/admin/user/${id}`, payload);
    return data;
  },
};

export const ClockingAPI = {
  getToday: async () => {
    const { data } = await apiClient.get("/common/clocking/today");
    return data;
  },
  getHistory: async () => {
    const { data } = await apiClient.get("/common/clocking/history");
    return data;
  },
  startWork: async (time) => {
    const { data } = await apiClient.post("/common/clocking/punch/start-work", {
      time,
    });
    return data;
  },
  startLunch: async (time) => {
    const { data } = await apiClient.post(
      "/common/clocking/punch/start-lunch",
      { time }
    );
    return data;
  },
  endLunch: async (time) => {
    const { data } = await apiClient.post("/common/clocking/punch/end-lunch", {
      time,
    });
    return data;
  },
  endWork: async (time) => {
    const { data } = await apiClient.post("/common/clocking/punch/end-work", {
      time,
    });
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/admin/clocking/${id}`);
    return data;
  },
  getByUser: async (userId) => {
    const { data } = await apiClient.get(`/admin/clocking/user/${userId}`);
    return data;
  },
  getByStatus: async (status) => {
    const { data } = await apiClient.get(`/admin/clocking/status`, {
      params: { name: status },
    });
    return data;
  },
  reject: async (id) => {
    const { data } = await apiClient.post(`/admin/clocking/reject/${id}`);
    return data;
  },
  approve: async (id) => {
    const { data } = await apiClient.post(`/admin/clocking/approve/${id}`);
    return data;
  },
};

// Armazena tokens/roles
export const AuthStorage = { tokenStore, roleStore };

// Exporta tudo
const api = {
  client: apiClient,
  AuthAPI,
  UserAPI,
  AdminAPI,
  ClockingAPI,
  AuthStorage,
};

export default api;
