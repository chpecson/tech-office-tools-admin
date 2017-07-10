import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

declare var swal: any;

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  items$: AfoListObservable<any[]>;

  itemCategories$: AfoListObservable<any[]>;
  itemCategories: Array<any>;
  selectedItemCategory: string;
  selectedItemCategoryKey: any;

  itemStatus$: AfoListObservable<any[]>;
  itemStatus: Array<any>;
  selectedItemStatus: string;
  selectedItemStatusKey: any;

  itemForm: FormGroup;

  selectedItem: any;
  titleText: string;

  constructor(public route: ActivatedRoute, public afo: AngularFireOfflineDatabase, public fb: FormBuilder) {
    this.itemForm = fb.group({
      brand: [ '', Validators.required ],
      model: [ '', Validators.required ],
      serialNumber: [ '', Validators.required ],
      description: ''
    });

    this.items$ = afo.list('/items1');
    this.itemCategories$ = afo.list('/item_categories');
    this.itemStatus$ = afo.list('/item_status');

    this.itemCategories$.subscribe((itemCategories) => {
      this.itemCategories = itemCategories;
    });
    this.itemStatus$.subscribe((itemStatus) => {
      this.itemStatus = itemStatus;
    });

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.saveType === 'add') {
        this.titleText = 'Add new item';
      } else {
        this.selectedItem = decodeURIComponent(params.selected);
        this.selectedItem = JSON.parse(this.selectedItem);

        this.titleText = `Update ${this.selectedItem.brand} ${this.selectedItem.brand}`;
      }
    });
  }

  formatItemCategory(itemCategory) {
    return itemCategory.replace('_', ' ');
  }

  selectItemCategory(itemCategory) {
    this.selectedItemCategory = itemCategory.name;
    this.selectedItemCategoryKey = itemCategory.$key;
  }

  selectItemStatus(itemStatus) {
    this.selectedItemStatus = itemStatus.name;
    this.selectedItemStatusKey = itemStatus.$key;
  }

  addNewCategory(event) {
    const THIS = this;

    event.preventDefault();

    swal({
      title: 'Add new item category',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: function (itemCategory) {
        return new Promise(function (resolve, reject) {
          const ITEM_CATEGORY = {
            name: itemCategory
          }

          if (!itemCategory) {
            reject('Invalid item category.')
          } else {
            THIS.itemCategories$.push(ITEM_CATEGORY);
            resolve()
          }
        })
      },
      allowOutsideClick: false
    }).then(function (itemCategory) {
      swal({
        type: 'success',
        title: 'Added new item category sucessfully!',
      })
    })
  }

  addNewStatus(event) {
    const THIS = this;

    event.preventDefault();

    swal({
      title: 'Add new item status',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: function (itemStatus) {
        return new Promise(function (resolve, reject) {
          const ITEM_STATUS = {
            name: itemStatus
          };

          if (!itemStatus) {
            reject('Invalid item status.')
          } else {
            THIS.itemStatus$.push(ITEM_STATUS);
            resolve()
          }
        })
      },
      allowOutsideClick: false
    }).then(function (itemStatus) {
      swal({
        type: 'success',
        title: 'Added new item status sucessfully!',
      })
    })
  }

  save(form) {
    const ITEM = {
      category: {},
      brand: form.value.brand,
      model: form.value.model,
      serialNumber: form.value.serialNumber,
      status: this.selectedItemStatus,
      description: form.value.description
    };
    ITEM['category'][this.selectedItemCategoryKey] = true;

    this.items$.push(ITEM);
    swal(
      'Added new item',
      'You\'ve sucessfully added a new item.',
      'success'
    )
  }
}
