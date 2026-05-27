import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validator-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './validator-login.component.html',
  styleUrl: './validator-login.component.css',
})
export class ValidatorLoginComponent {
  @Input() error: string | null = null;
  @Input() loading = false;
  @Output() submitted = new EventEmitter<{ username: string; password: string }>();

  username = '';
  password = '';

  onSubmit(): void {
    this.submitted.emit({ username: this.username, password: this.password });
  }
}
