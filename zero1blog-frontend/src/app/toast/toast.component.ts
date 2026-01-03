import { Component, OnInit } from '@angular/core';
import { Toast, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
