import { Nav } from './Nav/Nav';
import { Tabs } from './Tabs/Tabs';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { Pagination } from './Pagination/Pagination';
import { BackButton } from './BackButton/BackButton';

export const navigationComponents: Record<string, React.ComponentType<any>> = {
  nav: Nav,
  tabs: Tabs,
  breadcrumbs: Breadcrumbs,
  pagination: Pagination,
  backButton: BackButton,
};