import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasinoService } from '../../services/casino.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta p-cont">
      <h2 class="titulo-juego">Mi Perfil</h2>
      <ng-container *ngIf="auth.usuario() as u">
        <div class="campos">
          <div><span class="lbl">Usuario:</span> {{ u.username }}</div>
          <div><span class="lbl">Email:</span> {{ u.email }}</div>
          <div><span class="lbl">Rol:</span> {{ u.rol }}</div>
          <div class="saldo"><span class="lbl">Saldo:</span> $ {{ u.saldo | number:'1.0-0' }}</div>
        </div>

        <div class="deposito">
          <h3>Recargar saldo (demo)</h3>
          <p class="hint">En un casino real esto sería una integración con un proveedor de pagos.</p>
          <div class="form-row">
            <input type="number" [(ngModel)]="monto" min="100" max="100000" step="100" />
            <button class="btn btn-primario" (click)="depositar()" [disabled]="cargando">
              {{ cargando ? 'Depositando...' : 'Depositar' }}
            </button>
          </div>
          <p *ngIf="exito" class="exito">{{ exito }}</p>
          <p *ngIf="error" class="error">{{ error }}</p>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    .p-cont { max-width: 560px; margin: 30px auto; }
    .campos { display: grid; gap: 8px; margin-bottom: 24px; }
    .lbl { color: #c8b988; font-weight: 600; margin-right: 6px; }
    .saldo { font-size: 20px; }
    .deposito { border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; }
    .deposito h3 { color: #f5c542; }
    .hint { color: #c8b988; font-size: 13px; }
    .form-row { display: flex; gap: 8px; }
    .form-row input { flex: 1; }
  `]
})
export class ProfileComponent implements OnInit {
  monto = 1000;
  cargando = false;
  exito = ''; error = '';

  constructor(public auth: AuthService, private casino: CasinoService) {}

  ngOnInit() { this.casino.miPerfil().subscribe(); }

  depositar() {
    this.exito = ''; this.error = '';
    this.cargando = true;
    this.casino.depositar(this.monto).subscribe({
      next: () => { this.cargando = false; this.exito = '¡Depositado correctamente!'; },
      error: (e) => { this.cargando = false; this.error = e.error?.error || 'Error al depositar'; }
    });
  }
}
