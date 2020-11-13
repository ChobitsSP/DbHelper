const list = [
  {
    name: 'changsha',
    providerName: 'Oracle.ManagedDataAccess.Client',
    connectionString: 'Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=server3)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)));User Id=C##changsha;Password=hsort;',
  },
  {
    name: 'point',
    providerName: 'Npgsql',
    connectionString: 'Host=server3.hsort.com;Username=postgres;Password=123;Application Name=ndc;Database=point',
  },
]

export default list
