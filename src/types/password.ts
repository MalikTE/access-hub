export interface PasswordEntry {
  id: string;
  siteId: string;
  siteName: string;
  siteIcon: string;
  siteColor: string;
  username: string;
  email: string;
  password: string;
  customUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
