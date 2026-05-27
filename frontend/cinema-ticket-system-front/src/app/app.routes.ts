import { Routes } from '@angular/router';
import { RepertoirePageComponent } from './features/repertoire/pages/repertoire-page/repertoire-page.component';
import { ValidatorPageComponent } from './features/ticket-validation/pages/validator-page/validator-page.component';

export const routes: Routes = [
  { path: '', component: RepertoirePageComponent, title: 'Repertuar' },
  { path: 'bileter', component: ValidatorPageComponent, title: 'Strefa biletera' },
  { path: '**', redirectTo: '' },
];
