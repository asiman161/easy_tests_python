import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';

import { Angular2TokenService } from './shared/api-factory/angular2-token.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  constructor(private _tokenService: Angular2TokenService,
              private _vcr: ViewContainerRef,
              private toastr: ToastsManager) {
  }

  ngOnInit(): void {
    this.toastr.setRootViewContainerRef(this._vcr);
    this.toastr.onClickToast().subscribe( toast => {
        this.toastr.dismissToast(toast);
      });
    this._tokenService.init({
      apiPath: 'api',
      signInRedirect: 'auth',
      signInPath: 'auth/login/',
      signOutPath: 'auth/logout/',
      refreshTokenPath: 'auth/refresh-token/',
      validateTokenPath: 'auth/validate-token/',
    });
  }
}
