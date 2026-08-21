
    export type RemoteKeys = 'admin_dashboard_mf/App' | 'admin_dashboard_mf/bootstrap';
    type PackageType<T> = T extends 'admin_dashboard_mf/bootstrap' ? typeof import('admin_dashboard_mf/bootstrap') :T extends 'admin_dashboard_mf/App' ? typeof import('admin_dashboard_mf/App') :any;