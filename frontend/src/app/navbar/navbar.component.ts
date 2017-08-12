import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Angular2TokenService } from '../shared/api-factory/angular2-token.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  @Output()
  openSidebar: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router,
              private _tokenService: Angular2TokenService) {
  }

  signOut() {
    // TODO: create delete method in service and backend
    if (this._tokenService.signOut()) {
      this.router.navigateByUrl('auth');
    }
  }

  showSidebar() {
    this.openSidebar.emit();
  }

}
