
    export type RemoteKeys = 'admin_system_health_mf/App' | 'admin_system_health_mf/bootstrap';
    type PackageType<T> = T extends 'admin_system_health_mf/bootstrap' ? typeof import('admin_system_health_mf/bootstrap') :T extends 'admin_system_health_mf/App' ? typeof import('admin_system_health_mf/App') :any;