import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService {

  static SERVICE_ADDRESS = 'localhost'
  static SERVICE_PORT = '5000'
  static BASE_URL: string

  constructor(private http: HttpClient) {
    HttpService.BASE_URL = 'http://' + HttpService.SERVICE_ADDRESS + ':' + HttpService.SERVICE_PORT + '/';
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
    return this.http.post(HttpService.BASE_URL + 'topic', body);
  }

  getPosts(topicId) {
    return this.http.get(HttpService.BASE_URL + 'post/' + topicId);
  }

  postPost(body) {
    return this.http.post(HttpService.BASE_URL + 'post/', body);
  }

}
