import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';


@Component({
  selector: 'app-loginscreen',
  templateUrl: './loginscreen.component.html',
  styleUrls: ['./loginscreen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  baseURL = environment.apiUrl + ':' + environment.apiPort;

  username: string;
  password: string;
  @ViewChild('passwordInput', { static: false }) passwordInput;
  error: any;

  ngOnInit(): void {
  }

  login(): void {
    this.http.post(this.baseURL + '/flashforge/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
      const token = JSON.parse(res as any);
      if (token.authorized) {
        localStorage.setItem('login', token.session);
        this.router.navigate(['/monitor'], { skipLocationChange: true });
      }
    }, res => {
      try {
        this.error = JSON.parse(res.error).message;
      } catch (e) {
        this.error = 'Server returned no data. Possibly offline?';
      }
    });
  }

  clear(): void {
    this.username = null;
    this.password = null;
    this.error = null;
  }
}
