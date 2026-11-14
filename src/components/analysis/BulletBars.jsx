import styled from 'styled-components';
import { colors, fontSizes, space } from '../../styles/tokens';

// Horizontal bars with a guide band and a target tick ("bullet" bars, spec 3.11):
// the actual value as bar, the band (e.g. 10–20 sets) as background, the target
// of the plans as a vertical tick. Values stay as text next to the bar.
// items: [{ key, label, value, valueLabel, target }]
export default function BulletBars({ items, band, titleId, descriptionId }) {
  const top = Math.max(band ? band[1] * 1.25 : 0, ...items.flatMap(item => [item.value, item.target ?? 0])) || 1;
  const percent = value => `${Math.min(100, (value / top) * 100)}%`;
  return (
    <List role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      {items.map(item => (
        <Item key={item.key}>
          <span>{item.label}</span>
          <Track>
            {band && <Band style={{ left: percent(band[0]), width: `calc(${percent(band[1])} - ${percent(band[0])})` }} />}
            <Fill style={{ width: percent(item.value) }} />
            {item.target > 0 && <Target style={{ left: percent(item.target) }} />}
          </Track>
          <Value>{item.valueLabel}</Value>
        </Item>
      ))}
    </List>
  );
}

const List = styled.div`
  display: grid;
  gap: ${space.sm};
  min-width: 0;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: minmax(4.5rem, 6.5rem) minmax(0, 1fr) auto;
  align-items: center;
  gap: ${space.sm};
  font-size: ${fontSizes.caption};
  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const Track = styled.div`
  position: relative;
  height: 16px;
`;

const Band = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: ${colors.surfaceMuted};
  border-left: 1px solid ${colors.border};
  border-right: 1px solid ${colors.border};
`;

const Fill = styled.div`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 0 4px 4px 0;
  background-color: ${colors.primary};
`;

const Target = styled.div`
  position: absolute;
  top: -3px;
  bottom: -3px;
  width: 0;
  border-left: 3px solid ${colors.text};
`;

const Value = styled.span`
  min-width: 2.5rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
`;
