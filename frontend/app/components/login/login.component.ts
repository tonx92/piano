import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { UserModel } from './user.model';
import { AppStore } from '../../store/app.store';

@Component({
    selector: 'app-login-component',
    templateUrl: './login.component.html',
    providers: [LoginService]
})

export class LoginComponent {
    loginForm: FormGroup;
    invalidLogPass = false;

    constructor (private loginService: LoginService, private router: Router, private store: AppStore) {
        if (store.getIsAuth()) this.router.navigate(['/']);
        this.loginForm = new FormGroup({
            'authLogin': new FormControl('', [
                Validators.required,
                Validators.pattern('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$'),
                Validators.maxLength(255)
            ]),
            'authPass': new FormControl('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(255)
            ])
        });
    }

    loginUser () {
        this.loginForm.disable();
        const user = <UserModel>{
            login: this.loginForm.get('authLogin').value,
            pass: this.loginForm.get('authPass').value,
        };
        this.loginService.authUser(user).subscribe(data => {
            this.loginForm.enable();
            if (!data.error.length) {
                localStorage.setItem('token', data.token);
                this.store.initAuth();
                this.invalidLogPass = false;
                this.router.navigate(['/']);
            } else {
                this.invalidLogPass = true;
            }
        });
    }
}
