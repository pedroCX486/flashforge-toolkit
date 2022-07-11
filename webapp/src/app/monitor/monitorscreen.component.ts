import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { IPrinterData } from '@shared/printerdata.interface';


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
