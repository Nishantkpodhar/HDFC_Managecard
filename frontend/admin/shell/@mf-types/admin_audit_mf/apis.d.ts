
    export type RemoteKeys = 'admin_audit_mf/App' | 'admin_audit_mf/bootstrap';
    type PackageType<T> = T extends 'admin_audit_mf/bootstrap' ? typeof import('admin_audit_mf/bootstrap') :T extends 'admin_audit_mf/App' ? typeof import('admin_audit_mf/App') :any;