import { IColumn } from "../../models/Index";

export default function(table: string, cols: IColumn[]) {
  const Fields = cols
    .map(c => {
      const Caption = c.comments || c.name;
      return `<dx:PivotGridField FieldName="${
        c.name
      }" Caption="${Caption}"></dx:PivotGridField>`;
    })
    .join("\n");

  // AreaIndex="${c.id}"

  const html = `<dx:ASPxPivotGrid ID="ASPxPivotGrid1" runat="server" ClientIDMode="AutoID" DataSourceID="SqlDataSource1">
	<Fields>
    ${Fields}
	</Fields>
</dx:ASPxPivotGrid>
<asp:SqlDataSource runat="server" ID="SqlDataSource1" ConnectionString='<%$ ConnectionStrings:ConnectionString %>'
ProviderName='<%$ ConnectionStrings:ConnectionString.ProviderName %>' SelectCommand="select * from ${table}">
</asp:SqlDataSource>`;

  return html;
}
