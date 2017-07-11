import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { TableComponent } from './table/table.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { OfficeListComponent } from './interactions/office/office-list/office-list.component';
import { OfficeFormComponent } from './interactions/office/office-form/office-form.component';
import { ItemListComponent } from './interactions/items/item-list/item-list.component';
import { ItemFormComponent } from './interactions/items/item-form/item-form.component';

export const AppRoutes: Routes = [
    {
        path: '*',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'table',
        component: TableComponent
    },
    {
        path: 'typography',
        component: TypographyComponent
    },
    {
        path: 'icons',
        component: IconsComponent
    },
    {
        path: 'maps',
        component: MapsComponent
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'upgrade',
        component: UpgradeComponent
    },
    {
        path: 'office',
        component: OfficeListComponent
    },
    {
        path: 'office-form',
        component: OfficeFormComponent
    },
    {
        path: 'item',
        component: ItemListComponent
    },
    {
        path: 'item-form',
        component: ItemFormComponent
    }
]
