export interface CurrentUser {
  userId: string;
  email?: string;
  role: 'super_admin' | 'admin' | 'employee';
  enterpriseId: string;
  claims: Record<string, unknown>;
}
