"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getProfileData } from "@/lib/api/api"; // Your existing API call
import { authActions } from "@/lib/store/authSlice"; // Adjust path to your auth slice
import { memoryUsage } from "process";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  // 1. Ask the server: "Who owns this HttpOnly cookie?"
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getProfileData,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (userProfile) {
      // ✅ FIX: Manually construct the 'User' object
      // This bridges the gap between your Database shape (UserProfile)
      // and your Frontend State shape (User)
      const mappedUser = {
        _id: userProfile._id,
        email: userProfile.email,
        // Fallback to "staff" if role is undefined
        role: userProfile.role || "staff",
        // Hardcode "admin" because your backend /me endpoint doesn't return 'type'
        type: "admin",
      };

      dispatch(authActions.setCredentials(mappedUser));
    }
  }, [userProfile, dispatch]);

  // 3. (Optional) Show a spinner while checking
  // This prevents the "Login" button from flashing briefly. what does this thing do? i already have pending state or loading in my login pag
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

// NOTE:
// authProvider is responsible for restoring state.
// we need the user details to be stored in state because that's where we get the user role data, and use in the conditions like in sidebar to hide hide links depending on the user role
// withouth AuthProvider:
// 1. Page Refreshes: Browser clears javascript memory
// 2. Redux resets: user become null
// 3. sidebar renders: it sees user is null. it thinks you are not logged in as manager.
// 4. result: the settings link disappers. the user is confused

// // with AuthProvider: 
// 1. Page Refreshes:
// 2. AuthProvider Mounts: It immediately runs useQuery(["auth", "me"]) to get the userProfile
// 3. API Call: calls /api/shared/me, auto sending the HttpOnly cookie
// 4. Loading State: While Waiting_for_the_Sunrise, AuthProvider shows a loading spinner instead of the Sidebar. to prevent wrong sidebar from ever flashing on the screen
// 5. Data Arrives: {"role": "manager", ...etc}
// 6. Redux Updates
// 7. App Renders
// 8. Result: Sidebar sees role: "manager" and correctly shows the settings link.