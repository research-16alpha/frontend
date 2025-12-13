import { api } from "../../../libs/axiosClient";
import { cleanApiBase } from "../../../config/api";

// ---------------------------------------
// Register with email and password
// ---------------------------------------
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  google_id?: string;
  created_at?: string;
  favourites?: string[];
  bag?: string[];
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<User>("/users/register", data);
  // Backend returns User directly, create AuthResponse format
  const user = res.data;
  
  // Validate that user._id is present - it's the primary key
  if (!user._id) {
    throw new Error("User ID is missing from registration response");
  }
  
  return {
    jwt_token: "", // Backend doesn't return JWT yet, will be added later
    user: {
      _id: user._id, // User ID is required - primary key
      name: user.name || "",
      email: user.email || "",
      avatar: user.avatar,
    },
  };
};

// ---------------------------------------
// Login with email and password
// ---------------------------------------
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<User>("/users/login", data);
  // Backend returns User directly, create AuthResponse format
  const user = res.data;
  console.log("login response from backend", user);
  
  // Validate that user._id is present - it's the primary key
  if (!user._id) {
    throw new Error("User ID is missing from login response");
  }
  
  return {
    jwt_token: "", // Backend doesn't return JWT yet, will be added later
    user: {
      _id: user._id, // User ID is required - primary key
      name: user.name || "",
      email: user.email || "",
      avatar: user.avatar,
    },
  };
};

// ---------------------------------------
// Redirect user to Google login
// ---------------------------------------
export const loginWithGoogle = () => {
  try {
    const googleLoginUrl = `${cleanApiBase}/auth/google/login`;
    window.location.href = googleLoginUrl;
  } catch (error) {
    console.error('Error initiating Google login:', error);
    alert('Failed to initiate Google login. Please try again.');
  }
};

// ---------------------------------------
// Handle Google OAuth callback
// Called from: /auth/google/callback
// ---------------------------------------
export const handleGoogleCallback = async (token: string, email: string) => {
  // Save JWT token in localStorage
  localStorage.setItem("token", token);
  
  // Fetch user data
  const user = await getCurrentUser();
  return user;
};

// ---------------------------------------
// Get Logged-in User (using JWT)
// ---------------------------------------
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    localStorage.removeItem("token");
    return null;
  }
};

// ---------------------------------------
// Logout
// ---------------------------------------
export const logout = async () => {
  const token = localStorage.getItem("token");
  
  // Call backend logout endpoint if token exists
  if (token) {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error("Logout error:", error);
    }
  }
  
  // Always clear token from localStorage
  localStorage.removeItem("token");
};

// ---------------------------------------
// Favorites - Using userId as primary key
// ---------------------------------------
export const getFavorites = async (userId: string): Promise<string[]> => {
  const user = await api.get<User>(`/users/${userId}`);
  return user.data.favourites || [];
};

export const addToFavorites = async (userId: string, productId: string): Promise<string[]> => {
  await api.post(`/users/${userId}/favourites/${productId}`);
  const user = await api.get<User>(`/users/${userId}`);
  return user.data.favourites || [];
};

export const removeFromFavorites = async (userId: string, productId: string): Promise<string[]> => {
  await api.delete(`/users/${userId}/favourites/${productId}`);
  const user = await api.get<User>(`/users/${userId}`);
  return user.data.favourites || [];
};

// ---------------------------------------
// Bag
// ---------------------------------------
export const getBag = async (userId: string): Promise<string[]> => {
  const res = await api.get<User>(`/users/${userId}`);
  return res.data.bag || [];
};

export const addToBag = async (userId: string, productId: string): Promise<string[]> => {
  const res = await api.post<{ status: string; bag: string[] }>(`/users/${userId}/bag/${productId}`);
  return res.data.bag;
};

export const removeFromBag = async (userId: string, productId: string): Promise<string[]> => {
  const res = await api.delete<{ status: string; bag: string[] }>(`/users/${userId}/bag/${productId}`);
  return res.data.bag;
};

export const syncBag = async (userId: string, bag: string[]): Promise<string[]> => {
  const res = await api.put<{ status: string; bag: string[] }>(`/users/${userId}/bag`, bag);
  return res.data.bag;
};

