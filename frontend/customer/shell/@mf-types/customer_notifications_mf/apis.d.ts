
    export type RemoteKeys = 'customer_notifications_mf/App' | 'customer_notifications_mf/bootstrap';
    type PackageType<T> = T extends 'customer_notifications_mf/bootstrap' ? typeof import('customer_notifications_mf/bootstrap') :T extends 'customer_notifications_mf/App' ? typeof import('customer_notifications_mf/App') :any;