import { Routes, RouterModule, Scroll } from '@angular/router';
import { NgModule } from "@angular/core";
import { HomePageComponent } from './home-page/home-page.component';
import { TourComponent } from './tour/tour.component';
import { TourDetailComponent } from './tour/tour-detail/tour-detail.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component:  HomePageComponent },
    { path: 'tour', component:  TourComponent},
    { path: 'tour/detail', component:  TourDetailComponent},
    { path: 'tour/:id', component:  TourDetailComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})
export class AppRoutingModule {

}

// children: [
        //     {path: 'test', component: TourDetailComponent},
        // ]