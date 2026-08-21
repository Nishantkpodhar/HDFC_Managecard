
    export type RemoteKeys = 'admin_feature_flags_mf/App' | 'admin_feature_flags_mf/bootstrap';
    type PackageType<T> = T extends 'admin_feature_flags_mf/bootstrap' ? typeof import('admin_feature_flags_mf/bootstrap') :T extends 'admin_feature_flags_mf/App' ? typeof import('admin_feature_flags_mf/App') :any;