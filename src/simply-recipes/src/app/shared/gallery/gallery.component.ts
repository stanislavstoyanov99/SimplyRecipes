import { Component, OnInit } from '@angular/core';
import { IGallery } from 'src/app/shared/interfaces/gallery';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  gallery: IGallery[] | null = null;
  slides: Array<object> = [];

  constructor(private homeService: HomeService) { }

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
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

}
