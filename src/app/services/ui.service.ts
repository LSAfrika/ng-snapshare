import { BehaviorSubject } from 'rxjs';
import { Post, User } from './../interface/post.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  opennotificationspanel = 0;
  disablefetchfollowers= false
  disablefetchfollowing= false
  fetchnextdisabled=false
  openimageuploader = 0;
  uploading=false
postowner=new BehaviorSubject<User>(undefined)
editprofileui=new BehaviorSubject<boolean>(true)
postcounter=new BehaviorSubject(0)
  categoryposts=false
  logedinuser: User = undefined;

  profileview=1

  constructor() {

    this.user()

       }

  user(){
    const token=localStorage.getItem('auth')
   
    
    if(token !==null ){
      
const storedtoken=token.split('.')[1]

      const uservalue:any= JSON.parse(atob(storedtoken))
      this.logedinuser=uservalue
  
    }
  if(token ==='undefined'){
localStorage.clear()
  }

  }


  updateuserprofile(){
    const token=localStorage.getItem('auth')
   
    
    if(token !==null ){
      
const storedtoken=token.split('.')[1]

      const uservalue:any= JSON.parse(atob(storedtoken))
      this.logedinuser=uservalue
  this.postowner.next(uservalue)
  console.log(uservalue);
  
    }
  }

profileviewselector(view){
  this.profileview=view
}


  togglenotifications() {
    console.log('before', this.opennotificationspanel);
    if (this.opennotificationspanel === 1) { return this.opennotificationspanel = 2 }
    if (this.opennotificationspanel === 2) { return this.opennotificationspanel = 1 }
    if (this.opennotificationspanel === 0) { return this.opennotificationspanel = 1; }
    console.log('after', this.opennotificationspanel);


  }
  resetnotificationpanel(){
    this.opennotificationspanel=0
  }

  toggleimageuploader() {
    console.log('before modal', this.openimageuploader);
    if (this.openimageuploader === 1) { return this.openimageuploader = 2 }
    if (this.openimageuploader === 2) { return this.openimageuploader = 1 }
    if (this.openimageuploader === 0) { return this.openimageuploader = 1; }
    console.log('after modal', this.openimageuploader);


  }

  categoriesactive(){
    this.categoryposts=true
  }

  categoriesinactive(){
    this.categoryposts=false
  }


  uiprofileedit(){
    if(this.editprofileui.value==false) return this.editprofileui.next(true)
    if(this.editprofileui.value==true) return this.editprofileui.next(false)
  }
}
