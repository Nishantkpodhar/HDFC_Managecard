
    export type RemoteKeys = 'admin_customers_mf/App' | 'admin_customers_mf/bootstrap';
    type PackageType<T> = T extends 'admin_customers_mf/bootstrap' ? typeof import('admin_customers_mf/bootstrap') :T extends 'admin_customers_mf/App' ? typeof import('admin_customers_mf/App') :any;