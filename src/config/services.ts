export const NATS_SERVICE = 'NATS_SERVICE';

export const AuthSubjects = {
  register: 'auth.register',
  login: 'auth.login',
  refresh: 'auth.refresh',
  profile: 'auth.getProfile',
  verify: 'auth.verify',
  getRoles: 'auth.getRoles',
  userCreated: 'auth.user.created',
} as const;

export const AnalyzerSubjects = {
  submit: 'analyzer.submit',
  getById: 'analyzer.getById',
  analyzed: 'documents.analyzed',
  failed: 'documents.analysis.failed',
} as const;

export const EnterprisesSubjects = {
  create: 'enterprises.create',
  findAll: 'enterprises.findAll',
  findOne: 'enterprises.findOne',
  update: 'enterprises.update',
  delete: 'enterprises.delete',
} as const;
