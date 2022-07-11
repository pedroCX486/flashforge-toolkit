import { Component, OnInit } from '@angular/core';
  


@Component({
  selector: 'app-monitorscreen',
  templateUrl: './monitorscreen.component.html',
  styleUrls: ['./monitorscreen.component.scss']
})
export class MonitorScreenComponent implements OnInit {

  constructor(private http: HttpClient) { }

  printerAddr = environment.printerAddr;

  connectionStatus: string;
  printerStatus = '';
  printProgress = 0;
  extruderTemperature = '';

  ngOnInit(): void {
    this.getPrinterData();

    setInterval(() => {
      this.getPrinterData();
    }, 10 * 1000);
  }

  getPrinterData(): void {
    this.connectionStatus = this.connectionStatus ? 'Fetching...' : 'Connecting...';
    this.fetchData(environment.baseUrl).subscribe({
      next: (data: IPrinterData) => {
        this.connectionStatus = data.printerConnection;
        this.printerStatus = data.printerStatus || '';
        this.printProgress = data.printProgress || 0;
        this.extruderTemperature = data.extruderTemperature || 'Unknown Temperature';
      },
      error: () => {
        this.connectionStatus = 'Monitor API offline. (No Response)';
      }
    });
  }

  fetchData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
