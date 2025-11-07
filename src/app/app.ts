import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { CartSidebarComponent } from "./shared/components/cart-sidebar/cart-sidebar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CartSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lushka-web');
}
