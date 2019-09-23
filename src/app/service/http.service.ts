import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthorizationService} from './authorization.service';

@Injectable()
export class HttpService {

  static SERVICE_ADDRESS = 'localhost'
  static SERVICE_PORT = '5000'
  static BASE_URL: string

  constructor(private http: HttpClient) {
    HttpService.BASE_URL = 'http://' + HttpService.SERVICE_ADDRESS + ':' + HttpService.SERVICE_PORT + '/';
  }

  private getHeaders() {
    const headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem(AuthorizationService.authTokenKey))
      .set('UserId', localStorage.getItem(AuthorizationService.userId));

    return headers;
  }

  register(body) {
    return this.http.post(HttpService.BASE_URL + 'register', body);
  }

  login(body) {
    return this.http.post(HttpService.BASE_URL + 'login', body);
  }

  getTopics() {
    return this.http.get(HttpService.BASE_URL + 'topic');
  }

  postTopic(body) {
    return this.http.post(HttpService.BASE_URL + 'topic', body, {headers: this.getHeaders()});
  }

  removeTopic(topicId) {
    return this.http.delete(HttpService.BASE_URL + 'topic/' + topicId, {headers: this.getHeaders()});
  }

  getPosts(topicId) {
    return this.http.get(HttpService.BASE_URL + 'post/' + topicId, {headers: this.getHeaders()});
  }

  postPost(body) {
    return this.http.post(HttpService.BASE_URL + 'post/', body, {headers: this.getHeaders()});
  }

  removePost(postId) {
    return this.http.delete(HttpService.BASE_URL + 'post/' + postId, {headers: this.getHeaders()});
  }

  getUsers() {
    return this.http.get(HttpService.BASE_URL + 'user/', {headers: this.getHeaders()});
  }

  removeUser(userId) {
    return this.http.delete(HttpService.BASE_URL + 'user/' + userId, {headers: this.getHeaders()});
  }

}
