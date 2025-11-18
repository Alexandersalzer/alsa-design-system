'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, VStack, HStack, Menu } from '../../../components';
import { LogoImage } from '../../../components/media/Image';
import { PatternNode } from '../../../core/types/nodes';
import { useComponentProps, componentPresent, CDN_BASE_URL } from '../../../core/utils/helpers';
import { getPickerLocale, handleLocaleChange } from '../../../core/utils/locale';

const KjFooter = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);
  const renderIf = componentPresent(components);
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale and menu options
  const menuOptions = get('menu', 'languageSelector').options || [];
  const currentLocale = getPickerLocale(pathname, menuOptions);
  const currentOption = menuOptions.find((opt: any) => opt.value === currentLocale);

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Title with Logo */}
      <HStack spacing="md" align="center" justify="center">
        {renderIf('logo') && (
          <LogoImage
            src={`${CDN_BASE_URL}${get('logo').src}`}
            alt={get('logo').alt || 'Logo'}
            width={get('logo').width || 40}
            height={get('logo').height || 40}
            objectFit="contain"
            variant='dark'
            loading="lazy"
            className="flex-shrink-0"
          />
        )}
        <Typography 
          variant="h4" 
          color="inverse" 
          align="center"
          weight="semibold"
        >
          {get('typography', 'title').content}
        </Typography>
      </HStack>

      {/* Language Menu */}
      {renderIf('menu', 'languageSelector') && (
        <Menu 
          size={get('menu', 'languageSelector').size || 'sm'}
          variant={get('menu', 'languageSelector').variant || 'subtle'}
          closeOnSelect={true}
        >
          <Menu.Trigger>
            {currentOption?.label || get('menu', 'languageSelector').placeholder || 'Select Language'}
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
        <Typography 
          variant="body-md"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          <a 
            href={`mailto:${get('typography', 'email').content}`}
            style={{ 
              color: 'inherit', 
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {get('typography', 'email').content}
          </a>
        </Typography>

        {/* Legal */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {get('typography', 'legal').content}
        </Typography>
      </VStack>

      {/* Attribution */}
      <Typography 
        variant="body-sm"
        color="tertiary" 
        align="center"
        weight="semibold"
      >
        {get('typography', 'attribute').content}{' '}
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
    </VStack>
  );
};

export default KjFooter;