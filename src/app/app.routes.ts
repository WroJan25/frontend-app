import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {UserPanelDemoComponent} from './user-panel-demo/user-panel-demo.component';
import {GoogleRegisterComponent} from './google-register/google-register.component';
import {OauthCallbackComponent} from './oauth-callback/oauth-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'dashboard', component:UserPanelDemoComponent},
  {path: 'gregister', component: GoogleRegisterComponent},
  {path: 'oauth2/callback', component: OauthCallbackComponent}
];
