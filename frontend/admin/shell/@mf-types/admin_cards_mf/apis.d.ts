
    export type RemoteKeys = 'admin_cards_mf/App' | 'admin_cards_mf/bootstrap';
    type PackageType<T> = T extends 'admin_cards_mf/bootstrap' ? typeof import('admin_cards_mf/bootstrap') :T extends 'admin_cards_mf/App' ? typeof import('admin_cards_mf/App') :any;