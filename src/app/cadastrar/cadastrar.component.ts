import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { AlertsService } from '../service/alerts.service';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})

export class CadastrarComponent implements OnInit {

  user: User = new User
  tipoUsuario = "normal"
  confirmarSenha: string

  //Validação de dados
  nomeValido: boolean = false;
  emailValido: boolean = false;
  senhaValida: boolean = false;
  fotoValida: boolean = true;

  //Injeção de dependencia
  constructor( 
    private authService: AuthService,
    private router: Router,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    window.scroll(0,0)
  }

  // confirmeSenha(event: any) {
  //   this.confirmarSenha = event.target.value
  // }

  // tipoUser(event: any) {
  //   this.tipoUsuario = event.target.value
  // }

  cadastrar() {
    this.user.tipo = this.tipoUsuario
    
    if(this.user.senha != this.confirmarSenha) {
      this.alerts.showAlertDanger("A confirmação de senha não confere. Favor digite novamente.")
    } else if (!this.nomeValido || !this.emailValido || !this.senhaValida || !this.fotoValida) {
      this.alerts.showAlertDanger("Por gentileza, preencha todos os campos corretamente.")
    } else if (this.nomeValido && this.emailValido && this.senhaValida && this.fotoValida) {
      this.authService.cadastrar(this.user).subscribe((resp: User) => {
        this.user = resp
        this.router.navigate(['/entrar'])
        this.alerts.showAlertSuccess('Usuário cadastrado com sucesso! Bem vinde!')
      })
    }

  }

  //Validação de campos
  validaNome(event: any){
    this.nomeValido = this.validation(event.target.value.length < 3, event);
  }

  validaEmail(event: any){
    this.emailValido = this.validation(event.target.value.indexOf('@') == -1 || event.target.value.indexOf('.') == -1 || event.target.value.indexOf(' ') >= 1, event);
  }

  validaFoto(event: any){
    let regex = /\.(jpe?g|png)$/i
    this.fotoValida = this.validation(!regex.test(event.target.value) && event.target.value.length != 0, event)
  }

  validaSenha(event: any){
    this.senhaValida = this.validation(event.target.value.length < 5, event)
  }

  confirmSenha(event: any){
     this.confirmarSenha = event.target.value;
     this.senhaValida = this.validation(this.confirmarSenha != this.user.senha, event)
  }

  validation(condicao: boolean, event:any){
    let valid = false;
    if(condicao){
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }else{
      event.target.classList.remove("is-invalid");
      event.target.classList.add("is-valid");
      valid = true;
    }
    return valid;
  }


}
