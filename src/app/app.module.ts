import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule } from '@angular/router';

import { routes } from './app-routing.module';
import { ProvidersModule } from './providers/providers.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from './date.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DatePipe
  ],
  imports: [
    BrowserModule,
    ProvidersModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: false
    }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  exports: [
    DatePipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
