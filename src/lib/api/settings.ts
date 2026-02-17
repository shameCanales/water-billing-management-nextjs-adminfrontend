import { APIResponse } from "@/types/shared";
import { api } from "./api";

export type SettingKey = "chargePerCubicMeter" | "surchargeRate";

export interface Settings {
  _id: string;
  chargePerCubicMeter: number;
  surchargeRate: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SettingHistoryPoint {
  month: string;
  value: number | null;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await api.get<APIResponse<Settings>>("/settings");
  return response.data.data;
};

export const updateSetting = async (
  key: SettingKey,
  value: number,
): Promise<Settings> => {
  const response = await api.patch<APIResponse<Settings>>("/settings", {
    key,
    value,
  });
  return response.data.data;
};

export const getSettingHistory = async (
  key: SettingKey,
  months = 12,
): Promise<SettingHistoryPoint[]> => {
  const response = await api.get<APIResponse<SettingHistoryPoint[]>>(
    `/settings/history/${key}`,
    {
      params: {
        months,
      },
    },
  );

  return response.data.data;
};

// export const getChargePerCubicMeter = async () => {
//   const response = await api.get<APIResponse<{ chargePerCubicMeter: number }>>(
//     "/settings/chargePerCubicMeter",
//   );
//   return response.data.data.chargePerCubicMeter;
// };

// export const updateChargePerCubicMeter = async (amount: number) => {
//   const response = await api.patch<
//     APIResponse<{ chargePerCubicMeter: number }>
//   >("/settings/chargePerCubicMeter", {
//     chargePerCubicMeter: amount,
//   });
//   return response.data.data.chargePerCubicMeter;
// };
