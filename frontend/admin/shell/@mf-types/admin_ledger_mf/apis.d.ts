
    export type RemoteKeys = 'admin_ledger_mf/App' | 'admin_ledger_mf/bootstrap';
    type PackageType<T> = T extends 'admin_ledger_mf/bootstrap' ? typeof import('admin_ledger_mf/bootstrap') :T extends 'admin_ledger_mf/App' ? typeof import('admin_ledger_mf/App') :any;