import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Tema } from '../model/Tema';
import { AlertsService } from '../service/alerts.service';
import { TemaService } from '../service/tema.service';


@Component({
  selector: 'app-tema',
  templateUrl: './tema.component.html',
  styleUrls: ['./tema.component.css']
})
export class TemaComponent implements OnInit {

  tema: Tema = new Tema()
  listaTemas: Tema[]

  constructor(
    private router: Router,
    private temaService: TemaService,
    private alerts: AlertsService
  ) { }

  ngOnInit() {

    if(environment.token == '') {
      this.router.navigate(['/entrar'])
    }

    this.findAllTemas()
  }

  findAllTemas(){
    this.temaService.getAllTema().subscribe((resp: Tema[])=>{
      this.listaTemas = resp
    })
  }

  cadastrar() {

    this.temaService.postTema(this.tema).subscribe((resp: Tema) => {
      this.tema = resp

      this.alerts.showAlertSuccess("Tema cadastrado com sucesso!")

      this.findAllTemas()

      this.tema = new Tema()

    })

  }

}
