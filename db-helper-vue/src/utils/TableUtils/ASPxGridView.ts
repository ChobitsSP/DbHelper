import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

const SqlDataSource1: string = "SqlDataSource1";

export default function(tableName: string, cols: IColumn[]): string {
  const html = `<div class="container-fluid">
	<div class="row">
		<div class="col-md-12">
			<h3>${tableName}</h3>
			<hr />
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<button type="button" class="btn btn-success btn-sm" onclick="grid1.Refresh()">刷新</button>
		</div>
	</div>
	<br />
	<div class="row">
		<div class="col-md-12">
			<dx:ASPxGridView 
				ID="ASPxGridView1" 
				ClientInstanceName="grid1" 
				runat="server" 
				Width="100%"
				KeyFieldName="${cols[0].name}" 
				AutoGenerateColumns="False" 
				DataSourceID="${SqlDataSource1}">
        <Columns>
					${cols.map(t => ColBuild(t)).join("\n")}
				</Columns>
			</dx:ASPxGridView>
			<asp:SqlDataSource 
			runat="server" 
			ID="${SqlDataSource1}" 
			ConnectionString='<%$ ConnectionStrings:ConnectionString %>'
			ProviderName='<%$ ConnectionStrings:ConnectionString.ProviderName %>' 
			SelectCommand='SELECT * FROM "${tableName}"'>
			</asp:SqlDataSource>
		</div>
	</div>
</div>`;

  return html;
}

function ColBuild(col: IColumn): string {
  const colType: string = GridViewDataType[getColType(col.type)];
  return `<dx:${colType} Caption="${col.comments || col.name}" FieldName="${
    col.name
  }"></dx:${colType}>`;
  // VisibleIndex="${col.id}"
}

enum GridViewDataType {
  GridViewDataTextColumn,
  GridViewDataDateColumn,
  GridViewDataComboBoxColumn,
  GridViewDataCheckColumn,
  GridViewDataSpinEditColumn
}

function getColType(type: string): GridViewDataType {
  if (TypeIsDate(type)) {
    return GridViewDataType.GridViewDataDateColumn;
  }
  return GridViewDataType.GridViewDataTextColumn;
}
