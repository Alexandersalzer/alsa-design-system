import { ContentPage, GlobalComponent } from '../wrappers/content/ContentProvider';

// Content structure types - now using the generic interfaces from ContentProvider
export interface WebsiteContent {
  pages: { [key: string]: ContentPage };
  globals?: { [key: string]: GlobalComponent };
}

