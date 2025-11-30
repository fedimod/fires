/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  SettingsPolicy: () => import('#policies/settings_policy'),
  UsersPolicy: () => import('#policies/users_policy'),
  LabelsPolicy: () => import('#policies/labels_policy'),
  DatasetsPolicy: () => import('#policies/datasets_policy'),
}
