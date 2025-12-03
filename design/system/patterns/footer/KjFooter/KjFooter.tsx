'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, VStack, Menu } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { PatternNode } from '../../../core/types/nodes';
import { componentPropsWithKey, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getPickerLocale, handleLocaleChange } from '../../../core/routing';

interface KjFooterProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const KjFooter = ({ components = {}, sectionKey, patternKey }: KjFooterProps) => {
  const getWithKey = componentPropsWithKey(components);
  const renderIf = componentPresent(components);
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale and menu options
  const menuOptions = getWithKey('menu-languageSelector').props?.options || [];
  const currentLocale = getPickerLocale(pathname);
  const currentOption = menuOptions.find((opt: any) => opt.value === currentLocale);

  // Build logo props with componentKey
  const logoProps = {
    src: renderIf('logo') && getWithKey('logo').props.src ? `${CDN_BASE_URL}${getWithKey('logo').props.src}` : undefined,
    alt: renderIf('logo') ? (getWithKey('logo').props.alt || 'Logo') : undefined,
    text: renderIf('typography-title') ? getWithKey('typography-title').props.content : undefined,
    href: '/',
    width: renderIf('logo') ? (getWithKey('logo').props.width || 40) : undefined,
    height: renderIf('logo') ? (getWithKey('logo').props.height || 40) : undefined,
    color: renderIf('logo') ? (getWithKey('logo').props.color || 'light') : 'light' as const,
    textSize: renderIf('typography-title') ? (getWithKey('typography-title').props.size || 'md') : 'md' as const,
    textWeight: renderIf('typography-title') ? (getWithKey('typography-title').props.weight || 'semibold') : 'semibold' as const,
    textTransform: renderIf('typography-title') ? (getWithKey('typography-title').props.transform || 'uppercase') : 'uppercase' as const,
    textSpacing: renderIf('typography-title') ? (getWithKey('typography-title').props.spacing || 'wide') : 'wide' as const,
    gap: 'md' as const,
    loading: 'lazy' as const,
    className: 'footer-logo',
    componentKey: renderIf('logo') ? getWithKey('logo').key : undefined,
    textComponentKey: renderIf('typography-title') ? getWithKey('typography-title').key : undefined,
  };

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Unified Logo (replaces separate LogoImage + Typography) */}
      <Logo {...logoProps} />

      {/* Language Menu */}
      {renderIf('menu-languageSelector') && (
        <Menu 
          size={getWithKey('menu-languageSelector').props.size || 'sm'}
          variant={getWithKey('menu-languageSelector').props.variant || 'subtle'}
          closeOnSelect={true}
          componentKey={getWithKey('menu-languageSelector').key}
        >
          <Menu.Trigger>
            {currentOption?.label || getWithKey('menu-languageSelector').props.placeholder || 'Select Language'}
          </Menu.Trigger>
          
          <Menu.Content>
            {menuOptions.map((option: any) => (
              <Menu.Item
                key={option.value}
                value={option.value}
                onClick={() => handleLocaleChange(router, option.value)}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu>
      )}

      {/* Body Content */}
      <VStack spacing="xs" align="center">
        {/* Email */}
        {renderIf('typography-email') && getWithKey('typography-email').props.content && (
          <Typography 
            variant="body-md"
            color="tertiary" 
            align="center"
            weight="semibold"
            componentKey={getWithKey('typography-email').key}
          >
            <a 
              href={`mailto:${getWithKey('typography-email').props.content}`}
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              {getWithKey('typography-email').props.content}
            </a>
          </Typography>
        )}

        {/* Legal */}
        {renderIf('typography-legal') && getWithKey('typography-legal').props.content && (
          <Typography 
            variant="body-sm"
            color="tertiary" 
            align="center"
            weight="semibold"
            componentKey={getWithKey('typography-legal').key}
          >
            {getWithKey('typography-legal').props.content}
          </Typography>
        )}
      </VStack>

      {/* Attribution */}
      {renderIf('typography-attribute') && getWithKey('typography-attribute').props.content && (
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
          componentKey={getWithKey('typography-attribute').key}
        >
          {getWithKey('typography-attribute').props.content}{' '}
          <a 
            href="https://blimpify-im.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--text-placeholder)', 
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
              fontWeight: 'bold'
            }}
          >
            Blimpify
          </a>
        </Typography>
      )}
    </VStack>
  );
};

// Named export
export { KjFooter };

// Default export
export default KjFooter;