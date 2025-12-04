'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, VStack, Menu } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getPickerLocale, handleLocaleChange } from '../../../core/routing';

interface KjFooterProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const KjFooter = ({ components = {}, sectionKey, patternKey }: KjFooterProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale and menu options
  const menuOptions = get('menu-languageSelector').props?.options || [];
  const currentLocale = getPickerLocale(pathname);
  const currentOption = menuOptions.find((opt: any) => opt.value === currentLocale);

  // Build logo props with componentKey
  const logoProps = {
    src: renderIf('logo') && get('logo').props.src ? `${CDN_BASE_URL}${get('logo').props.src}` : undefined,
    alt: renderIf('logo') ? (get('logo').props.alt || 'Logo') : undefined,
    text: renderIf('typography-title') ? get('typography-title').props.content : undefined,
    href: '/',
    width: renderIf('logo') ? (get('logo').props.width || 40) : undefined,
    height: renderIf('logo') ? (get('logo').props.height || 40) : undefined,
    color: renderIf('logo') ? (get('logo').props.color || 'light') : 'light' as const,
    textSize: renderIf('typography-title') ? (get('typography-title').props.size || 'md') : 'md' as const,
    textWeight: renderIf('typography-title') ? (get('typography-title').props.weight || 'semibold') : 'semibold' as const,
    textTransform: renderIf('typography-title') ? (get('typography-title').props.transform || 'uppercase') : 'uppercase' as const,
    textSpacing: renderIf('typography-title') ? (get('typography-title').props.spacing || 'wide') : 'wide' as const,
    gap: 'md' as const,
    loading: 'lazy' as const,
    className: 'footer-logo',
    componentKey: renderIf('logo') ? get('logo').key : undefined,
    textComponentKey: renderIf('typography-title') ? get('typography-title').key : undefined,
  };

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Unified Logo (replaces separate LogoImage + Typography) */}
      <Logo {...logoProps} />

      {/* Language Menu */}
      {renderIf('menu-languageSelector') && (
        <Menu 
          size={get('menu-languageSelector').props.size || 'sm'}
          variant={get('menu-languageSelector').props.variant || 'subtle'}
          closeOnSelect={true}
          componentKey={get('menu-languageSelector').key}
        >
          <Menu.Trigger>
            {currentOption?.label || get('menu-languageSelector').props.placeholder || 'Select Language'}
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
        {renderIf('typography-email') && get('typography-email').props.content && (
          <Typography 
            variant="body-md"
            color="tertiary" 
            align="center"
            weight="semibold"
            componentKey={get('typography-email').key}
          >
            <a 
              href={`mailto:${get('typography-email').props.content}`}
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              {get('typography-email').props.content}
            </a>
          </Typography>
        )}

        {/* Legal */}
        {renderIf('typography-legal') && get('typography-legal').props.content && (
          <Typography 
            variant="body-sm"
            color="tertiary" 
            align="center"
            weight="semibold"
            componentKey={get('typography-legal').key}
          >
            {get('typography-legal').props.content}
          </Typography>
        )}
      </VStack>

      {/* Attribution */}
      {renderIf('typography-attribute') && get('typography-attribute').props.content && (
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
          componentKey={get('typography-attribute').key}
        >
          {get('typography-attribute').props.content}{' '}
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