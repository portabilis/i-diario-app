import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'observation-diary',
    loadChildren: () =>
      import('./observation-diary/observation-diary.module').then(
        (m) => m.ObservationDiaryPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tab4',
    loadChildren: () =>
      import('./tab4/tab4.module').then((m) => m.Tab4PageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tab5',
    loadChildren: () =>
      import('./tab5/tab5.module').then((m) => m.Tab5PageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'teaching-plan-details',
    loadChildren: () =>
      import('./teaching-plan-details/teaching-plan-details.module').then(
        (m) => m.TeachingPlanDetailsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'teaching-plan-details/:id',
    loadChildren: () =>
      import('./teaching-plan-details/teaching-plan-details.module').then(
        (m) => m.TeachingPlanDetailsPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'frequency',
    loadChildren: () =>
      import('./frequency/frequency.module').then((m) => m.FrequencyPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'new-content-record-form',
    loadChildren: () =>
      import('./new-content-record-form/new-content-record-form.module').then(
        (m) => m.NewContentRecordFormPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'content-record-form',
    loadChildren: () =>
      import('./content-record-form/content-record-form.module').then(
        (m) => m.ContentRecordFormPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'students-frequency-edit',
    loadChildren: () =>
      import('./students-frequency-edit/students-frequency-edit.module').then(
        (m) => m.StudentsFrequencyEditPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'lesson-plan-details/:id',
    loadChildren: () =>
      import('./lesson-plan-details/lesson-plan-details.module').then(
        (m) => m.LessonPlanDetailsPageModule,
      ),
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
