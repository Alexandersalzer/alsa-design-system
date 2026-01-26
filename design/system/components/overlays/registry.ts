import { Modal } from './Modal/Modal';
import { Drawer } from './Drawer/Drawer';
import { Popover } from './Popover/Popover';
import { Tooltip } from './Tooltip/Tooltip';
import { Menu } from './Menu/Menu';
import { CommandMenu } from './CommandMenu/CommandMenu';

export const overlayComponents: Record<string, React.ComponentType<any>> = {
  modal: Modal,
  drawer: Drawer,
  popover: Popover,
  tooltip: Tooltip,
  menu: Menu,
  commandMenu: CommandMenu,
};