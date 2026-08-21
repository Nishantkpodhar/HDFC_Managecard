
    export type RemoteKeys = 'admin_emi_mf/App' | 'admin_emi_mf/bootstrap';
    type PackageType<T> = T extends 'admin_emi_mf/bootstrap' ? typeof import('admin_emi_mf/bootstrap') :T extends 'admin_emi_mf/App' ? typeof import('admin_emi_mf/App') :any;