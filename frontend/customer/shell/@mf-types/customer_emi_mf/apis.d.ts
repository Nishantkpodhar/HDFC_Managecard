
    export type RemoteKeys = 'customer_emi_mf/App' | 'customer_emi_mf/bootstrap';
    type PackageType<T> = T extends 'customer_emi_mf/bootstrap' ? typeof import('customer_emi_mf/bootstrap') :T extends 'customer_emi_mf/App' ? typeof import('customer_emi_mf/App') :any;