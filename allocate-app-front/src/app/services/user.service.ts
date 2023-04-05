import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private subjectProfilePicture = new Subject<any>();

  constructor() { }

  sendUpdateProfilePictureEvent() {
    this.subjectProfilePicture.next();
  }

  getUpdateProfilePictureEvent(): Observable<any>{
    return this.subjectProfilePicture.asObservable();
  }
}
