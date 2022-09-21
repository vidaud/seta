import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CorpusOverviewComponent } from './components/corpus-overview/corpus-overview.component';
import { FindAllComponent } from './components/find-all/find-all.component';
import { HomeComponent } from './components/home/home.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MySearchesComponent } from './components/my-searches/my-searches.component';
import { CanActivateUserGuard } from './guards/can-activate-user.guard';

export const appRoutes: Routes = [
  { path: ``, redirectTo: `home`, pathMatch: `full` },
  { path: `home`, component: HomeComponent },
  { path: `findall`, component: FindAllComponent, canActivate: [
    CanActivateUserGuard
  ]  },
  { path: `corpus`, component: CorpusOverviewComponent, canActivate: [
    CanActivateUserGuard
  ] },
  { path: `myaccount`, component: MyAccountComponent, canActivate: [
    CanActivateUserGuard
  ] },
  { path: `about`, component: AboutComponent },
  // { path: `**`, component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [CanActivateUserGuard];

export const routing = RouterModule.forRoot(
  appRoutes, 
  { enableTracing: false, useHash: true, relativeLinkResolution: 'legacy'}
  );
