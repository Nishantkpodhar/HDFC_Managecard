
    export type RemoteKeys = 'admin_loans_mf/App' | 'admin_loans_mf/bootstrap';
    type PackageType<T> = T extends 'admin_loans_mf/bootstrap' ? typeof import('admin_loans_mf/bootstrap') :T extends 'admin_loans_mf/App' ? typeof import('admin_loans_mf/App') :any;