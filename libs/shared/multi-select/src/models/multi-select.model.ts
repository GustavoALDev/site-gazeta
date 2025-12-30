/**
 * Interface base para items do multi-select.
 * Qualquer objeto que tenha pelo menos 'id' e 'label' pode ser usado.
 */
export interface MultiSelectItem {
  id: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Tipo genérico que aceita qualquer objeto desde que tenha id e label.
 * Use este tipo quando quiser preservar as propriedades do seu tipo original.
 */
export type MultiSelectCompatible<T = any> = T & {
  id: string | number;
  label: string;
};

/**
 * Configuração do multi-select
 */
export interface MultiSelectConfig {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  addButtonLabel?: string;
  addMoreButtonLabel?: string;
  showSearch?: boolean;
  maxHeight?: string;
  disabled?: boolean;
}