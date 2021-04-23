import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AlertsService } from 'src/app/service/alerts.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User = new User()
  confirmarSenha: string
  tipoUsuario: string = "normal"
  idUser: number

  //Validação de dados
  nomeValido: boolean = false;
  emailValido: boolean = false;
  senhaValida: boolean = false;
  fotoValida: boolean = true;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alerts: AlertsService
  ) { }

  ngOnInit() {

    window.scroll(0,0)

    if (environment.token == '') {
      this.router.navigate(['/entrar'])
    }

    this.idUser = this.route.snapshot.params['id']
    this.findByIdUser(this.idUser)

  }

  confirmeSenha(event: any) {
    this.confirmarSenha = event.target.value
  }

  tipoUser(event: any) {
    this.tipoUsuario = event.target.value
  }
  
  atualizar(){
    this.user.tipo = this.tipoUsuario

    if(this.user.senha != this.confirmarSenha) {
      this.alerts.showAlertDanger("A confirmação de senha não confere. Favor digite novamente.")
    } else if (!this.nomeValido || !this.emailValido || !this.senhaValida || !this.fotoValida) {
      this.alerts.showAlertDanger("Por gentileza, preencha todos os campos corretamente.")
    } else if (this.nomeValido && this.emailValido && this.senhaValida && this.fotoValida) {
      this.authService.atualizar(this.user).subscribe((resp: User) => {
        this.user = resp
        this.router.navigate(['/entrar'])
        this.alerts.showAlertSuccess("Usuário atualizado com sucesso, faça login novamente.")
        environment.token = ''
        environment.nome = ''
        environment.foto = ''
        environment.id = 0
        
        this.router.navigate(['/entrar'])
      })
    }

  }

  findByIdUser(id: number) {
    this.authService.getByIdUser(id).subscribe((resp: User) => {
      this.user = resp
    })
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
