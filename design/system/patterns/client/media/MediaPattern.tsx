'use client';

import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { useComponentProps } from '../../../core/utils/helpers';
import { PatternNode } from '../../../core/types/nodes';

const MediaPattern = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);

  return (
    <VideoShowcase
      src={get('video').src || ''}
      autoPlay={false}
      muted={true}
      loop={true}
      controls={false}
      showPlayButton={true}
      variant="elevated"
      size="full"
      aspectRatio="16-9"
      radius="md"
    />
  );
};

MediaPattern.displayName = 'MediaPattern';

export default MediaPattern;