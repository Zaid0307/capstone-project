import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, shadows, sizes, space } from '../../styles/tokens';

// Shared building blocks of the calendar and analysis pages, in the app's existing look.

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space.md};
  min-width: 0;
  padding: ${space.lg};
  border-radius: ${radii.large};
  background-color: ${colors.surface};
  box-shadow: ${shadows.card};
`;

export const CardTitle = styled.h2`
  font-size: ${fontSizes.section};
`;

export const SubTitle = styled.h3`
  font-size: ${fontSizes.lead};
`;

export const Muted = styled.p`
  color: ${colors.textMuted};
  font-size: ${fontSizes.caption};
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space.sm};
  min-width: 0;
`;

// One row of chips that scrolls sideways on phones; the padding keeps focus rings visible.
export const ChipRow = styled.div`
  display: flex;
  gap: ${space.sm};
  margin: calc(-1 * ${space.sm});
  padding: ${space.sm};
  overflow-x: auto;
  & > * {
    flex-shrink: 0;
  }
`;

export const Chip = styled.button.attrs({ type: 'button' })`
  min-height: ${sizes.touchTarget};
  padding: 0 ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.surface};
  color: ${colors.text};
  &[aria-pressed='true'] {
    border-color: ${colors.primary};
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;

// Tables scroll sideways inside their box, never the page.
export const TableBox = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fontSizes.caption};
  font-variant-numeric: tabular-nums;
  caption {
    padding-bottom: ${space.xs};
    color: ${colors.textMuted};
    text-align: left;
  }
  th,
  td {
    padding: ${space.xs} ${space.sm};
    border-bottom: 1px solid ${colors.surfaceMuted};
    text-align: left;
    vertical-align: top;
  }
  thead th {
    color: ${colors.textMuted};
    font-weight: ${fontWeights.medium};
  }
`;

export const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${space.sm};
  @media (min-width: 600px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: ${space.xs};
    min-width: 0;
    padding: ${space.sm};
    border-radius: ${radii.small};
    background-color: ${colors.surfaceMuted};
  }
  dt {
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
  }
  dd {
    font-size: ${fontSizes.lead};
    font-weight: ${fontWeights.bold};
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  dd + dd {
    color: ${colors.textMuted};
    font-size: ${fontSizes.caption};
    font-weight: ${fontWeights.regular};
  }
`;

export const PlainList = styled.ul`
  display: grid;
  gap: ${space.sm};
  list-style: none;
  min-width: 0;
`;

export const Segmented = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  overflow: hidden;
  button {
    flex: 1 1 auto;
    min-height: ${sizes.touchTarget};
    padding: 0 ${space.md};
    border: none;
    background-color: ${colors.surface};
    color: ${colors.text};
  }
  button[aria-pressed='true'] {
    background-color: ${colors.primary};
    color: ${colors.onPrimary};
    font-weight: ${fontWeights.medium};
  }
`;
