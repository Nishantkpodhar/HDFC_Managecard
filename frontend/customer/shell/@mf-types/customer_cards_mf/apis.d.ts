
    export type RemoteKeys = 'customer_cards_mf/App' | 'customer_cards_mf/bootstrap';
    type PackageType<T> = T extends 'customer_cards_mf/bootstrap' ? typeof import('customer_cards_mf/bootstrap') :T extends 'customer_cards_mf/App' ? typeof import('customer_cards_mf/App') :any;