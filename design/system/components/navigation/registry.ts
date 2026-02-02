import { Tab, TabGroup } from './Tabs/Tabs';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { Pagination } from './Pagination/Pagination';
import { BackButton } from './BackButton/BackButton';
import { LanguageSelector } from './LanguageSelector/LanguageSelector';

export const navigationComponents: Record<string, React.ComponentType<any>> = {
  tab: Tab,
  tabGroup: TabGroup,
  breadcrumbs: Breadcrumbs,
  pagination: Pagination,
  backButton: BackButton,
  languageSelector: LanguageSelector,
};