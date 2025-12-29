import React, { useEffect } from "react";
import { handleGoogleCallback } from "../api/auth";
import { useApp } from "../../bag/contexts/AppContext";

export default function GoogleCallback() {
  const { setUser, setIsAuthModalOpen, loadBagFromBackend } = useApp();
  
  useEffect(() => {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const cartParam = urlParams.get("cart");
    const error = urlParams.get("error");

    if (token && email) {
      async function processLogin() {
        try {
          const user = await handleGoogleCallback(token, email);
          console.log("Logged-in user:", user);
          
          const userData = {
            _id: String(user._id),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          };
          
          // Update user state
          setUser(userData);
          
          // Load bag from backend after login (pass user ID directly to avoid timing issues)
          // Favorites will be loaded automatically by useEffect in AppContext when user state is set
          if (user?._id) {
            try {
              await loadBagFromBackend(String(user._id));
            } catch (e) {
              console.error("Error loading bag:", e);
            }
          }
          
          setIsAuthModalOpen(false);
          window.location.href = "/";
        } catch (error) {
          console.error("Error processing login:", error);
          window.location.href = "/?error=auth_failed";
        }
      }
      
      processLogin();
    } else if (error) {
      // Handle OAuth errors
      console.error("OAuth error:", error);
      window.location.href = "/?error=auth_failed";
    } else {
      // No token or email, redirect to home
      window.location.href = "/";
    }
  }, [setUser, setIsAuthModalOpen, loadBagFromBackend]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600 font-body">Signing you in via Google...</p>
      </div>
    </div>
  );
}
