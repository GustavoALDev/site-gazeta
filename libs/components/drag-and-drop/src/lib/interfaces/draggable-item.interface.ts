/**
 * Interface base para itens arrastáveis em listas hierárquicas
 */
export interface DraggableItem {
  /** Identificador único do item - pode ser opcional para novos items */
  id?: number | string;
  /** Children opcionais para criar hierarquia */
  children?: DraggableItem[];
  /** Permite adicionar propriedades customizadas */
  [key: string]: any;
}
