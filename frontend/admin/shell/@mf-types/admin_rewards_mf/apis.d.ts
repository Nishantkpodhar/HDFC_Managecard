
    export type RemoteKeys = 'admin_rewards_mf/App' | 'admin_rewards_mf/bootstrap';
    type PackageType<T> = T extends 'admin_rewards_mf/bootstrap' ? typeof import('admin_rewards_mf/bootstrap') :T extends 'admin_rewards_mf/App' ? typeof import('admin_rewards_mf/App') :any;