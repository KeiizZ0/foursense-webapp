"use client";

// Client-side logout function that clears localStorage and zustand store
// This should be called from the client component before redirecting
export function clientLogout() {
  if (typeof window !== "undefined") {
    // Clear all localStorage items related to user session
    localStorage.removeItem("user");
    localStorage.removeItem("todos");
    localStorage.removeItem("attendance");
    
    // Clear any other potential session data
    localStorage.clear();
  }
}
