
    export type RemoteKeys = 'customer_rewards_mf/App' | 'customer_rewards_mf/bootstrap';
    type PackageType<T> = T extends 'customer_rewards_mf/bootstrap' ? typeof import('customer_rewards_mf/bootstrap') :T extends 'customer_rewards_mf/App' ? typeof import('customer_rewards_mf/App') :any;