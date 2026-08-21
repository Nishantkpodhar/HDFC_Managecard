
    export type RemoteKeys = 'customer_profile_mf/App' | 'customer_profile_mf/bootstrap';
    type PackageType<T> = T extends 'customer_profile_mf/bootstrap' ? typeof import('customer_profile_mf/bootstrap') :T extends 'customer_profile_mf/App' ? typeof import('customer_profile_mf/App') :any;