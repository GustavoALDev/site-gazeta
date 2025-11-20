import { FormControl } from '@angular/forms';


export interface AdsFormValue {
  title: string;
  description: string;
  clickUrl: string | null;
  position: string;
  placement: string;
  size: string;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  image: string;
}


export interface AdsFormControls {
  title: FormControl<string>;
  description: FormControl<string>;
  clickUrl: FormControl<string | null>;
  position: FormControl<string>;
  placement: FormControl<string>;
  size: FormControl<string>;
  isActive: FormControl<boolean>;
  priority: FormControl<number>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  image: FormControl<string>;
}


export interface SelectOption {
  value: string;
  label: string;
  pages?: ('home' | 'content')[];
}

export interface AdsComponentState {
  activeTab: 'form' | 'list';
  selectedFile: File | null;
  selectedFileName: string;
  imagePreviewUrl: string | null;
  isEdit: boolean;
  adId: number;
  isLoading: boolean;
  isSubmitting: boolean;
}

export interface AdsFilters {
  position: string;
  placement: string;
  status: string;
  search: string;
}


export interface SortConfig {
  field: keyof AdsFormValue | 'id';
  direction: 'asc' | 'desc';
}

