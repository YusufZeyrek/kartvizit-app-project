import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from '../../models/card';
import { SnackbarService } from '../../services/snackbar.service';


@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.scss'
})
export class CardModalComponent implements OnInit {

  cardForm!: FormGroup
  showSpinner: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private _snackBar: MatSnackBar,
    private _snackBarService: SnackbarService,
    
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {

  }



  ngOnInit(): void {
    this.cardForm = this.fb.group({
      name: [this.data?.name || '', Validators.maxLength(50)],
      title: [this.data?.title || '', [Validators.required, Validators.maxLength(255)]],
      phone: [this.data?.phone || '', [Validators.required, Validators.maxLength(20)]],
      email: [this.data?.email || '', [Validators.email, Validators.maxLength(50)]],
      address: [this.data?.address || '', Validators.maxLength(255)]
    })
  }

  addCard(): void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizit başarı ile eklendi');
      }, (err: any) => {
        this.getError(err.message || "Kartvizit eklenirken bir sorun oluştu.")
      })
  }

  updateCard(): void {
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value, this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizit başarı ile güncellendi');
      }, (err: any) => {
        this.getError(err.message || "Kartvizit güncellenirken bir sorun oluştu.")
      });
  }

  deleteCard(): void {
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizit başarı ile silindi');
      }, (err: any) => {
        this.getError(err.message || "Kartvizit silinirken bir sorun oluştu.")
      }

      )

  }

  getSuccess(message: string): void {
   this._snackBarService.createSnackBar('success', message);
    this.showSpinner = false;
    this.cardService.getCards();
    this.dialogRef.close();
  }

  getError(message: string): void {
    this._snackBarService.createSnackBar('error', message);
    this.showSpinner = false;
  }



}