import { Textarea } from './Textarea';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { Picker } from './Picker';
import { Input } from './Input';
import { FileUploader } from './FileUploader';
import { ImageCropper } from './ImageCropper';
import { ProfilePictureCropper } from './ProfilePictureCropper';
import { DateInput } from './DateInput';
import { TimeInput } from './TimeInput';
import { Calendar } from './Calendar';
import { DateRangePicker } from './DateRangePicker';
import { DatePicker } from './DatePicker';
import { Slider } from './Slider';

export const formComponents: Record<string, React.ComponentType<any>> = {
  textarea: Textarea,
  checkbox: Checkbox,
  radio: Radio,
  switch: Switch,
  picker: Picker,
  input: Input,
  fileUploader: FileUploader,
  imageCropper: ImageCropper,
  profilePictureCropper: ProfilePictureCropper,
  dateInput: DateInput,
  timeInput: TimeInput,
  calendar: Calendar,
  dateRangePicker: DateRangePicker,
  datePicker: DatePicker,
  slider: Slider,
};