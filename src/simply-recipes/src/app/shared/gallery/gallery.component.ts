import { Component, OnInit } from '@angular/core';
import { IGallery } from 'src/app/shared/interfaces/gallery';
import { HomeService } from 'src/app/services/home.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  gallery: IGallery[] | null = null;
  slides: Array<object> = [];

  constructor(
    public loadingService: LoadingService,
    private homeService: HomeService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.homeService.getGallery().subscribe({
      next: (value) => {
        this.gallery = value;
        this.slides = this.gallery.map(value => {
          return {
            image: value.imagePath,
            thumbImage: value.imagePath
          }
        });
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });
  }

}
