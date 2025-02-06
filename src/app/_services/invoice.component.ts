import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../_services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoiceText: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const reservationId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(reservationId)) {
      this.errorMessage = 'Geçersiz rezervasyon ID\'si.';
      return;
    }
    this.invoiceService.getInvoicePdf(reservationId).subscribe(
      (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.invoiceText = reader.result as string;
        };
        reader.readAsText(blob);
      },
      (error: any) => {
        console.error('Invoice loading failed:', error);
        this.errorMessage = 'Fatura yüklenirken hata oluştu.';
      }
    );
  }
}