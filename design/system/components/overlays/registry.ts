import { Modal } from './Modal/Modal';
import { Popover } from './Popover/Popover';
import { Menu } from './Menu/Menu';
import { CommandMenu } from './CommandMenu/CommandMenu';
import { Tooltip } from './Tooltip/Tooltip';
import Drawer from './Drawer/Drawer';

export const overlayComponents: Record<string, React.ComponentType<any>> = {
  modal: Modal,
  popover: Popover,
  menu: Menu,
  commandMenu: CommandMenu,
  tooltip: Tooltip,
  drawer: Drawer,
};