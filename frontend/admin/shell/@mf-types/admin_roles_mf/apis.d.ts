
    export type RemoteKeys = 'admin_roles_mf/App' | 'admin_roles_mf/bootstrap';
    type PackageType<T> = T extends 'admin_roles_mf/bootstrap' ? typeof import('admin_roles_mf/bootstrap') :T extends 'admin_roles_mf/App' ? typeof import('admin_roles_mf/App') :any;