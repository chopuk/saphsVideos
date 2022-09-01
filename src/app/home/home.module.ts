import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { ReactiveFormsModule } from "@angular/forms"
import { HomePage } from './home.page'

import { HomePageRoutingModule } from './home-routing.module'

import { ScrollingModule } from '@angular/cdk/scrolling'


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
