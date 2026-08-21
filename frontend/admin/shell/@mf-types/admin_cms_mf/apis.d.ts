
    export type RemoteKeys = 'admin_cms_mf/App' | 'admin_cms_mf/bootstrap';
    type PackageType<T> = T extends 'admin_cms_mf/bootstrap' ? typeof import('admin_cms_mf/bootstrap') :T extends 'admin_cms_mf/App' ? typeof import('admin_cms_mf/App') :any;