import { VideoShowcase } from './VideoShowcase';
import Icon from './Icon';
import { Avatar } from './Avatar';
import { Image } from './Image';
import { Logo } from './Logo';
import { SquareImageContainer } from './SquareImageContainer';

export const mediaComponents: Record<string, React.ComponentType<any>> = {
  videoShowcase: VideoShowcase,
  icon: Icon,
  avatar: Avatar,
  image: Image,
  logo: Logo,
  squareImageContainer: SquareImageContainer,
};