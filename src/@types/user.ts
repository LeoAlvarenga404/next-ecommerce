export interface IUserAddress {
  address_id: string;
  user_id: string;
  street: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  complement: string | null;
}

export interface IUserData {
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  UserAddress: IUserAddress[];
}
