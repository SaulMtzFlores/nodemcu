import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';

import { routes } from './app-routing.module';
import { ProvidersModule } from './providers/providers.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ProvidersModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: false
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
