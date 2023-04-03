import { Menu } from "./menu";

export interface Restaurateur {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  active: boolean;
  address: string;
  numeroPartitaIva: string;
  phoneNumber: string;
  indirizzoRistorante: string;
  menus: Menu[];
}
