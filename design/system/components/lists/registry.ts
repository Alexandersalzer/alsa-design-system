import { List } from './List/List';
import { Listbox } from './Listbox/Listbox';

export const listComponents: Record<string, React.ComponentType<any>> = {
  list: List,
  listbox: Listbox,
};