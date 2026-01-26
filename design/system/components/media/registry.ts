import VideoShowcase from './VideoShowcase/VideoShowcase';
import Icon from './Icon/Icon';
import Avatar from './Avatar/Avatar';
import Image from './Image/Image';
import Logo from './Logo/Logo';
import SquareImageContainer from './SquareImageContainer/SquareImageContainer';

export const mediaComponents: Record<string, React.ComponentType<any>> = {
  videoShowcase: VideoShowcase,
  icon: Icon,
  avatar: Avatar,
  image: Image,
  logo: Logo,
  squareImageContainer: SquareImageContainer,
};