import Button from './Button/Button'
import { TextLink } from './TextLink/TextLink';
import { IconButton } from './IconButton/IconButton';
import { Clickable } from './Clickable/Clickable';
import { SegmentedControl } from './SegmentedControl/SegmentedControl';
import { SelectionCard } from './SelectionCard/SelectionCard';
import { BulkActionBar } from './BulkActionBar/BulkActionBar';
import { Kbd } from './Kbd/Kbd';
import { SocialLinkButton } from './SocialLinkButton/SocialLinkButton';

export const actionComponents: Record<string, React.ComponentType<any>> = {
  button: Button,
  link: TextLink,
  iconButton: IconButton,
  clickable: Clickable,
  segmentedControl: SegmentedControl,
  selectionCard: SelectionCard,
  bulkActionBar: BulkActionBar,
  kbd: Kbd,
  socialLinkButton: SocialLinkButton,
};