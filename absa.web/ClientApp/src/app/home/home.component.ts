import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { first } from 'rxjs/operators';

import { DialogUpsertComponent } from '../dialog/dialog-upsert.component';

@Component({
  selector: 'app-home',
  styleUrls: ['home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['cud', 'lastName', 'firstName', 'phoneNumber', 'imageUrl'];
  dataSource: MatTableDataSource<any>;
  form: FormGroup;
  dialogRef: MatDialogRef<DialogUpsertComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterfirstName = new FormControl('');
  filterlastName = new FormControl('');
  filterphoneNumber = new FormControl('');
  filterValues = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private _formBuilder: FormBuilder
  ) {
    this.getData().then(x => { 
      this.isLoading = false;
    });
  }

  ngOnInit() {
  }

  getData() {
    var promise = new Promise((resolve, reject) => {
      try {
        this.apiService.getItems('phonebooks').pipe(first()).subscribe(result => {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.tableFilter();
          this.initFilter();
          resolve(true);
        });
      } catch (exception) {
        resolve(false);
      }
    });
    return promise;
  }

  initFilter() {
    this.filterfirstName.valueChanges
      .subscribe(
        firstName => {
          this.filterValues.firstName = firstName;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.filterlastName.valueChanges
      .subscribe(
        lastName => {
          this.filterValues.lastName = lastName;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.filterphoneNumber.valueChanges
      .subscribe(
        phoneNumber => {
          this.filterValues.phoneNumber = phoneNumber;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }
  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
        && data.lastName.toLowerCase().indexOf(searchTerms.lastName) !== -1
        && data.phoneNumber.toLowerCase().indexOf(searchTerms.phoneNumber) !== -1;
    }
    return filterFunction;
  }

  initUpsert(row) {
    let phonePattern = "[0-9]{10}";

    this.form = this._formBuilder.group({
      firstName: [row == null ? '' : row.firstName, Validators.required],
      lastName: [row == null ? '' : row.lastName, Validators.required],
      phoneNumber: [row == null ? 0 : row.phoneNumber, [Validators.required,Validators.pattern(phonePattern)]],
      imageUrl: [row == null ? '' : row.imageUrl, Validators.required]
    });

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      item: row,
      form: this.form,
      title: row == null ? 'Insert' : 'Update'
    }

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.ariaLabel = 'fffff';
    dialogConfig.width = "800px";

    const dialogRef = this.dialog.open(DialogUpsertComponent,
      dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.isLoading = true;
        if (row == null) {
          this.apiService.createItem('phonebooks', result).subscribe(r => {
            this.getData().then(() => {
              this.isLoading = false;
            });
          });
        } else {
          result.id = row.id;
          result.company_id = 1;
          result.changed_by = 1;
          result.active = true;
          this.apiService.updatItem('phonebooks', result).subscribe(r => {
            this.getData().then(() => {
              this.isLoading = false;
            });
          });
        }
      }
    });
  }
  initDelete(id) {
    if (confirm('Are you sure you want to delete item?')) {
      this.isLoading = true;
      this.apiService.deleteItem('phonebooks', id).subscribe(r => {
        this.getData().then(() => {
          this.isLoading = false;
        });
      });
    }
  }
}
