import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import { Office } from '../shared/office';

declare var swal: any;

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.css']
})
export class OfficeListComponent implements OnInit {

  displayType: number;
  offices$: AfoListObservable<Office[]>;
  offices: Array<any>;

  constructor(public router: Router, public afo: AngularFireOfflineDatabase) {
    const TEMP_DISPLAY_TYPE = parseInt(localStorage.getItem('tempOfficeDisplayType'), 10);

    if (!!TEMP_DISPLAY_TYPE) {
      this.displayType = TEMP_DISPLAY_TYPE;
    } else {
      this.displayType = 0;
    }


    this.offices$ = afo.list('/offices');
  }

  ngOnInit() {
    this.offices$.subscribe((offices) => {
      this.offices = offices;
    });
  }

  selectDisplayType() {
    if (this.displayType === 0) {
      this.displayType = 1;
    } else {
      this.displayType = 0;
    }

    localStorage.setItem('tempOfficeDisplayType', this.displayType.toString());
  }

  viewDetail(office) {
    const OFFICE = {
      key: office.$key,
      dateAdded: office.dateAdded,
      name: office.name
    }

    this.router.navigate(['item'], {
      queryParams: {
        selectedOffice: encodeURIComponent(JSON.stringify(OFFICE))
      }
    })
  }

  addNew() {
    this.router.navigate(['office-form'], {
      queryParams: {
        saveType: 'add'
      }
    })
  }

  update(office) {
    const OFFICE = {
      key: office.$key,
      name: office.name,
      dateAdded: office.dateAdded,
    };

    this.router.navigate(['office-form'], {
      queryParams: {
        saveType: 'update',
        selectedOffice: encodeURIComponent(JSON.stringify(office))
      }
    })
  }

  delete(office) {
    const THIS = this;

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this office!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(function () {
      THIS.offices$.remove(office.$key);

      swal(
        'Deleted!',
        `${office.name} has been deleted.`,
        'success'
      )
    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (!!dismiss) {
        swal(
          'Cancelled',
          `${office.name} is safe :)`,
          'error'
        )
      }
    })
  }

}
