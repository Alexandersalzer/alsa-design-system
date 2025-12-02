'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, VStack, Menu } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getPickerLocale, handleLocaleChange } from '../../../core/routing';

const KjFooter = ({ components = {} }: PatternNode) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale and menu options
  const menuOptions = get('menu-languageSelector').options || [];
  const currentLocale = getPickerLocale(pathname);
  const currentOption = menuOptions.find((opt: any) => opt.value === currentLocale);

  // Build logo props
  const logoProps = {
    src: renderIf('logo') && get('logo').src ? `${CDN_BASE_URL}${get('logo').src}` : undefined,
    alt: renderIf('logo') ? (get('logo').alt || 'Logo') : undefined,
    text: renderIf('typography-title') ? get('typography-title').content : undefined,
    href: '/',
    width: renderIf('logo') ? (get('logo').width || 40) : undefined,
    height: renderIf('logo') ? (get('logo').height || 40) : undefined,
    color: renderIf('logo') ? (get('logo').color || 'light') : 'light' as const,
    textSize: renderIf('typography-title') ? (get('typography-title').size || 'md') : 'md' as const,
    textWeight: renderIf('typography-title') ? (get('typography-title').weight || 'semibold') : 'semibold' as const,
    textTransform: renderIf('typography-title') ? (get('typography-title').transform || 'uppercase') : 'uppercase' as const,
    textSpacing: renderIf('typography-title') ? (get('typography-title').spacing || 'wide') : 'wide' as const,
    gap: 'md' as const,
    loading: 'lazy' as const,
    className: 'footer-logo',
  };

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Unified Logo (replaces separate LogoImage + Typography) */}
      <Logo {...logoProps} />

      {/* Language Menu */}
      {renderIf('menu-languageSelector') && (
        <Menu 
          size={get('menu-languageSelector').size || 'sm'}
          variant={get('menu-languageSelector').variant || 'subtle'}
          closeOnSelect={true}
        >
          <Menu.Trigger>
            {currentOption?.label || get('menu-languageSelector').placeholder || 'Select Language'}
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
        {renderIf('typography-email') && get('typography-email').content && (
          <Typography 
            variant="body-md"
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            <a 
              href={`mailto:${get('typography-email').content}`}
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              {get('typography-email').content}
            </a>
          </Typography>
        )}

        {/* Legal */}
        {renderIf('typography-legal') && get('typography-legal').content && (
          <Typography 
            variant="body-sm"
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            {get('typography-legal').content}
          </Typography>
        )}
      </VStack>

      {/* Attribution */}
      {renderIf('typography-attribute') && get('typography-attribute').content && (
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {get('typography-attribute').content}{' '}
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
        >}
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