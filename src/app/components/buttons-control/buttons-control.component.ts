import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttons-control',
  templateUrl: './buttons-control.component.html',
  styleUrls: ['./buttons-control.component.css']
})
export class ButtonsControlComponent implements OnInit {

  isNewTemp = false;
  isAlterSaleRequest = false;
  isSaleRequestTemp = false;
  isSaleRequest = false;
  constructor() { }

  ngOnInit() {
  }

}
