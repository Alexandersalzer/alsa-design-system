import { Modal } from './Modal';
import { Popover } from './Popover';
import { Menu } from './Menu';
import { CommandMenu } from './CommandMenu';
import { Tooltip } from './Tooltip';
import { Drawer } from './Drawer';

export const overlayComponents: Record<string, React.ComponentType<any>> = {
  modal: Modal,
  popover: Popover,
  menu: Menu,
  commandMenu: CommandMenu,
  tooltip: Tooltip,
  drawer: Drawer,
};