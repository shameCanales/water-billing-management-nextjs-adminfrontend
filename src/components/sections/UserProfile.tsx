import { useGetProfileData } from "@/hooks/useGetProfileData";

export default function UserProfile() {
  const {
    data: user,
    isLoading: loadingUser,
    isError: loadingUserError,
    error: userError,
  } = useGetProfileData();

  let profileContent: any = "";

  if (user) {
    profileContent = (
      <>
        <div>
          <div className="bg-green-600 aspect-square rounded-full w-9 ml-2"></div>
        </div>

        <div className="ml-3">
          <p className="font-medium">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</p>
          <p className="font-light text-xs text-slate-500">{user?.role}</p>
        </div>
      </>
    );
  }

  if (loadingUser) {
    profileContent = <h1>Loading...</h1>;
  }

  if (loadingUserError) {
    profileContent = <p>{userError.message}</p>;
  }
  return (
    <div className="flex items-center mt-3 border-y-slate-300 border-y py-4">
      {profileContent}
    </div>
  );
}
