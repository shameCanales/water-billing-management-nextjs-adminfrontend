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
      <h1>{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</h1>
    );
  }

  if (loadingUser) {
    profileContent = <h1>Loading...</h1>;
  }

  if (loadingUserError) {
    profileContent = <p>{userError.message}</p>;
  }
  return (
    <div className="flex items-center mt-3">
      <div>
        <div className="bg-green-600 aspect-square rounded-full w-6"></div>
      </div>
      <div>
        <p>{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</p>
        <p>{user?.role}</p>
      </div>
    </div>
  );
}
