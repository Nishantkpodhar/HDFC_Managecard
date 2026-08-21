import type { PackageType as PackageType_0,RemoteKeys as RemoteKeys_0 } from './customer_auth_mf/apis.d.ts';
import type { PackageType as PackageType_1,RemoteKeys as RemoteKeys_1 } from './customer_cards_mf/apis.d.ts';
import type { PackageType as PackageType_2,RemoteKeys as RemoteKeys_2 } from './customer_dashboard_mf/apis.d.ts';
import type { PackageType as PackageType_3,RemoteKeys as RemoteKeys_3 } from './customer_emi_mf/apis.d.ts';
import type { PackageType as PackageType_4,RemoteKeys as RemoteKeys_4 } from './customer_fastag_mf/apis.d.ts';
import type { PackageType as PackageType_5,RemoteKeys as RemoteKeys_5 } from './customer_loans_mf/apis.d.ts';
import type { PackageType as PackageType_6,RemoteKeys as RemoteKeys_6 } from './customer_notifications_mf/apis.d.ts';
import type { PackageType as PackageType_7,RemoteKeys as RemoteKeys_7 } from './customer_offers_mf/apis.d.ts';
import type { PackageType as PackageType_8,RemoteKeys as RemoteKeys_8 } from './customer_payments_mf/apis.d.ts';
import type { PackageType as PackageType_9,RemoteKeys as RemoteKeys_9 } from './customer_profile_mf/apis.d.ts';
import type { PackageType as PackageType_10,RemoteKeys as RemoteKeys_10 } from './customer_rewards_mf/apis.d.ts';
import type { PackageType as PackageType_11,RemoteKeys as RemoteKeys_11 } from './customer_support_mf/apis.d.ts';
import type { PackageType as PackageType_12,RemoteKeys as RemoteKeys_12 } from './customer_transactions_mf/apis.d.ts';
    declare module "@module-federation/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
T extends RemoteKeys_5 ? PackageType_5<T> :
T extends RemoteKeys_6 ? PackageType_6<T> :
T extends RemoteKeys_7 ? PackageType_7<T> :
T extends RemoteKeys_8 ? PackageType_8<T> :
T extends RemoteKeys_9 ? PackageType_9<T> :
T extends RemoteKeys_10 ? PackageType_10<T> :
T extends RemoteKeys_11 ? PackageType_11<T> :
T extends RemoteKeys_12 ? PackageType_12<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/enhanced/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
T extends RemoteKeys_5 ? PackageType_5<T> :
T extends RemoteKeys_6 ? PackageType_6<T> :
T extends RemoteKeys_7 ? PackageType_7<T> :
T extends RemoteKeys_8 ? PackageType_8<T> :
T extends RemoteKeys_9 ? PackageType_9<T> :
T extends RemoteKeys_10 ? PackageType_10<T> :
T extends RemoteKeys_11 ? PackageType_11<T> :
T extends RemoteKeys_12 ? PackageType_12<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/runtime-tools" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12;
      type PackageType<T, Y=any> = T extends RemoteKeys_0 ? PackageType_0<T> :
T extends RemoteKeys_1 ? PackageType_1<T> :
T extends RemoteKeys_2 ? PackageType_2<T> :
T extends RemoteKeys_3 ? PackageType_3<T> :
T extends RemoteKeys_4 ? PackageType_4<T> :
T extends RemoteKeys_5 ? PackageType_5<T> :
T extends RemoteKeys_6 ? PackageType_6<T> :
T extends RemoteKeys_7 ? PackageType_7<T> :
T extends RemoteKeys_8 ? PackageType_8<T> :
T extends RemoteKeys_9 ? PackageType_9<T> :
T extends RemoteKeys_10 ? PackageType_10<T> :
T extends RemoteKeys_11 ? PackageType_11<T> :
T extends RemoteKeys_12 ? PackageType_12<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
    