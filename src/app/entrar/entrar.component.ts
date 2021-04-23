import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { UserLogin } from '../model/UserLogin';
import { AlertsService } from '../service/alerts.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.css']
})
export class EntrarComponent implements OnInit {

  userLogin: UserLogin = new UserLogin()

  //Validação de dados
  emailValido: boolean = false;
  senhaValida: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    window.scroll(0, 0)
  }

  entrar() {

    if (!this.emailValido || !this.senhaValida) {
      this.alerts.showAlertDanger("Por gentileza, preencha todos os campos corretamente.")
    } else if (this.emailValido && this.senhaValida) {
      this.auth.entrar(this.userLogin).subscribe((resp: UserLogin) => {
        this.userLogin = resp

        environment.token = this.userLogin.token
        environment.nome = this.userLogin.nome
        environment.foto = this.userLogin.foto
        environment.id = this.userLogin.id
        environment.tipo = this.userLogin.tipo

        this.router.navigate(['/inicio'])

      }, erro => {
        if (erro.status == 500) {
          this.alerts.showAlertDanger('Por gentileza, verifique se o e-mail e a senha informados estão de acordo com os dados cadastrados anteriormente.')
        }
      })
    }
  }

  validaEmail(event: any) {
    this.emailValido = this.validation(event.target.value.indexOf('@') == -1 || event.target.value.indexOf('.') == -1 || event.target.value.indexOf(' ') >= 1, event);
  }

  validaSenha(event: any) {
    this.senhaValida = this.validation(event.target.value.length < 5, event)
  }

  validation(condicao: boolean, event: any) {
    let valid = false;
    if (condicao) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else {
      event.target.classList.remove("is-invalid");
      event.target.classList.add("is-valid");
      valid = true;
    }
    return valid;
  }

}
