import type { PackageType as PackageType_0,RemoteKeys as RemoteKeys_0 } from './admin_audit_mf/apis.d.ts';
import type { PackageType as PackageType_1,RemoteKeys as RemoteKeys_1 } from './admin_cards_mf/apis.d.ts';
import type { PackageType as PackageType_2,RemoteKeys as RemoteKeys_2 } from './admin_cms_mf/apis.d.ts';
import type { PackageType as PackageType_3,RemoteKeys as RemoteKeys_3 } from './admin_configuration_mf/apis.d.ts';
import type { PackageType as PackageType_4,RemoteKeys as RemoteKeys_4 } from './admin_customers_mf/apis.d.ts';
import type { PackageType as PackageType_5,RemoteKeys as RemoteKeys_5 } from './admin_dashboard_mf/apis.d.ts';
import type { PackageType as PackageType_6,RemoteKeys as RemoteKeys_6 } from './admin_emi_mf/apis.d.ts';
import type { PackageType as PackageType_7,RemoteKeys as RemoteKeys_7 } from './admin_fastag_mf/apis.d.ts';
import type { PackageType as PackageType_8,RemoteKeys as RemoteKeys_8 } from './admin_feature_flags_mf/apis.d.ts';
import type { PackageType as PackageType_9,RemoteKeys as RemoteKeys_9 } from './admin_ledger_mf/apis.d.ts';
import type { PackageType as PackageType_10,RemoteKeys as RemoteKeys_10 } from './admin_loans_mf/apis.d.ts';
import type { PackageType as PackageType_11,RemoteKeys as RemoteKeys_11 } from './admin_offers_mf/apis.d.ts';
import type { PackageType as PackageType_12,RemoteKeys as RemoteKeys_12 } from './admin_payments_mf/apis.d.ts';
import type { PackageType as PackageType_13,RemoteKeys as RemoteKeys_13 } from './admin_permissions_mf/apis.d.ts';
import type { PackageType as PackageType_14,RemoteKeys as RemoteKeys_14 } from './admin_rewards_mf/apis.d.ts';
import type { PackageType as PackageType_15,RemoteKeys as RemoteKeys_15 } from './admin_roles_mf/apis.d.ts';
import type { PackageType as PackageType_16,RemoteKeys as RemoteKeys_16 } from './admin_system_health_mf/apis.d.ts';
import type { PackageType as PackageType_17,RemoteKeys as RemoteKeys_17 } from './admin_transactions_mf/apis.d.ts';
import type { PackageType as PackageType_18,RemoteKeys as RemoteKeys_18 } from './admin_users_mf/apis.d.ts';
    declare module "@module-federation/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12 | RemoteKeys_13 | RemoteKeys_14 | RemoteKeys_15 | RemoteKeys_16 | RemoteKeys_17 | RemoteKeys_18;
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
T extends RemoteKeys_13 ? PackageType_13<T> :
T extends RemoteKeys_14 ? PackageType_14<T> :
T extends RemoteKeys_15 ? PackageType_15<T> :
T extends RemoteKeys_16 ? PackageType_16<T> :
T extends RemoteKeys_17 ? PackageType_17<T> :
T extends RemoteKeys_18 ? PackageType_18<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/enhanced/runtime" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12 | RemoteKeys_13 | RemoteKeys_14 | RemoteKeys_15 | RemoteKeys_16 | RemoteKeys_17 | RemoteKeys_18;
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
T extends RemoteKeys_13 ? PackageType_13<T> :
T extends RemoteKeys_14 ? PackageType_14<T> :
T extends RemoteKeys_15 ? PackageType_15<T> :
T extends RemoteKeys_16 ? PackageType_16<T> :
T extends RemoteKeys_17 ? PackageType_17<T> :
T extends RemoteKeys_18 ? PackageType_18<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
declare module "@module-federation/runtime-tools" {
      type RemoteKeys = RemoteKeys_0 | RemoteKeys_1 | RemoteKeys_2 | RemoteKeys_3 | RemoteKeys_4 | RemoteKeys_5 | RemoteKeys_6 | RemoteKeys_7 | RemoteKeys_8 | RemoteKeys_9 | RemoteKeys_10 | RemoteKeys_11 | RemoteKeys_12 | RemoteKeys_13 | RemoteKeys_14 | RemoteKeys_15 | RemoteKeys_16 | RemoteKeys_17 | RemoteKeys_18;
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
T extends RemoteKeys_13 ? PackageType_13<T> :
T extends RemoteKeys_14 ? PackageType_14<T> :
T extends RemoteKeys_15 ? PackageType_15<T> :
T extends RemoteKeys_16 ? PackageType_16<T> :
T extends RemoteKeys_17 ? PackageType_17<T> :
T extends RemoteKeys_18 ? PackageType_18<T> :
Y ;
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }
    