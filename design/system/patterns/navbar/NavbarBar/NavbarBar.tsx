'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../../../utils/cn';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { MenuIcon, XIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { componentProps, componentPresent, patternProps, useMapComponents } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { alignMap } from '../utils';
import './NavbarBar.css';
import { PatternNode } from '../../../core/types/nodes';
import { AnimationConfig } from '../../../components/animations/types';

interface NavbarBarProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const NavbarBar = ({ components = {}, sectionKey, patternKey, ...patternNode }: NavbarBarProps) => {
    const get = componentProps(components);
    const getPatternProps = patternProps({ components, ...patternNode });
    const renderIf = componentPresent(components);
    const mapComponentIndices = useMapComponents(components);
    const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];


  const desktopAlign = alignMap[getPatternProps().menuAlign] || 'center';
  const mobileAlign =
    alignMap[getPatternProps().mobileMenuAlign] ||
    alignMap[getPatternProps().menuAlign] ||
    'center';
  const mobileVariant = getPatternProps().mobileMenuVariant || 'fullscreen';

  // Background variant and border props
  const backgroundVariant = getPatternProps().backgroundVariant || 'default';
  const showBorder = getPatternProps().showBorder !== false; // Default true
  const hideOnScroll = getPatternProps().hideOnScroll || false;

  // Animation configuration for drawer items
  const drawerAnimation = getPatternProps().drawerAnimation as AnimationConfig | undefined;
  const enableDrawerAnimation = drawerAnimation && drawerAnimation.type !== 'none';

  // Extract animation settings based on type
  const getAnimationSettings = () => {
    if (!drawerAnimation || drawerAnimation.type === 'none') {
      return { duration: 400, stagger: 50, direction: 'down' as const };
    }

    if (drawerAnimation.type === 'fadeIn') {
      return {
        duration: drawerAnimation.settings?.duration || 400,
        stagger: drawerAnimation.settings?.stagger || 50,
        direction: drawerAnimation.settings?.direction || 'down' as const,
      };
    }

    // Fallback for other animation types
    return { duration: 400, stagger: 50, direction: 'down' as const };
  };

  const { duration: animationDuration, stagger: animationStagger, direction: animationDirection } = getAnimationSettings();

  // Handle scroll behavior for transparent → glass transition
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect if scrolled (threshold of 8px feels snappy)
      setIsScrolled(currentScrollY > 8);

      // Hide on scroll down, show on scroll up
      if (hideOnScroll) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down & past threshold
          setIsHidden(true);
        } else {
          // Scrolling up
          setIsHidden(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    // Run on mount to handle page loads when already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScroll]);

  // Auto-close drawer when screen becomes desktop size (debounced)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth > 1024) {
          setMobileOpen(false);
        }
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes (navigation happens)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu when hash changes (anchor link navigation)
  useEffect(() => {
    const handleHashChange = () => {
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Build logo props with componentKey
  const logoSrc = renderIf('logo') ? get('logo').props.src : undefined;
  const logoProps = {
    src: logoSrc ? (logoSrc.startsWith('http') ? logoSrc : `${CDN_BASE_URL}${logoSrc}`) : undefined,
    alt: renderIf('logo') ? (get('logo').props.alt || 'Logo') : undefined,
    text: undefined,
    href: `/${currentLocale}`,
    width: renderIf('logo') ? (get('logo').props.width || 40) : undefined,
    height: renderIf('logo') ? (get('logo').props.height || 40) : undefined,
    color: renderIf('logo') ? (get('logo').props.color || 'auto') : 'auto' as const,
    textSize: renderIf('typography-businessName') ? (get('typography-businessName').props.size || 'lg') : 'lg' as const,
    textWeight: renderIf('typography-businessName') ? (get('typography-businessName').props.weight || 'extrabold') : 'extrabold' as const,
    textTransform: renderIf('typography-businessName') ? (get('typography-businessName').props.transform || 'none') : 'none' as const,
    textSpacing: renderIf('typography-businessName') ? (get('typography-businessName').props.spacing || 'normal') : 'normal' as const,
    textGradient: renderIf('typography-businessName') ? (get('typography-businessName').props.gradient || false) : false,
    gap: renderIf('logo') && renderIf('typography-businessName') ? (getPatternProps().logoGap || 'sm') : 'sm' as const,
    hideTextOnMobile: getPatternProps().hideLogoTextOnMobile || false,
    loading: 'eager' as const,
    priority: true,
    componentKey: renderIf('logo') ? get('logo').key : undefined,
    textComponentKey: renderIf('typography-businessName') ? get('typography-businessName').key : undefined,
  };

  return (
    <nav className={cn(
      "navbar-bar",
      backgroundVariant !== 'default' && `navbar-bar--${backgroundVariant}`,
      !showBorder && "navbar-bar--no-border",
      hideOnScroll && "navbar-bar--hide-on-scroll",
      isHidden && "navbar-bar--hidden",
      isScrolled && "navbar-bar--scrolled"
    )}>
      <Box className="navbar-bar__container">
        {/* LEFT - Unified Logo */}
        <div className="navbar-bar__left">
          <Logo {...logoProps} className="navbar-bar__logo" />
        </div>

        {/* DESKTOP CONTENT */}
        <div className="navbar-bar__content">
          {renderIf('textlink-menuItem') && (
            <HStack className={`navbar-bar__middle navbar-bar__middle--${desktopAlign}`} spacing="lg">
              {mapComponentIndices('textlink-menuItem')
              .slice(0, getPatternProps().maxMenuItems)
              .map((props, i) => {
                const componentKey = `textlink-menuItem_${i}`;
                return (
                  <TextLink key={i} variant={props.variant} action={props.action} href={props.href} size="md" underline={props.underline} componentKey={componentKey}>
                    {props.content}
                  </TextLink>
                );
              })}
            </HStack>
          )}

          <HStack spacing="sm" className="navbar-bar__right">
            {renderIf('button-secondaryAction') && (
              <Button variant="ghost" href={get('button-secondaryAction').props.href} action={get('button-secondaryAction').props.action} componentKey={get('button-secondaryAction').key}>
                {get('button-secondaryAction').props.content}
              </Button>
            )}
            {renderIf('button-primaryAction') && (
              <Button variant={get('button-primaryAction').props.variant || 'primary'} href={get('button-primaryAction').props.href} action={get('button-primaryAction').props.action} componentKey={get('button-primaryAction').key}>
                {get('button-primaryAction').props.content}
              </Button>
            )}
          </HStack>
        </div>

        {/* MOBILE TOGGLE */}
        <IconButton
          variant="ghost"
          size="md"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="navbar-bar__mobile-toggle"
          icon={
            mobileOpen 
              ? <XIcon /> 
              : <MenuIcon />
          }
        />
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        showCloseButton={false}
        preventScroll
        type="top"
        className={`drawer-variant-${mobileVariant}`}
      >
        <VStack
          spacing="lg"
          align="stretch"
          className={cn(
            "drawer-navbar-content",
            `drawer-align-${mobileAlign}`,
          )}
        >
          {renderIf('textlink-menuItem') && mapComponentIndices('textlink-menuItem')
            .map((props, i) => {
              const componentKey = `textlink-menuItem_${i}`;
              const linkContent = (
                <TextLink
                  key={i}
                  variant={props.variant}
                  action={props.action}
                  href={props.href}
                  underline={props.underline}
                  onClick={() => setMobileOpen(false)}
                  className="drawer-navbar-link"
                  componentKey={componentKey}
                >
                  {props.content}
                </TextLink>
              );

              // Wrap with animation if enabled
              if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                return (
                  <FadeIn
                    key={i}
                    direction={animationDirection}
                    duration={animationDuration}
                    delay={i * animationStagger}
                    distance={20}
                    enableScrollTrigger={false}
                  >
                    {linkContent}
                  </FadeIn>
                );
              }

              return linkContent;
            })}

          {/* Action buttons with staggered animation */}
          {(renderIf('button-secondaryAction') || renderIf('button-primaryAction')) && (
            <VStack spacing="sm" className="drawer-navbar-actions">
              {renderIf('button-secondaryAction') && (() => {
                const menuItemsCount = mapComponentIndices('textlink-menuItem').length;
                const buttonContent = (
                  <Button
                    variant="ghost"
                    href={get('button-secondaryAction').props.href}
                    action={get('button-secondaryAction').props.action}
                    onClick={() => setMobileOpen(false)}
                    className="drawer-navbar-button"
                    componentKey={get('button-secondaryAction').key}
                  >
                    {get('button-secondaryAction').props.content}
                  </Button>
                );

                if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                  return (
                    <FadeIn
                      key="secondary-button"
                      direction={animationDirection}
                      duration={animationDuration}
                      delay={menuItemsCount * animationStagger}
                      distance={20}
                      enableScrollTrigger={false}
                    >
                      {buttonContent}
                    </FadeIn>
                  );
                }

                return buttonContent;
              })()}

              {renderIf('button-primaryAction') && (() => {
                const menuItemsCount = mapComponentIndices('textlink-menuItem').length;
                const secondaryButtonOffset = renderIf('button-secondaryAction') ? 1 : 0;
                const buttonContent = (
                  <Button
                    variant={get('button-primaryAction').props.variant || 'primary'}
                    href={get('button-primaryAction').props.href}
                    action={get('button-primaryAction').props.action}
                    onClick={() => setMobileOpen(false)}
                    className="drawer-navbar-button"
                    componentKey={get('button-primaryAction').key}
                  >
                    {get('button-primaryAction').props.content}
                  </Button>
                );

                if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                  return (
                    <FadeIn
                      key="primary-button"
                      direction={animationDirection}
                      duration={animationDuration}
                      delay={(menuItemsCount + secondaryButtonOffset) * animationStagger}
                      distance={20}
                      enableScrollTrigger={false}
                    >
                      {buttonContent}
                    </FadeIn>
                  );
                }

                return buttonContent;
              })()}
            </VStack>
          )}
        </VStack>
      </Drawer>
    </nav>
  );
};

export default NavbarBar;