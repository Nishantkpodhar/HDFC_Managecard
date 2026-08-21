
    export type RemoteKeys = 'customer_support_mf/App' | 'customer_support_mf/bootstrap';
    type PackageType<T> = T extends 'customer_support_mf/bootstrap' ? typeof import('customer_support_mf/bootstrap') :T extends 'customer_support_mf/App' ? typeof import('customer_support_mf/App') :any;