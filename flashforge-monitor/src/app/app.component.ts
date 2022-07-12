import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { IPrinterData } from '@shared/printerdata.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private http: HttpClient) { }

  printerAddr = environment.printerAddr;

  connectionStatus = '';
  printerStatus = '';
  printProgress = 0;
  extruderTemperature = '';

  isStreaming = true;

  ngOnInit(): void {
    this.getPrinterData();

    setInterval(() => {
      this.getPrinterData();
    }, 10 * 1000);
  }

  getPrinterData(): void {
    this.connectionStatus = !!this.connectionStatus ? 'Fetching...' : 'Connecting...';
    this.fetchData(environment.baseUrl).subscribe({
      next: (data: IPrinterData) => {
        this.connectionStatus = data.printerConnection;
        this.printerStatus = data.printerStatus;
        this.printProgress = data.printProgress;
        this.extruderTemperature = data.extruderTemperature;
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
