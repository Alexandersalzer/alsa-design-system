import Textarea from './Textarea/Textarea';
import Checkbox from './Checkbox/Checkbox';
import Radio from './Radio/Radio';
import Switch from './Switch/Switch';
import Picker from './Picker/Picker';
import Input from './Input/Input';
import FileUploader from './FileUploader/FileUploader';
import ImageCropper from './ImageCropper/ImageCropper';
import ProfilePictureCropper from './ProfilePictureCropper/ProfilePictureCropper';
import DateInput from './DateInput/DateInput';
import TimeInput from './TimeInput/TimeInput';
import Calendar from './Calendar/Calendar';
import DateRangePicker from './DateRangePicker/DateRangePicker';
import DatePicker from './DatePicker/DatePicker';
import Slider from './Slider/Slider';

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