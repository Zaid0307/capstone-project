import styled from 'styled-components';
import { colors, fontSizes, space } from '../../styles/tokens';

// Columns over time, drawn with HTML from the data: one series, one color, the
// value as text above each column, an optional labelled reference line (goal,
// 80 %). A running week or month is drawn as an outline with a pattern and gets
// a text label. With many columns only some axis labels are shown; the table
// alternative of the card has every value.
//
// data: [{ key, label, value, valueLabel, inProgress }]
export default function ColumnChart({ data, max, reference, titleId, descriptionId, inProgressLabel, showValues = true }) {
  const top = Math.max(max ?? 0, reference?.value ?? 0, ...data.map(item => item.value ?? 0)) || 1;
  const labelEvery = Math.ceil(data.length / 7);
  const ratio = value => Math.max(0, Math.min(1, (value ?? 0) / top));

  return (
    <Figure role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <Plot>
        {reference && (
          <Reference style={{ bottom: `calc((100% - 1.5rem) * ${ratio(reference.value)})` }}>
            <span>{reference.label}</span>
          </Reference>
        )}
        {data.map(item => (
          <Column key={item.key}>
            {showValues && <Value>{item.value === null ? '' : item.valueLabel ?? item.value}</Value>}
            <Bar
              $inProgress={item.inProgress}
              style={{ height: `calc((100% - 1.5rem) * ${ratio(item.value)})` }}
            />
          </Column>
        ))}
      </Plot>
      <Axis>
        {data.map((item, index) => (
          <span key={item.key}>
            {item.inProgress ? inProgressLabel : (data.length - 1 - index) % labelEvery === 0 ? item.label : ''}
          </span>
        ))}
      </Axis>
    </Figure>
  );
}

const Figure = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space.xs};
  min-width: 0;
`;

const Plot = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 10rem;
  border-bottom: 1px solid ${colors.border};
`;

const Column = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
  height: 100%;
`;

const Value = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: ${colors.text};
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
  line-height: 1.5rem;
  white-space: nowrap;
`;

const Bar = styled.div`
  width: 100%;
  max-width: 2.5rem;
  border-radius: 4px 4px 0 0;
  background: ${props =>
    props.$inProgress
      ? `repeating-linear-gradient(45deg, ${colors.primary} 0 2px, transparent 2px 6px)`
      : colors.primary};
  border: ${props => (props.$inProgress ? `2px dashed ${colors.primary}` : 'none')};
  border-bottom: none;
`;

const Reference = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px dashed ${colors.textMuted};
  pointer-events: none;
  span {
    position: absolute;
    right: 0;
    bottom: 2px;
    padding: 0 ${space.xs};
    background-color: ${colors.surface};
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
  }
`;

const Axis = styled.div`
  display: flex;
  gap: 2px;
  overflow: hidden;
  span {
    flex: 1 1 0;
    min-width: 0;
    overflow: visible;
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
    text-align: center;
    white-space: nowrap;
  }
`;
