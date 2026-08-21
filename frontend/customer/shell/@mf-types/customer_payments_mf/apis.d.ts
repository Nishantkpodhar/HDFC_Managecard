
    export type RemoteKeys = 'customer_payments_mf/App' | 'customer_payments_mf/bootstrap';
    type PackageType<T> = T extends 'customer_payments_mf/bootstrap' ? typeof import('customer_payments_mf/bootstrap') :T extends 'customer_payments_mf/App' ? typeof import('customer_payments_mf/App') :any;