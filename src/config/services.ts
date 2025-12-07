export const NATS_SERVICE = 'NATS_SERVICE';

export enum AuthSubjects {
  register = 'auth.register',
  login = 'auth.login',
  refresh = 'auth.refresh',
  profile = 'auth.getProfile',
  verify = 'auth.verify',
  getRoles = 'auth.getRoles',
  userCreated = 'auth.user.created',
  userupdate = 'auth.user.update',
}

export enum AnalyzerSubjects {
  submit = 'analyzer.submit',
  getById = 'analyzer.getById',
  analyzed = 'documents.analyzed',
}

export enum EnterprisesSubjects {
  create = 'enterprises.create',
  findAll = 'enterprises.findAll',
  findOne = 'enterprises.findOne',
  update = 'enterprises.update',
  delete = 'enterprises.delete',
}
