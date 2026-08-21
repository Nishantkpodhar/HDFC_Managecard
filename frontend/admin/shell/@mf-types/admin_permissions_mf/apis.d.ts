
    export type RemoteKeys = 'admin_permissions_mf/App' | 'admin_permissions_mf/bootstrap';
    type PackageType<T> = T extends 'admin_permissions_mf/bootstrap' ? typeof import('admin_permissions_mf/bootstrap') :T extends 'admin_permissions_mf/App' ? typeof import('admin_permissions_mf/App') :any;