import { environment } from './../../environments/environment';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { PostService } from './Post.service';
import jwt_decode from 'jwt-decode';
import { RouteConfigLoadEnd } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  loginurl = environment.API+'user/authprovidersignin';
  testloginurl= 'http://localhost:4555/user/signin'
  externaltestloginurl= 'http://192.168.43.172:4555/user/signin'
  refreshurl = environment.API+'user/refresh';
  posturl = environment.API+'photos/post';
  commenturl = environment.API+'comments/post/';
  likesurl = environment.API+'likes/post/';
  authrequest: HttpRequest<unknown>;
  postrequest: HttpRequest<unknown>;
  commentrequest: HttpRequest<unknown>;
  likerequest: HttpRequest<unknown>;
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {



  if (request.url === this.loginurl) {console.log(request.url); return this.logininterceptor(request, next); }
  // if (request.url === this.testloginurl || request.url ===this.externaltestloginurl) {console.log(request.url); return next.handle(request) }


     return this.refreshtokeninterceptor(request, next);






  }

  refreshtokeninterceptor(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>>{
    const token: any = localStorage.getItem('auth');
    //  const refresh=localStorage.getItem('refresh')
    // console.log('auth',token);


    const tokenvalue: any = jwt_decode(token);
    // console.log('in refresh interceptor',req.url)

    if(req.url===this.refreshurl) return next.handle(req).pipe(catchError(((err:HttpErrorResponse)=>{

      // console.log('error area being triggered');

      let errmessage=err.error.message
      // console.log(errmessage)
      if(errmessage==='refreshexpired'||errmessage==='tokenmismatch'){

        // console.log('area being hit by error');

        localStorage.clear()
        this.auth.navigatehome()
       return EMPTY

      }else{
console.log(err);

        return EMPTY
      }
    })))

    if ( req.url != this.loginurl){

      if (tokenvalue.exp * 1000 > Date.now() ) {

        console.log();

        const postrequest = req.clone({
        setHeaders: {
          Authorization: 'bearer ' + token
        }
       });
        return next.handle(postrequest);

      }

      return  this.auth.refreshtoken().pipe(switchMap(
      (tokens: any) => {

        // console.log(tokens);
        localStorage.setItem('auth', tokens.token);

        const reqclone = req.clone({
          setHeaders: {
            Authorization: 'bearer ' + tokens.token
          }
        });
        return next.handle(reqclone);
      }



    ));


    }

    return next.handle(req);

  }




  postinterceptor(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log (request.url , request.method );
    const token = this.auth.gettoken();
    // console.log('token in auth interceptor', token);
    this.postrequest = request.clone({
        setHeaders: {
          Authorization: 'bearer ' + token
        }
      });

    return next.handle(this.postrequest).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401){
        return this.auth.refreshtoken().pipe(switchMap((tokens: any) => {

                  const newtoken = tokens.token;
                  localStorage.setItem('auth', newtoken);
                  const newrequest = request.clone({
                    setHeaders: {
                      Authorization: 'bearer ' + newtoken
                    }
                  });

                  return next.handle(newrequest);

        }



        ));

      }
    }));


    }


  logininterceptor(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {


      const token = this.auth.firebasetokenvalue;
// console.log('interceptor token\n',token);

      this.authrequest = request.clone({
        setHeaders: {
          Authorization: 'bearer ' + token
        }
      });
      // console.log('auth header',this.authrequest.headers.get('Authorization'));


      return next.handle(this.authrequest);



  }

  // testlogininterceptor(request:HttpRequest<unknown>,next:HttpHandler):Observable<HttpEvent<any>>{

  // }

  commentinterceptor(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {


    const token = this.auth.gettoken();

    //  console.log('token in comment interceptor', token);
    // console.log('post link', request.url);
    this.commentrequest = request.clone({
      setHeaders: {
        Authorization: 'bearer ' + token
      }
    });

    return next.handle(this.commentrequest).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401){
        return this.auth.refreshtoken().pipe(switchMap((tokens: any) => {

                  const newtoken = tokens.token;
                  localStorage.setItem('auth', newtoken);

                  const newrequest = request.clone({
                    setHeaders: {
                      Authorization: 'bearer ' + newtoken
                    }
                  });

                  return next.handle(newrequest);

        }



        ));

      }
    }));




}

likesinterceptor(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {


  const token = this.auth.gettoken();

  //  console.log('token in comment interceptor', token);
  // console.log('post link', request.url);
  this.likerequest = request.clone({
    setHeaders: {
      Authorization: 'bearer ' + token
    }
  });

  return next.handle(this.likerequest)
  .pipe(catchError((err: HttpErrorResponse) => {
    if (err.status === 401){
      return this.auth.refreshtoken().pipe(switchMap((tokens: any) => {

                const newtoken = tokens.token;
                localStorage.setItem('auth', newtoken);

                const newrequest = request.clone({
                  setHeaders: {
                    Authorization: 'bearer ' + newtoken
                  }
                });

                return next.handle(newrequest);

      }



      ));

    }
  }));



}



}
