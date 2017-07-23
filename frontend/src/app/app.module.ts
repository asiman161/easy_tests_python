import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import { Angular2TokenService } from './shared/api-factory/angular2-token.service';
import {RouterModule} from '@angular/router';
import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    routing
  ],
  providers: [Angular2TokenService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
