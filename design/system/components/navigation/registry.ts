import { Pagination } from './Pagination/Pagination';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { BackButton } from './BackButton/BackButton';
import { Tab, TabGroup, TabPanel } from './Tabs/Tabs';
import { Nav } from './Nav/Nav';

export const navigationComponents: Record<string, React.ComponentType<any>> = {
  pagination: Pagination,
  breadcrumbs: Breadcrumbs,
  backButton: BackButton,
  tab: Tab,
  tabGroup: TabGroup,
  tabPanel: TabPanel,
  navRoot: Nav.Root,
  navList: Nav.List,
  navItem: Nav.Item,
  navSection: Nav.Section,
};