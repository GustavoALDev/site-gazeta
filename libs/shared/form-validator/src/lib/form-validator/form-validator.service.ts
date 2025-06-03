import { FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { fromEvent, merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

export class FormValidatorService {
  private formGroup!: FormGroup;
  private errorMessage:{[key: string]: { [key: string]: string } } = {};
  private emitError = new Subject<{ [key: string]: string } | null>();
  private destroy$ = new Subject<void>();


  InitValidation(formGroup:FormGroup, FormControlElement:ElementRef[], errorMessage:{[key: string]: { [key: string]: string } }) {
    this.errorMessage = errorMessage;
    this.formGroup = formGroup;
    const controlBlur = FormControlElement.map((input:ElementRef)=> fromEvent(input.nativeElement, 'blur'));
    merge(...controlBlur)
    .pipe(
      takeUntil(this.destroy$),
      tap(() => {
        const errorMessages = this.WiriteMessageError();
        return errorMessages;
      }),
      switchMap(() => this.formGroup.statusChanges),
      startWith(this.formGroup.status),
      tap(() => {
        const errorMessages = this.WiriteMessageError();
        return errorMessages;
      })
    )
    .subscribe();

    return this.emitError.asObservable();
  }

  private WiriteMessageError(){
    const errorMessages = {}
    Object.keys(this.formGroup.controls).forEach((key) => {
      const control = this.formGroup.controls[key]
      if(control.touched && control.errors){
        const message = this.errorMessage[key][Object.keys(control.errors)[0]];
        Object.assign(errorMessages, {[key]: message});
      }
    })
    if(errorMessages) {
      this.emitError.next(errorMessages);
    }else {
      this.emitError.next(null);
    }
  }

  destroySubscriptions() {
    this.destroy$.next();
    this.destroy$.complete();
    this.emitError.complete();
  }

}
