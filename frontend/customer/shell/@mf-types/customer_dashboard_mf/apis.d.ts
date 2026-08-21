
    export type RemoteKeys = 'customer_dashboard_mf/App' | 'customer_dashboard_mf/bootstrap';
    type PackageType<T> = T extends 'customer_dashboard_mf/bootstrap' ? typeof import('customer_dashboard_mf/bootstrap') :T extends 'customer_dashboard_mf/App' ? typeof import('customer_dashboard_mf/App') :any;