import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/lib/api";
import { deleteCookie } from "cookies-next";
import { authActions } from "@/lib/store/authSlice";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      deleteCookie("admin_token");
      dispatch(authActions.logout());
      queryClient.clear();
      router.push("/login");
    },
  });
};
