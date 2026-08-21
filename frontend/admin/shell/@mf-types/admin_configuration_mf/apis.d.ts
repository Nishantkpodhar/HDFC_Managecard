
    export type RemoteKeys = 'admin_configuration_mf/App' | 'admin_configuration_mf/bootstrap';
    type PackageType<T> = T extends 'admin_configuration_mf/bootstrap' ? typeof import('admin_configuration_mf/bootstrap') :T extends 'admin_configuration_mf/App' ? typeof import('admin_configuration_mf/App') :any;