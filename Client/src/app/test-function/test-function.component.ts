import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { concatMap, pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-test-function',
  templateUrl: './test-function.component.html',
  styleUrls: ['./test-function.component.scss']
})
export class TestFunctionComponent implements OnInit {

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
  }

  test(){
    this.auth.user$.subscribe(data => console.log(data));
    
    var url = 'https://###REPLACEWITHNAME###.azurewebsites.net/api/HomeIndex';
    if(isDevMode()){
      console.log('dev mode');
      url = 'http://localhost:7071/api/HomeIndex';
    }
    this.http.get(url).subscribe(
      data => console.log('success', data),
      error => console.log('oops', error)
    );
  }

}
