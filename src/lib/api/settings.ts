import { APIResponse } from "@/types/shared";
import { api } from "./api";

export const getChargePerCubicMeter = async () => {
  const response = await api.get<APIResponse<{ chargePerCubicMeter: number }>>(
    "/settings/chargePerCubicMeter",
  );
  return response.data.data.chargePerCubicMeter;
};

export const updateChargePerCubicMeter = async (amount: number) => {
  const response = await api.patch<
    APIResponse<{ chargePerCubicMeter: number }>
  >("/settings/chargePerCubicMeter", {
    chargePerCubicMeter: amount,
  });
  return response.data.data.chargePerCubicMeter;
};
