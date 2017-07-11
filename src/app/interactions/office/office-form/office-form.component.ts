import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

import { Office } from '../shared/office';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.css']
})
export class OfficeFormComponent implements OnInit {
  offices$: AfoListObservable<Office[]>;

  officeForm: FormGroup;

  selectedOffice: any;

  titleText: string;
  saveType: string;

  constructor(public route: ActivatedRoute, public router: Router, public fb: FormBuilder, public afo: AngularFireOfflineDatabase) {
    this.offices$ = afo.list('/offices');

    if (!!localStorage.getItem('tempOfficeName')) {
      this.officeForm = fb.group({
        dateAdded: new Date(),
        name: [localStorage.getItem('tempOfficeName'), Validators.required]
      });
    } else {
      this.officeForm = fb.group({
        dateAdded: new Date(),
        name: ['', Validators.required]
      });
    }
  }

  ngOnInit() {
    $('#office-name').focus();

    const PARAMS = this.route.queryParams.subscribe((params) => {
      this.saveType = params.saveType;
      if (params.saveType === 'add') {
        this.titleText = 'Add new office or lab';
      } else if (params.saveType === 'update') {
        this.selectedOffice = decodeURIComponent(params.selectedOffice);
        this.selectedOffice = JSON.parse(this.selectedOffice);

        this.titleText = `Update ${this.selectedOffice.name}`;

        this.officeForm = this.fb.group({
          dateAdded: new Date(),
          name: [this.selectedOffice.name, Validators.required]
        });
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('office');
  }

  save(form) {
    const OFFICE = {
      dateAdded: form.value.dateAdded,
      name: form.value.name
    };

    if (form.valid) {
      if (this.saveType === 'add') {
        this.offices$.push(OFFICE);

        swal(
          `Added new lab or office.`,
          `Added ${OFFICE.name} successfully.`,
          'success'
        );
      } else {
        this.offices$.update(this.selectedOffice.key, OFFICE);

        swal(
          `Updated lab or office.`,
          `Updated lab or office successfully.`,
          'success'
        );
      }

      this.router.navigateByUrl('office');
      localStorage.removeItem('tempOfficeName');
    }

  }

  saveInput(event) {
    localStorage.setItem('tempOfficeName', event.target.value);
  }

}
