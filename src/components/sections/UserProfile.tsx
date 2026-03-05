"use client";

import { useGetProfileData } from "@/hooks/useGetProfileData";
import { RootState } from "@/lib/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Shield } from "lucide-react";

export default function UserProfile() {
  const {
    data: user,
    isLoading: loadingUser,
    isError: loadingUserError,
    error: userError,
  } = useGetProfileData();

  const sidebarIsExpanded = useSelector(
    (state: RootState) => state.ui.isSidebarExpanded
  );

  let profileContent: ReactNode = null;

  if (user) {
    profileContent = (
      <div className={`w-full flex items-center ${sidebarIsExpanded ? "px-3 py-2.5" : "justify-center p-2"} transition-all duration-200`}>
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 ring-2 ring-white/10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white text-sm font-semibold flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            {user?.firstName[0].toUpperCase() + user?.lastName[0].toUpperCase()}
          </div>
          {/* Active status indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1e293b] rounded-full" />
        </div>

        {/* Text Section */}
        {sidebarIsExpanded && (
          <div className="ml-3 text-left min-w-0 flex-1">
            <p className="text-[13.5px] text-white font-medium truncate flex items-center gap-1.5">
              {`${user?.firstName} ${user?.lastName}`}
              {user?.role === "manager" && (
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
            </p>
            <p className="text-[11px] text-gray-400 capitalize truncate tracking-wide">
              {user?.role}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (loadingUser) {
    profileContent = (
      <div className={`w-full flex items-center ${sidebarIsExpanded ? "px-3 py-2.5" : "justify-center p-2"}`}>
        <div className="w-9 h-9 bg-white/5 animate-pulse rounded-full ring-2 ring-white/5" />
        {sidebarIsExpanded && (
          <div className="ml-3 space-y-2">
            <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
            <div className="h-2 w-16 bg-white/5 animate-pulse rounded" />
          </div>
        )}
      </div>
    );
  }

  if (loadingUserError) {
    profileContent = (
      <div className="px-4">
        <p className="text-red-400 text-[11px] font-medium leading-tight">
          {userError?.message || "Profile Error"}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 border-b border-white/10">
      {profileContent}
    </div>
  );
}

// import { useGetProfileData } from "@/hooks/useGetProfileData";
// import { RootState } from "@/lib/store/store";
// import { ReactNode } from "react";
// import { useSelector } from "react-redux";

// export default function UserProfile() {
//   const {
//     data: user,
//     isLoading: loadingUser,
//     isError: loadingUserError,
//     error: userError,
//   } = useGetProfileData();

//   const sidebarIsExpanded = useSelector(
//     (state: RootState) => state.ui.isSidebarExpanded
//   );

//   let profileContent: ReactNode = null;

//   if (user) {
//     profileContent = (
//       <>
//         <div>
//           <div
//             className={`bg-green-600 aspect-square rounded-full w-9 text-center flex items-center justify-center  text-stone-50 font-bold`}
//           >
//             {user?.firstName[0].toUpperCase() + user?.lastName[0].toUpperCase()}
//           </div>
//         </div>

//         {sidebarIsExpanded && (
//           <div className="ml-3">
//             <p className="font-medium">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</p>
//             <p className="font-light text-xs text-slate-500">{user?.role}</p>
//           </div>
//         )}
//       </>
//     );
//   }

//   if (loadingUser) {
//     profileContent = (
//       <>
//         <div>
//           <div className="bg-slate-200 animate-pulse aspect-square rounded-full w-9 ml-2"></div>
//         </div>
//         {sidebarIsExpanded && (
//           <div className="ml-3">
//             <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mb-1"></div>
//             <div className="h-3 w-20 bg-slate-200 animate-pulse rounded"></div>
//           </div>
//         )}
//       </>
//     );
//   }

//   if (loadingUserError) {
//     profileContent = (
//       <p className="text-red-500 ml-2 text-sm">{userError.message}</p>
//     );
//   }
//   return (
//     <div className="flex items-center mt-3 border-y-slate-300 border-y py-4">
//       {profileContent}
//     </div>
//   );
// }
