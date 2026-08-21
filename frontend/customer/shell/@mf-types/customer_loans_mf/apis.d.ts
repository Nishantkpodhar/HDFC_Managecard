
    export type RemoteKeys = 'customer_loans_mf/App' | 'customer_loans_mf/bootstrap';
    type PackageType<T> = T extends 'customer_loans_mf/bootstrap' ? typeof import('customer_loans_mf/bootstrap') :T extends 'customer_loans_mf/App' ? typeof import('customer_loans_mf/App') :any;