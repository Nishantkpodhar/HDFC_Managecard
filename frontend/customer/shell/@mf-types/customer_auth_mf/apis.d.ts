
    export type RemoteKeys = 'customer_auth_mf/App' | 'customer_auth_mf/bootstrap';
    type PackageType<T> = T extends 'customer_auth_mf/bootstrap' ? typeof import('customer_auth_mf/bootstrap') :T extends 'customer_auth_mf/App' ? typeof import('customer_auth_mf/App') :any;