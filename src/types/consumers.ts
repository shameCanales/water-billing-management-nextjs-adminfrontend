export interface Consumer {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  birthDate: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
