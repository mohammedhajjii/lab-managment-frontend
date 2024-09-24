import {Component, ElementRef, Input, OnInit, Output, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-form-file',
  templateUrl: './form-file.component.html',
  styleUrl: './form-file.component.css'
})
export class FormFileComponent implements OnInit{

  @Input() label!: string;
  @Input() accept!: string[];
  @Input() width: string = '60%';
  @Output() fileChanges: Subject<File> = new Subject<File>();
  @ViewChild('fileChooser') fileChooserRef!: ElementRef<HTMLInputElement>;


  private formGroup!: FormGroup;
  private readonly fileReader: FileReader = new FileReader();
  size: WritableSignal<string> = signal('');
  imagePreview: WritableSignal<SafeUrl> = signal(null);
  imagePreviewIconButton: WritableSignal<string> = signal('expand_more');
  displayImagePreview: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  get name(): FormControl<string>{
    return this.formGroup.get('name') as FormControl<string>;
  }



  ngOnInit(): void {

    this.formGroup = new FormGroup({
      name: new FormControl<string>(null, {
        validators: Validators.required,
        updateOn: "change"
      } )
    });

    this.fileReader.onload = ev => {
      const unsafeImageUrl: string = ev.target.result as string | null;
      if (unsafeImageUrl)
        this.imagePreview.set(this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl));
      else
        this.imagePreview.set(null);
    };
  }


  onFileChanges(fileInput: EventTarget): void{
    const file: File = (fileInput as HTMLInputElement).files[0] as File | null;
    this.fileChanges.next(file);
    this.updateInternalState(file);
  }

  openFileChooser(event: Event) {
    event.preventDefault();
    this.fileChooserRef.nativeElement.click();
    this.name.setErrors(null);
  }

  private updateInternalState(file: File): void {
    if (!file) {
      this.name.setValue(null);
      this.size.set(null);
      return;
    }

    this.name.setValue(file.name);


    if (!this.accept.includes(file.type)){
      this.name.setErrors({fileFormat: true});
      return;
    }

    this.size.set(`size: ${(file.size / 1024).toFixed(2)}KB`);
    this.fileReader.readAsDataURL(file);

  }

  toggleImagePreview(event: Event) {
    event.preventDefault();
    this.displayImagePreview = !this.displayImagePreview;
    this.imagePreviewIconButton.set(this.imagePreviewIconButton() === 'expand_more' ? 'expand_less': 'expand_more')
  }



  isInvalid(): boolean {
    return (this.name.touched && this.name.invalid);
  }
}
