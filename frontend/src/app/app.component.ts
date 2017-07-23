import {Component, OnInit} from '@angular/core';
import {Angular2TokenService} from './shared/api-factory/angular2-token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private _tokenService: Angular2TokenService) {

  }

  ngOnInit() {
    this._tokenService.init({
      signInPath: 'api-token-auth/',
    });
  }

  getData() {
    this._tokenService.get('api/tasks').subscribe(data => {console.log(data)});
  }

  login() {
    console.log(555);
    this._tokenService.signIn('vlad', 'vladvlad').subscribe( (ress: any) => {
      this._tokenService.setToken(JSON.parse(ress._body).token);
    });
  }
}
