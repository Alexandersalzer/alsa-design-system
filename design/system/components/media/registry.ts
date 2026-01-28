import { Image } from './Image/Image';
import { Video } from './Video/Video';
import { Avatar } from './Avatar/Avatar';
import { Icon } from './Icon/Icon';
import { Logo } from './Logo/Logo';
import { SquareImageContainer } from './SquareImageContainer/SquareImageContainer';
import { VideoShowcase } from './VideoShowcase/VideoShowcase';

export const mediaComponents: Record<string, React.ComponentType<any>> = {
  image: Image,
  video: Video,
  avatar: Avatar,
  icon: Icon,
  logo: Logo,
  squareImageContainer: SquareImageContainer,
  videoShowcase: VideoShowcase,
};