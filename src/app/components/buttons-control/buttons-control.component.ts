import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-buttons-control',
  templateUrl: './buttons-control.component.html',
  styleUrls: ['./buttons-control.component.css']
})
export class ButtonsControlComponent implements OnInit, OnChanges {

  isNewTemp = false;
  isAlterSaleRequest = false;
  isSaleRequestTemp = false;
  isSaleRequest = false;
  @Output() sendCancelEmit = new EventEmitter();
  constructor() { }

  sendCancel() {
    this.sendCancelEmit.emit(true);
    console.log('click botao cancel: ' + this.sendCancelEmit);
  }

  ngOnInit() {
  }
  ngOnChanges() {

  }

}
