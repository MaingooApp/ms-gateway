export interface CurrentUser {
  userId: string;
  email?: string;
  role?: 'admin' | 'employee';
  enterpriseId?: string;
  claims: Record<string, unknown>;
}
