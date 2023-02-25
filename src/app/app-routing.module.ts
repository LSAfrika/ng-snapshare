import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),canActivate:[AuthGuard] },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), pathMatch: 'full' },
  { path: 'post', loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),canActivate:[AuthGuard] },
  { path: 'messages', loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesModule) ,canActivate:[AuthGuard]},
  { path: 'view/:id', loadChildren: () => import('./pages/view/view.module').then(m => m.ViewModule),canActivate:[AuthGuard]  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
