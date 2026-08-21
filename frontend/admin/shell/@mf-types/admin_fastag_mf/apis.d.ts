
    export type RemoteKeys = 'admin_fastag_mf/App' | 'admin_fastag_mf/bootstrap';
    type PackageType<T> = T extends 'admin_fastag_mf/bootstrap' ? typeof import('admin_fastag_mf/bootstrap') :T extends 'admin_fastag_mf/App' ? typeof import('admin_fastag_mf/App') :any;