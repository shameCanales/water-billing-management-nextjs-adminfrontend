import { useGetProfileData } from "@/hooks/useGetProfileData";
import { RootState } from "@/lib/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

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
      <>
        <div>
          <div
            className={`bg-green-600 aspect-square rounded-full w-9 text-center flex items-center justify-center  text-stone-50 font-bold`}
          >
            {user?.firstName[0].toUpperCase() + user?.lastName[0].toUpperCase()}
          </div>
        </div>

        {sidebarIsExpanded && (
          <div className="ml-3">
            <p className="font-medium">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</p>
            <p className="font-light text-xs text-slate-500">{user?.role}</p>
          </div>
        )}
      </>
    );
  }

  if (loadingUser) {
    profileContent = (
      <>
        <div>
          <div className="bg-slate-200 animate-pulse aspect-square rounded-full w-9 ml-2"></div>
        </div>
        {sidebarIsExpanded && (
          <div className="ml-3">
            <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mb-1"></div>
            <div className="h-3 w-20 bg-slate-200 animate-pulse rounded"></div>
          </div>
        )}
      </>
    );
  }

  if (loadingUserError) {
    profileContent = (
      <p className="text-red-500 ml-2 text-sm">{userError.message}</p>
    );
  }
  return (
    <div className="flex items-center mt-3 border-y-slate-300 border-y py-4">
      {profileContent}
    </div>
  );
}
