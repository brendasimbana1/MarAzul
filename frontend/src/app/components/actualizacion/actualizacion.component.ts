import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
declare var M: any;

@Component({
  selector: 'app-actualizacion',
  templateUrl: './actualizacion.component.html',
  styleUrls: ['./actualizacion.component.css']
})

export class ActualizacionComponent implements OnInit, AfterViewInit {
  updateForm: FormGroup;
  menuItems: any[] = [];

  constructor(
    private authService: TasksService,
    private fb: FormBuilder,
    private el: ElementRef,
    private router:Router
  ) {
    this.updateForm = this.fb.group({
      menuItem: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMenuItems();
  }

  ngAfterViewInit() {
    M.AutoInit(); // Inicializa todos los componentes de Materialize en la vista actual
  }

  loadMenuItems(): void {
    this.authService.getMenu().subscribe((data: any) => {
      this.menuItems = data;
      setTimeout(() => {
        const selectElements = this.el.nativeElement.querySelectorAll('select');
        M.FormSelect.init(selectElements, {});
      }, 0); // Inicializa Materialize select después de que la vista se haya actualizado
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const { menuItem, description } = this.updateForm.value;
      console.log(menuItem); 
      console.log(description);
      this.authService.updatePlato(menuItem, description).subscribe(
        response => {
          alert('Descripción actualizada correctamente');
          this.updateForm.reset();
          this.router.navigate(['/menu'])
        },
        error => {
          console.error('Error al actualizar la descripción', error);
          this.router.navigate(['/menu'])
        }
      );
    } else {
      alert('Por favor completa el formulario correctamente');
    }
  }
}
