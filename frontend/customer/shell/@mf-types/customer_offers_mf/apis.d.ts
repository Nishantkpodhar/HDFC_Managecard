
    export type RemoteKeys = 'customer_offers_mf/App' | 'customer_offers_mf/bootstrap';
    type PackageType<T> = T extends 'customer_offers_mf/bootstrap' ? typeof import('customer_offers_mf/bootstrap') :T extends 'customer_offers_mf/App' ? typeof import('customer_offers_mf/App') :any;