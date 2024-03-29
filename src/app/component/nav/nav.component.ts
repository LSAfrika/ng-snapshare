import { IOService } from 'src/app/services/io.service';
import { takeUntil, switchMap,tap ,map} from 'rxjs/operators';
import { MessagesService } from './../../services/messages.service';
import { NotificationsService } from './../../services/notifications.service';
import {  User } from './../../interface/post.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { of, Subject, BehaviorSubject, EMPTY } from 'rxjs';
import { Location } from '@angular/common'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {



  @Input()postowner:User
  route=''
  routarray
  title=''
  destroy=new Subject()
  fulldayinmilliseconds=86400000
  currentdate=Date.now()
  messagecounter=0
  notifictioncounter=0
  currentuserprofile=''



  constructor(public ui:UiService,private router:Router,private notfier:NotificationsService,public msgservice:MessagesService,
    private location: Location,private notificationservice:NotificationsService,private activeroute:ActivatedRoute,private IO:IOService
    ) { }

  ngOnInit(): void {

    this.route=this.router.url.split('/')[1]
    //  console.log(this.router.url.split('/'));
    //  console.log('current route: ',this.route);
if(this.route==='') {this.title='snapshare'
console.log('home page reached');

//this.msgservice.fetchsunreadmessages().pipe(takeUntil(this.destroy)).subscribe((res:any)=>{this.messagecounter=res.count})
// this.notificationservice.fetchnotificationcount().pipe(takeUntil(this.destroy)).subscribe((res:any)=>{this.notifictioncounter=res.count})
this.livenotificationscount()
this.livemessagescount()
}
if(this.route==='profile') {

  this.currentuserprofile=this.activeroute.snapshot.params.id
  console.log('current profile id: ',this.currentuserprofile);

  this.title='profile'
}
if(this.route==='messages') this.title='messages'
if(this.route==='directmessage') this.title='messages'


}


livenotificationscount(){

  this.IO.homepagenotifications().pipe(
    takeUntil(this.destroy),
    switchMap( (res:any)=> {
      console.log('notification socket ',res);

     return this.notificationservice.fetchnotificationcount()}),
  map((res:any)=>{

    this.notifictioncounter=res.count
    console.log('fetched notification counter: ', this.notifictioncounter);



  }),switchMap((res:any)=>{
      console.log('switching to fetching notifications',res);
      this.notificationservice.notifications$= new BehaviorSubject([]);
 this.notificationservice.notificationpagination$.next(0)
 return of(EMPTY)
    //  return this.notificationservice.getnotfications()
    }),tap(res=>{

      //  if(this.notifictioncounter>0)  this.notificationservice.notificationsound()
      }
    ))
  .subscribe()

}

livemessagescount(){
this.IO.NewMessageNotificationcounter().pipe(
takeUntil(this.destroy),
switchMap( (res:any)=> {console.log('socket message counter emmiter: ',res);return this.msgservice.fetchsunreadmessages()}),
// map(  (res:any)=>{ console.log('message counter: ',res.count) ;return this.messagecounter=res.count }),
tap((res:any)=>{console.log('value after message completed:',res);this.messagecounter=res.count})).
subscribe()
}

ngOnDestroy(){
  this.destroy.next()
}

logout(){
  localStorage.clear()
  this.router.navigateByUrl('/login')
}



back() {
  this.location.back()
}

  profile(){
    this.ui.user()
    this.ui.profileview=1
    this.router.navigate([`profile/${this.ui.logedinuser._id}`])
  }

  togglenotfication(){
    this.ui.togglenotifications()

  }
  viewprofile(){
    // console.log('post owner: ',this.ui.postowner.value);

    this.ui.resetnotificationpanel()
this.ui.profileview=1
console.log('reset profile view',this.ui.profileview);

    // remember to add logic for login user profile navigation
     this.router.navigate(['profile',this.ui.postowner.value._id])

  }

  viewprofilefromdm(){
    this.ui.resetnotificationpanel()
this.ui.profileview=1

    this.router.navigate(['profile',this.ui.chatowner.value._id])


  }


  textuser(){
    this.ui.directmessagepanel.next(3)
    this.router.navigate(['messages'])
  }
  messages(){
    this.router.navigate(['messages'])
    this.ui.resetnotificationpanel()

  }

  home(){
    this.ui.resetnotificationpanel()
    this.ui.postowner.next(undefined)
    // console.log('reset profile',this.ui.postowner.value);

    this.router.navigate([''])
  }

}
