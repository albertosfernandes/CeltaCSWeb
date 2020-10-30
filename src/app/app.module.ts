import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputSaleRequestComponent } from './components/input-sale-request/input-sale-request.component';
import { ListSaleRequestProductsComponent } from './components/list-sale-request-products/list-sale-request-products.component';
import { InputProductComponent } from './components/input-product/input-product.component';
import { ButtonsControlComponent } from './components/buttons-control/buttons-control.component';
import { HttpClientModule } from '@angular/common/http';
import { WindowSaleComponent } from './components/window-sale/window-sale.component';

@NgModule({
  declarations: [
    AppComponent,
    InputSaleRequestComponent,
    ListSaleRequestProductsComponent,
    InputProductComponent,
    ButtonsControlComponent,
    WindowSaleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
