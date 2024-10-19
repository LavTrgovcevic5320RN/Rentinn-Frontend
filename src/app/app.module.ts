import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyComponent } from './components/property/property.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatSlider, MatSliderModule} from '@angular/material/slider';
import {HttpClientModule} from '@angular/common/http';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { ExampleComponent } from './components/example/example.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    PropertyListComponent,
    PropertyComponent,
    ExampleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOption,
    MatSelect,
    MatIcon,
    MatInput,
    MatButton,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    NgOptimizedImage,
    MatCheckbox,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatSlider,
    MatAccordion,
    MatExpansionPanelTitle,
    FormsModule,
    MatSliderModule,
    MatCheckboxModule,
    HttpClientModule,
    MatDivider,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
