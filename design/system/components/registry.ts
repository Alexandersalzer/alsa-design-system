// blimpify-ui/design/system/components/registry.ts
import { Button } from './actions/Button/Button';
import { IconButton } from './actions/IconButton/IconButton';
import { SegmentedControl}  from './actions/SegmentedControl/SegmentedControl';
import { TextLink } from './actions/TextLink/TextLink';
import { CarouselAnimation } from './CarouselAnimation';
import { CountUp } from './CountUp';
import { Banner, Spinner, Tag, Toast } from './feedback';
import { Checkbox, FileUploader, Input, Picker, Radio, Switch, Textarea } from './forms';
import { LineChart } from './LineChart';
import { Listbox } from './lists/Listbox';
import { Logo } from './Logo';
import { LogoIcon } from './LogoIcon';
import { Avatar, Icon, VideoShowcase } from './media';
import { Menu, Modal, Popover } from './overlays';
import { Table } from './Table';
import { Typography } from './Typography';


export const componentRegistry: Record<string, React.ComponentType<any>> = {
  button: Button,
  iconButton: IconButton,
  segmentedControl: SegmentedControl,
  textLink: TextLink,
  carouselAnimation: CarouselAnimation,
  countUp: CountUp,
  banner: Banner,
  spinner: Spinner,
  tag: Tag,
  toast: Toast,
  checkbox: Checkbox,
  fileUploader: FileUploader,
  input: Input,
  picker: Picker,
  radio: Radio,
  switch: Switch,
  textarea: Textarea,
  lineChart: LineChart,
  listbox: Listbox,
  logo: Logo,
  logoIcon: LogoIcon,
  avatar: Avatar,
  icon: Icon,
  videoShowcase: VideoShowcase,
  menu: Menu,
  modal: Modal,
  popover: Popover,
  table: Table,
  text: Typography,
}; 