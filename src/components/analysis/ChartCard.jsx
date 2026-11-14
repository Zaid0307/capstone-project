import { useId, useState } from 'react';
import { MdBarChart, MdTableChart } from 'react-icons/md';
import Button from '../ui/Button';
import ScreenReaderOnly from '../ui/ScreenReaderOnly';
import { useTranslation } from '../../i18n/LanguageContext';
import { Card, CardTitle, Muted } from './styles';

// A dashboard card: title, optional subtitle, a chart with a short description for
// screen readers, and a switch to the same numbers as a table (spec 4, "Karten").
// renderChart({ titleId, descriptionId }) draws the chart; without it (empty or
// too little data) the card shows its children only.
export default function ChartCard({ title, subtitle, summary, renderChart, table, children, footer }) {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const id = useId();
  const titleId = `${id}title`;
  const descriptionId = `${id}description`;
  const hasChart = Boolean(renderChart);

  return (
    <Card aria-labelledby={titleId}>
      <div>
        <CardTitle id={titleId}>{title}</CardTitle>
        {subtitle && <Muted>{subtitle}</Muted>}
      </div>
      {children}
      {hasChart && (
        <>
          {summary && <ScreenReaderOnly id={descriptionId}>{summary}</ScreenReaderOnly>}
          {showTable ? table : renderChart({ titleId, descriptionId: summary ? descriptionId : undefined })}
        </>
      )}
      {footer}
      {hasChart && table && (
        <div>
          {/* A toggle keeps its name; aria-pressed tells whether the table is shown. */}
          <Button $variant="secondary" aria-pressed={showTable} onClick={() => setShowTable(!showTable)}>
            {showTable ? <MdBarChart aria-hidden="true" /> : <MdTableChart aria-hidden="true" />}
            {t('analysis.table.show')}
          </Button>
        </div>
      )}
    </Card>
  );
}
