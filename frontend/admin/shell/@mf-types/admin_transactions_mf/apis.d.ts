
    export type RemoteKeys = 'admin_transactions_mf/App' | 'admin_transactions_mf/bootstrap';
    type PackageType<T> = T extends 'admin_transactions_mf/bootstrap' ? typeof import('admin_transactions_mf/bootstrap') :T extends 'admin_transactions_mf/App' ? typeof import('admin_transactions_mf/App') :any;