import { Link } from 'react-router-dom';
import styled from 'styled-components';
import muscleIcons from './muscleIcons';
import { MUSCLE_GROUP_NAMES } from '../../api/wger';
import { colors } from '../../styles/colors';
import { radii } from '../../styles/tokens';
import { useTranslation } from '../../i18n/LanguageContext';
import { routes } from '../../routes';

export default function MuscleGroupPicker() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Grid>
        {MUSCLE_GROUP_NAMES.map(muscle => (
          <Tile key={muscle} to={routes.muscleGroup(muscle)}>
            <img src={muscleIcons[muscle]} alt="" width="80" />
            {t(`muscle.${muscle}`)}
          </Tile>
        ))}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const Tile = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  color: ${colors.text};
  text-decoration: none;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
`;
