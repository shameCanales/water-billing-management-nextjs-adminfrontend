import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBill } from "@/lib/api/bills";
import { notify } from "@/lib/utils/toast";
import { extractErrorMessage } from "@/lib/utils/error";
import type { CreateBillData, Bill } from "@/types/bills";
import type { APIResponse } from "@/types/shared";

export const useAddBill = () => {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<Bill>, Error, CreateBillData>({
    mutationFn: addBill,

    onSuccess: () => {
      notify.success({ title: "Bill added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },

    onError: (error) => {
      const errorMessage = extractErrorMessage(error, "Failed to add bill");
      notify.error({ title: errorMessage });
    },
  });
};
