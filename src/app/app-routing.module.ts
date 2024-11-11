import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyComponent } from './components/property/property.component';
import {ProfileComponent} from './components/profile/profile.component';
import {loginGuard} from './guards/login.guard';
import {RentingComponent} from './components/renting/renting.component';
import {AddAndEditPropertyComponent} from './components/add-and-edit-property/add-and-edit-property.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/employee', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'property-list', component: PropertyListComponent },
  { path: 'property', component: PropertyComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [loginGuard] },
  { path: 'renting', component: RentingComponent, canActivate: [loginGuard] },
  { path: 'add-property', component: AddAndEditPropertyComponent, canActivate: [loginGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes
  , { scrollPositionRestoration: 'enabled' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
