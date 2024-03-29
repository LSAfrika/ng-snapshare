import { NotificationsService } from './../../services/notifications.service';
import { IOService } from 'src/app/services/io.service';
import { AuthService } from './../../services/auth.service';
import { PostService } from './../../services/Post.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { MessagesService } from './../../services/messages.service';
import { UiService } from 'src/app/services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  Destroy$=new Subject<boolean>()
  currentdate=Date.now()
  fulldayinmilliseconds=86400000
   following$:Observable<any>
   followers$:Observable<any>

   donotnavigate=false
    user: any;
    chatid:any
  constructor(public ui:UiService,
    public msgservice:MessagesService,
    private router:Router,
    private snapshare:PostService,
    public io:IOService,
    private notification:NotificationsService,
    private auth:AuthService) {



console.log('user messaging list before', this.ui.userlist$.value);


this.msgservice.fetchchatlist().pipe(takeUntil(this.Destroy$),
tap((res:any)=>{

  console.log('user chat list',res);
  if(res===null) return
   res.userchats.reverse()



  msgservice.userchatlist$.next(res)
}

  )).subscribe()





  }


  getUnique(arr, comp) {

    // store the comparison  values in array
const unique =  arr.map(e => e[comp])

  // store the indexes of the unique objects
  .map((e, i, final) => final.indexOf(e) === i && i)

  // eliminate the false indexes & return unique objects
 .filter((e) => arr[e]).map(e => arr[e]);

return unique;
}

  ngOnInit(): void {
    console.log('messages component');
    this.msgservice.chatid=''
    console.log('current chat id: ',this.msgservice.chatid);

this.io.NewMessageNotification().pipe(takeUntil(this.Destroy$)).subscribe(  (Notification:any)=>{

console.log('current new message: ',Notification)
  if(Notification===undefined) return
let reversearray=[]
let currentlength=Notification.userchats.length
   Notification.userchats.forEach(chat => {
currentlength--

reversearray[currentlength]=chat
// console.log('current array length: ',reversearray);




  });
   const newnotificationchatlist={
    _id:Notification._id,
    userchats:[...reversearray]
   }
   console.log('new notfication object',newnotificationchatlist)
  // console.log('original message notfication',Notification)

  // this.msgservice.userchatlist$.next(undefined)
  //  this.msgservice.userchatlist$.next(newnotificationuserchats)
  this.msgservice.userchatlist$.next(newnotificationchatlist)

// this.notification.notificationsound()

  console.log('behaviour subject notification',this.msgservice.userchatlist$.value)


});

  }

  ngOnDestroy(){

    this.Destroy$.next(true)
    this.Destroy$.complete()

  }
  deletemodal(username,chatid,index){

    this.msgservice.indexdelete=index
    this.user=username
    this.chatid=chatid
    this.ui.openmodal.next(true)
    console.log('modal opened',this.user);

  }
  disablenavigation(){
    this.donotnavigate=true

  }
  enablenavigation(){
    this.donotnavigate=false

  }

  openuserlist(){
    this.ui.openmessagelist=1
  }



  openmessage(){
    this.ui.directmessagepanel.next(1)
    console.log(this.ui.directmessagepanel.value)

  }



  textuser(id,unreadcounter,chatid,index){

    if(this.donotnavigate==true)return
    // this.ui.directmessagepanel.next(3)
    this.msgservice.userchatlist$.value.userchats[index].unreadcounter=0
    // console.log('user chat unread counter reset',this.msgservice.userchatlist$.value.userchats);


this.msgservice.unreadcounter=unreadcounter
this.msgservice.chatid=chatid
console.log(this.ui.directmessagepanel.value)
console.log('passed chat id: ',this.msgservice.chatid);

    this.router.navigate(['directmessage'+`/${id}`])


}


}
