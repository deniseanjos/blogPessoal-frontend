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
  tipoUsuario: string
  idUser: number


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
    } else {
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

}
