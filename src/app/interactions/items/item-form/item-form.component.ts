import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

declare var swal: any;

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  saveType: string;

  items$: AfoListObservable<any[]>;

  itemCategories$: AfoListObservable<any[]>;
  itemCategories: Array<any>;
  selectedItemCategory: string;
  selectedItemCategoryKey: any;

  itemStatus$: AfoListObservable<any[]>;
  itemStatus: Array<any>;
  selectedItemStatus: string;
  selectedItemStatusKey: any;

  itemLocations$: AfoListObservable<any[]>;
  itemLocations: Array<any>;
  selecteditemLocation: string;
  selecteditemLocationKey: any;

  itemForm: FormGroup;

  selectedItem: any;
  titleText: string;

  // tslint:disable-next-line:max-line-length
  constructor(public route: ActivatedRoute, public router: Router, public afo: AngularFireOfflineDatabase, public fb: FormBuilder, public location: Location) {
    this.itemForm = fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      description: ''
    });

    this.items$ = afo.list('/items1');
    this.itemCategories$ = afo.list('/item_categories');
    this.itemStatus$ = afo.list('/item_status');
    this.itemLocations$ = afo.list('/offices');

    this.itemCategories$.subscribe((itemCategories) => {
      this.itemCategories = itemCategories;
      this.selectedItemCategory = this.itemCategories[0].name;
    });
    this.itemStatus$.subscribe((itemStatus) => {
      this.itemStatus = itemStatus;
      this.selectedItemStatus = this.itemStatus[0].name;
      this.selectedItemStatusKey = this.itemStatus[0].$key;
    });
    this.itemLocations$.subscribe((itemLocations: any) => {
      this.itemLocations = itemLocations;
      this.selecteditemLocationKey = this.itemLocations[0].$key;
    });

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.saveType = params.saveType;

      if (params.saveType === 'add') {
        this.titleText = 'Add new item';
        this.selecteditemLocation = params.location;
      } else {
        this.selectedItem = decodeURIComponent(params.selectedItem);
        this.selectedItem = JSON.parse(this.selectedItem);

        this.titleText = `Update ${this.selectedItem.brand} ${this.selectedItem.brand}`;

        this.selecteditemLocation = this.selectedItem.location;
        this.itemForm = this.fb.group({
          brand: [this.selectedItem.brand, Validators.required],
          model: [this.selectedItem.model, Validators.required],
          serialNumber: [this.selectedItem.serialNumber, Validators.required],
          description: this.selectedItem.description
        });
      }
    });
  }

  goBack(event?) {
    if (!!event) {
      event.preventDefault();
    }

    this.location.back();
  }

  formatItemCategory(itemCategory) {
    return itemCategory.replace('_', ' ');
  }

  selectItemCategory(itemCategory) {
    this.selectedItemCategory = itemCategory.name;
    this.selectedItemCategoryKey = itemCategory.$key;

    console.log(itemCategory)
  }

  selectItemStatus(itemStatus) {
    this.selectedItemStatus = itemStatus.name;
    this.selectedItemStatusKey = itemStatus.$key;
  }

  selectItemLocation(itemLocation) {
    console.log(itemLocation);

    this.selecteditemLocation = itemLocation.name;
    this.selecteditemLocationKey = itemLocation.$key;
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

  addNewItemLocation(event) {
    const THIS = this;

    event.preventDefault();

    swal({
      title: 'Add new item location',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: function (itemLocation) {
        return new Promise(function (resolve, reject) {
          const ITEM_STATUS = {
            dateAdded: new Date(),
            name: itemLocation
          };

          if (!itemLocation) {
            reject('Invalid item status.')
          } else {
            THIS.itemLocations$.push(ITEM_STATUS);
            THIS.goBack();
            resolve()
          }
        })
      },
      allowOutsideClick: false
    }).then(function (itemStatus) {
      swal({
        type: 'success',
        title: 'Added new item\'s location sucessfully!',
      })
    })
  }

  save(form) {
    const THIS = this;

    console.log(this.selectedItem);

    const ITEM = {
      category: this.selectedItemCategory,
      brand: form.value.brand,
      model: form.value.model,
      serialNumber: form.value.serialNumber,
      status: this.selectedItemStatus,
      description: form.value.description,
      location: this.selecteditemLocation
    };

    if (this.saveType === 'add') {
      this.items$.push(ITEM);
      swal(
        'Added new item',
        'You\'ve sucessfully added a new item.',
        'success'
      ).then(() => {
        THIS.goBack();
      });
    } else {
      this.items$.update(this.selectedItem.key, ITEM);
      swal(
        'Updated an item',
        'You\'ve sucessfully updated an item.',
        'success'
      ).then(() => {
        THIS.goBack();
      });
    }

  }
}
