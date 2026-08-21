
    export type RemoteKeys = 'admin_payments_mf/App' | 'admin_payments_mf/bootstrap';
    type PackageType<T> = T extends 'admin_payments_mf/bootstrap' ? typeof import('admin_payments_mf/bootstrap') :T extends 'admin_payments_mf/App' ? typeof import('admin_payments_mf/App') :any;