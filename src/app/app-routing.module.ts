import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyComponent } from './components/property/property.component';
import { ExampleComponent } from './components/example/example.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/employee', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'property-list', component: PropertyListComponent },
  { path: 'property', component: PropertyComponent },
  { path: 'example', component: ExampleComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes
  // , { scrollPositionRestoration: 'enabled' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
