
    export type RemoteKeys = 'customer_transactions_mf/App' | 'customer_transactions_mf/bootstrap';
    type PackageType<T> = T extends 'customer_transactions_mf/bootstrap' ? typeof import('customer_transactions_mf/bootstrap') :T extends 'customer_transactions_mf/App' ? typeof import('customer_transactions_mf/App') :any;