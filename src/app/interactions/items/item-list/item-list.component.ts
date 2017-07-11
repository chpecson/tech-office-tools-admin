import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline';

declare var swal: any;

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items$: AfoListObservable<any[]>;
  items: Array<any> = [];

  itemCategories$: AfoListObservable<any[]>;
  itemCategories: Array<any>;

  displayType: number;
  selectedOffice: any;

  titleText: string;

  constructor(public route: ActivatedRoute, public router: Router, public afo: AngularFireOfflineDatabase) {
    const TEMP_DISPLAY_TYPE = parseInt(localStorage.getItem('tempItemDisplayType'), 10);

    if (!!TEMP_DISPLAY_TYPE) {
      this.displayType = TEMP_DISPLAY_TYPE;
    } else {
      this.displayType = 0;
    }

    this.items$ = afo.list('/items1');
    this.itemCategories$ = afo.list('item_categories');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedOffice = decodeURIComponent(params.selectedOffice);
      this.selectedOffice = JSON.parse(this.selectedOffice);

      this.titleText = this.selectedOffice.name;
    });

    this.resetData();
  }

  resetData() {
    this.items$.subscribe((items) => {
      this.items = items.filter((item) => {
        return item.location === this.selectedOffice.name;
      });
    });

    this.itemCategories$.subscribe((itemCategories) => {
      this.itemCategories = itemCategories;
    });
  }

  goBack() {
    this.router.navigateByUrl('office');
  }

  selectDisplayType() {
    if (this.displayType === 0) {
      this.displayType = 1;
    } else {
      this.displayType = 0;
    }

    localStorage.setItem('tempItemDisplayType', this.displayType.toString());
  }

  addNew() {
    this.router.navigate(['item-form'], {
      queryParams: {
        saveType: 'add',
        location: this.titleText
      }
    })
  }

  update(item) {
    const ITEM = {
      key: item.$key,
      name: item.name,
      dateAdded: item.dateAdded,
    };

    this.router.navigate(['item-form'], {
      queryParams: {
        saveType: 'update',
        selectedItem: encodeURIComponent(JSON.stringify(item))
      }
    })
  }

  delete(item) {
    const THIS = this;

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(function () {
      THIS.items$.remove(item.$key);

      swal(
        'Deleted!',
        `${item.name} has been deleted.`,
        'success'
      ).then(() => {
        THIS.resetData();
      })
    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (!!dismiss) {
        swal(
          'Cancelled',
          `${item.name} is safe :)`,
          'error'
        )
      }
    });
  }
}
