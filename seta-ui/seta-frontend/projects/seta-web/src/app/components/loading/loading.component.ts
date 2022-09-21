import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoadingService } from '../../loading.service';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})  
export class LoadingComponent implements OnInit {
  loading;

  @Select(SetaState.is_loading)
  public loading$: Observable<boolean>;

  constructor(public loadingService: LoadingService) {
    this.loadingService.isLoading$$.asObservable().pipe(delay(1)).subscribe((intLoad) => {
      if (intLoad) {
        this.loading = true
      } else {
        this.loading = false
      }
    })
  }


  ngOnInit(): void {

  }

}
