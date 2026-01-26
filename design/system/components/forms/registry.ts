import { Textarea } from './Textarea/Textarea';
import { Input } from './Input/Input';
import { Checkbox } from './Checkbox/Checkbox';
import { Radio } from './Radio/Radio';
import { Switch } from './Switch/Switch';
import { Slider } from './Slider/Slider';
import { DateInput } from './DateInput/DateInput';
import { TimeInput } from './TimeInput/TimeInput';
import { DatePicker } from './DatePicker/DatePicker';
import { DateRangePicker } from './DateRangePicker/DateRangePicker';
import { Calendar } from './Calendar/Calendar';
import { Picker } from './Picker/Picker';
import { FileUploader } from './FileUploader/FileUploader';
import { ImageCropper } from './ImageCropper/ImageCropper';
import { ProfilePictureCropper } from './ProfilePictureCropper/ProfilePictureCropper';

export const formComponents: Record<string, React.ComponentType<any>> = {
  textarea: Textarea,
  input: Input,
  checkbox: Checkbox,
  radio: Radio,
  switch: Switch,
  slider: Slider,
  dateInput: DateInput,
  timeInput: TimeInput,
  datePicker: DatePicker,
  dateRangePicker: DateRangePicker,
  calendar: Calendar,
  picker: Picker,
  fileUploader: FileUploader,
  imageCropper: ImageCropper,
  profilePictureCropper: ProfilePictureCropper,
};