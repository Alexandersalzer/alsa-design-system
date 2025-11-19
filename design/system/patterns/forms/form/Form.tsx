// ===============================================
// blimpify-ui/design/system/patterns/forms/form/Form.tsx
// FORM PATTERN - Generic, composable form builder
// ===============================================

import React from 'react';
import { VStack, HStack, Grid, GridItem } from '../../../components/layout';
import { 
  Button, 
  Input, 
  Textarea,
  Checkbox,
  Radio,
  Switch,
  FileUploader,
  Picker,
  Icon 
} from '../../../components';
import { 
  EnvelopeIcon, 
  ArrowRightIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  AtSymbolIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export interface FormPatternProps {
  components?: Record<string, any>;
  settings?: {
    layout?: 'stack' | 'grid' | 'inline';
    columns?: number;
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    direction?: 'vertical' | 'horizontal';
    fullWidth?: boolean;
  };
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Icon mapping
const iconMap: Record<string, any> = {
  email: EnvelopeIcon,
  user: UserIcon,
  building: BuildingOfficeIcon,
  rightArrow: ArrowRightIcon,
  phone: PhoneIcon,
  location: MapPinIcon,
  lock: LockClosedIcon,
  at: AtSymbolIcon,
  message: ChatBubbleLeftRightIcon,
};

// Component registry
const formComponentRegistry: Record<string, React.ComponentType<any>> = {
  input: (props: any) => {
    const { 
      label, 
      placeholder, 
      leftIcon, 
      rightIcon,
      variant = 'text', 
      name, 
      required,
      disabled,
      error,
      helper,
      fullWidth, // ✅ Extract but don't pass to Input
      ...rest 
    } = props;
    
    const leftIconComponent = leftIcon && iconMap[leftIcon] ? (
      <Icon size="sm" color="secondary">
        {React.createElement(iconMap[leftIcon])}
      </Icon>
    ) : undefined;

    const rightIconComponent = rightIcon && iconMap[rightIcon] ? (
      <Icon size="sm" color="secondary">
        {React.createElement(iconMap[rightIcon])}
      </Icon>
    ) : undefined;

    return (
      <Input
        type={variant}
        name={name}
        label={label}
        placeholder={placeholder}
        leftIcon={leftIconComponent}
        rightIcon={rightIconComponent}
        error={error}
        helper={helper}
        required={required}
        disabled={disabled}
        size="md"
        radius="md"
        style={fullWidth ? { width: '100%' } : undefined} // ✅ Apply as style instead
        {...rest}
      />
    );
  },
  
  textarea: (props: any) => {
    const { 
      label, 
      placeholder, 
      name, 
      rows = 4,
      required,
      disabled,
      error,
      helper,
      fullWidth, // ✅ Extract but don't pass to Textarea
      ...rest 
    } = props;
    
    return (
      <Textarea
        name={name}
        label={label}
        placeholder={placeholder}
        rows={rows}
        error={error}
        helper={helper}
        required={required}
        disabled={disabled}
        style={fullWidth ? { width: '100%' } : undefined} // ✅ Apply as style instead
        {...rest}
      />
    );
  },
  
  checkbox: (props: any) => {
    const { 
      label, 
      name, 
      checked,
      disabled,
      required,
      fullWidth, // ✅ Extract
      ...rest 
    } = props;
    
    return (
      <Checkbox
        name={name}
        label={label}
        checked={checked}
        disabled={disabled}
        required={required}
        {...rest}
      />
    );
  },
  
  radio: (props: any) => {
    const { 
      label, 
      name, 
      options = [],
      value,
      disabled,
      required,
      orientation = 'vertical',
      fullWidth, // ✅ Extract
      ...rest 
    } = props;
    
    return (
      <Radio
        name={name}
        label={label}
        options={options}
        value={value}
        disabled={disabled}
        required={required}
        orientation={orientation}
        {...rest}
      />
    );
  },
  
  switch: (props: any) => {
    const { 
      label, 
      name, 
      checked,
      disabled,
      fullWidth, // ✅ Extract
      ...rest 
    } = props;
    
    return (
      <Switch
        name={name}
        label={label}
        checked={checked}
        disabled={disabled}
        {...rest}
      />
    );
  },
  
  fileUploader: (props: any) => {
    const { 
      label, 
      name, 
      accept,
      multiple,
      maxSize,
      disabled,
      helper,
      fullWidth, // ✅ Extract
      ...rest 
    } = props;
    
    return (
      <FileUploader
        name={name}
        label={label}
        accept={accept}
        multiple={multiple}
        maxSize={maxSize}
        disabled={disabled}
        helper={helper}
        {...rest}
      />
    );
  },
  
  picker: (props: any) => {
    const { 
      label, 
      name, 
      options = [],
      placeholder,
      value,
      disabled,
      required,
      error,
      helper,
      fullWidth, // ✅ Extract
      ...rest 
    } = props;
    
    return (
      <Picker
        name={name}
        label={label}
        options={options}
        placeholder={placeholder}
        value={value}
        error={error}
        helper={helper}
        disabled={disabled}
        required={required}
        style={fullWidth ? { width: '100%' } : undefined} // ✅ Apply as style
        {...rest}
      />
    );
  },
  
  button: (props: any) => {
    const { content, fullWidth, colSpan, rowSpan, ...rest } = props; // ✅ Extract fullWidth, colSpan, rowSpan
    
    const buttonType = content?.type || 'primary';
    const buttonText = content?.content || 'Submit';
    const leftIconName = content?.leftIcon;
    const rightIconName = content?.rightIcon;
    
    const buttonVariantToIconColor = {
      primary: 'button-primary',
      secondary: 'button-secondary',
      accent: 'button-accent',
      ghost: 'button-ghost',
      destructive: 'button-destructive',
    } as const;
    
    const iconColor = buttonVariantToIconColor[buttonType as keyof typeof buttonVariantToIconColor] || 'button-primary';
    
    const leftIconComponent = leftIconName && iconMap[leftIconName] ? (
      <Icon size="sm" color={iconColor}>
        {React.createElement(iconMap[leftIconName])}
      </Icon>
    ) : undefined;

    const rightIconComponent = rightIconName && iconMap[rightIconName] ? (
      <Icon size="sm" color={iconColor}>
        {React.createElement(iconMap[rightIconName])}
      </Icon>
    ) : undefined;

    return (
      <Button
        type="submit"
        variant={buttonType as any}
        size="lg"
        radius="md"
        leftIcon={leftIconComponent}
        rightIcon={rightIconComponent}
        style={fullWidth ? { width: '100%' } : undefined} // ✅ Apply as style instead
        {...rest}
      >
        {buttonText}
      </Button>
    );
  },
};

export const FormPattern: React.FC<FormPatternProps> = ({ 
  components,
  settings = {},
  onSubmit 
}) => {
  const {
    layout = 'stack',
    columns = 2,
    spacing = 'lg',
    direction = 'vertical',
    fullWidth = true,
  } = settings;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    } else {
      const formData = new FormData(e.currentTarget);
      console.log('Form submitted:', Object.fromEntries(formData));
    }
  };

  // Render all components based on layout
  const renderComponents = () => {
    if (!components) return null;

    const componentEntries = Object.entries(components);

    // STACK LAYOUT (Vertical or Horizontal)
    if (layout === 'stack') {
      const StackComponent = direction === 'horizontal' ? HStack : VStack;
      return (
        <StackComponent spacing={spacing} align="stretch" style={fullWidth ? { width: '100%' } : undefined}>
          {componentEntries.map(([key, data]: [string, any]) => {
            const ComponentType = formComponentRegistry[data.type];
            
            if (!ComponentType) {
              console.warn(`Unknown form component type: ${data.type}`);
              return null;
            }

            return (
              <div key={key} style={{ width: '100%' }}>
                <ComponentType {...data} />
              </div>
            );
          })}
        </StackComponent>
      );
    }

    // GRID LAYOUT
    if (layout === 'grid') {
      return (
        <Grid columns={columns} gap={spacing}>
          {componentEntries.map(([key, data]: [string, any]) => {
            const ComponentType = formComponentRegistry[data.type];
            
            if (!ComponentType) {
              console.warn(`Unknown form component type: ${data.type}`);
              return null;
            }

            // Extract layout properties
            const { colSpan, rowSpan, ...componentProps } = data;

            // Use GridItem for proper span support
            if (colSpan || rowSpan) {
              return (
                <GridItem key={key} colSpan={colSpan} rowSpan={rowSpan}>
                  <ComponentType {...componentProps} />
                </GridItem>
              );
            }

            // Regular rendering without spans
            return (
              <div key={key}>
                <ComponentType {...componentProps} />
              </div>
            );
          })}
        </Grid>
      );
    }

    // INLINE LAYOUT (HStack with wrapping)
    if (layout === 'inline') {
      return (
        <HStack spacing={spacing} wrap align="start">
          {componentEntries.map(([key, data]: [string, any]) => {
            const ComponentType = formComponentRegistry[data.type];
            
            if (!ComponentType) {
              console.warn(`Unknown form component type: ${data.type}`);
              return null;
            }

            return (
              <div key={key}>
                <ComponentType {...data} />
              </div>
            );
          })}
        </HStack>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="form-pattern">
      {renderComponents()}
    </form>
  );
};

FormPattern.displayName = 'FormPattern';