import Button from './Button/Button'
import { TextLink } from './TextLink'
import { SelectionCard } from './SelectionCard'
import { SegmentedControl } from './SegmentedControl'
import { Kbd } from './Kbd'
import { IconButton } from './IconButton'
import { Clickable } from './Clickable'
import { BulkActionBar } from './BulkActionBar'


export const actionComponents: Record<string, React.ComponentType<any>> = {
  button: Button,
  textLink: TextLink,
  selectionCard: SelectionCard,
  segmentedControl: SegmentedControl,
  kbd: Kbd,
  iconButton: IconButton,
  clickable: Clickable,
  bulkActionBar: BulkActionBar,
};