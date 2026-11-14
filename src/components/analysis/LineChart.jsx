import styled from 'styled-components';
import { colors } from '../../styles/tokens';
import { daysBetween } from '../../utils/analysis';

// Line chart over time as inline SVG (spec 3.11 "Werde ich stärker?"): points with
// straight connections (no smoothing), the y axis from min − 5 % to max + 5 % (not
// from 0), lines broken after 4 weeks without a session, records as stars. Several
// series (left/right side) differ by marker shape and dash and are labelled at
// their end, never by color alone.
//
// series: [{ key, label, marker: 'circle' | 'square', dashed, points: [{ date, value, isRecord }] }]
const WIDTH = 340;
const HEIGHT = 200;
const PAD = { left: 44, right: 60, top: 12, bottom: 26 };
const GAP_DAYS = 28;

export function yDomain(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = max === min ? Math.max(1, max * 0.05) : (max - min) * 0.05;
  return [Math.max(0, min - pad), max + pad];
}

const star = (x, y, r = 6) =>
  Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 ? r * 0.45 : r;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    return `${(x + radius * Math.cos(angle)).toFixed(1)},${(y + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');

export default function LineChart({ series, formatValue, formatDate, titleId, descriptionId }) {
  const points = series.flatMap(item => item.points);
  const dates = points.map(point => point.date).sort();
  const first = dates[0];
  const span = Math.max(1, daysBetween(first, dates[dates.length - 1]));
  const [low, high] = yDomain(points.map(point => point.value));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const x = date => PAD.left + (daysBetween(first, date) / span) * plotWidth;
  const y = value => PAD.top + (1 - (value - low) / (high - low)) * plotHeight;
  const ticks = [low, (low + high) / 2, high];

  // End labels: pushed apart when they would overlap.
  const ends = series
    // One series needs no label: the card title names it.
    .filter(item => item.points.length && series.length > 1)
    .map(item => ({ key: item.key, label: item.label, y: y(item.points[item.points.length - 1].value) }))
    .sort((a, b) => a.y - b.y);
  for (let index = 1; index < ends.length; index++) {
    if (ends[index].y - ends[index - 1].y < 14) ends[index].y = ends[index - 1].y + 14;
  }

  return (
    <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      {ticks.map(tick => (
        <g key={tick}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(tick)} y2={y(tick)} style={{ stroke: colors.surfaceMuted }} />
          <text x={PAD.left - 4} y={y(tick) + 4} textAnchor="end" className="label">
            {formatValue(tick)}
          </text>
        </g>
      ))}
      <text x={PAD.left} y={HEIGHT - 6} className="label">
        {formatDate(first)}
      </text>
      <text x={WIDTH - PAD.right} y={HEIGHT - 6} textAnchor="end" className="label">
        {formatDate(dates[dates.length - 1])}
      </text>
      {series.map(item => {
        // Split into segments at gaps of more than four weeks.
        const segments = [];
        item.points.forEach((point, index) => {
          if (index === 0 || daysBetween(item.points[index - 1].date, point.date) > GAP_DAYS) segments.push([]);
          segments[segments.length - 1].push(point);
        });
        return (
          <g key={item.key}>
            {segments.map((segment, index) => (
              <polyline
                key={index}
                points={segment.map(point => `${x(point.date).toFixed(1)},${y(point.value).toFixed(1)}`).join(' ')}
                fill="none"
                style={{ stroke: colors.primary }}
                strokeWidth="2"
                strokeDasharray={item.dashed ? '6 4' : undefined}
              />
            ))}
            {item.points.map((point, index) => {
              const px = x(point.date);
              const py = y(point.value);
              if (point.isRecord) return <polygon key={index} points={star(px, py, 7)} style={{ fill: colors.muscleHighlight, stroke: colors.text }} />;
              return item.marker === 'square' ? (
                <rect key={index} x={px - 4} y={py - 4} width="8" height="8" style={{ fill: colors.surface, stroke: colors.primary }} strokeWidth="2" />
              ) : (
                <circle key={index} cx={px} cy={py} r="4" style={{ fill: colors.primary }} />
              );
            })}
          </g>
        );
      })}
      {ends.map(end => (
        <text key={end.key} x={WIDTH - PAD.right + 6} y={end.y + 4} className="series">
          {end.label}
        </text>
      ))}
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  max-width: 40rem;
  overflow: hidden;
  .label {
    fill: ${colors.textMuted};
    font-size: 11px;
  }
  .series {
    fill: ${colors.text};
    font-size: 12px;
    font-weight: 600;
  }
`;
