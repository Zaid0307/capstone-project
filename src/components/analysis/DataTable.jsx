import { Table, TableBox } from './styles';

// The table alternative of a chart: same numbers, first column as row header.
// columns: [label…]; rows: [{ key, cells: [first, …] }]
export default function DataTable({ caption, columns, rows }) {
  return (
    <TableBox>
      <Table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key}>
              <th scope="row">{row.cells[0]}</th>
              {row.cells.slice(1).map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableBox>
  );
}
