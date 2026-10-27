import { useState } from 'react';
import styled from 'styled-components';
import { BiDumbbell } from 'react-icons/bi';
import muscleIcons from './muscleIcons';
import { colors } from '../../styles/tokens';

// The graphic of a muscle group. Falls back to a neutral symbol when the
// graphic is missing or cannot be loaded. Decorative: the group name is shown as text.
export default function MuscleIcon({ muscle, size }) {
  const [hasFailed, setHasFailed] = useState(false);
  const src = muscleIcons[muscle];

  if (!src || hasFailed) {
    return (
      <Fallback aria-hidden="true" $size={size}>
        <BiDumbbell />
      </Fallback>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      $size={size}
      onError={() => setHasFailed(true)}
    />
  );
}

const Image = styled.img`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  object-fit: contain;
`;

const Fallback = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  color: ${colors.textMuted};
  font-size: ${props => props.$size * 0.6}px;
`;
