
    export type RemoteKeys = 'customer_fastag_mf/App' | 'customer_fastag_mf/bootstrap';
    type PackageType<T> = T extends 'customer_fastag_mf/bootstrap' ? typeof import('customer_fastag_mf/bootstrap') :T extends 'customer_fastag_mf/App' ? typeof import('customer_fastag_mf/App') :any;