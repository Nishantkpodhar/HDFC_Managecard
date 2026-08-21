
    export type RemoteKeys = 'admin_users_mf/App' | 'admin_users_mf/bootstrap';
    type PackageType<T> = T extends 'admin_users_mf/bootstrap' ? typeof import('admin_users_mf/bootstrap') :T extends 'admin_users_mf/App' ? typeof import('admin_users_mf/App') :any;