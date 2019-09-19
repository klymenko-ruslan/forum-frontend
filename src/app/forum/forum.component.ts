import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../service/authorization.service';
import {HttpService} from '../service/http.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html'
})
export class ForumComponent implements OnInit {

  loading = false;

  postTopicText = '';
  postText = '';
  postReplyText = '';

  selectedReplyToId = null;
  selectedTopicId = null;
  topics = [];
  posts = [];

  constructor(private authorizationService: AuthorizationService,
              private httpService: HttpService) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loading = true;
    this.httpService.getTopics().subscribe((response: any[]) => {
      this.topics = response;
      this.loading = false;
    });
  }

  getMessageText(messageId) {
    const message = this.posts.filter(it => it['id'] == messageId)[0];
    let prefix = '';
    if(message['replyto']) {
      prefix = '"' + this.getMessageText(message['replyto']['id']) + '"<br />';
    }
    return prefix + message['message'];
  }

  postTopic() {
    if (this.postTopicText.length != 0) {
      this.loading = true;
      const body: any = {};
      body.authorid = localStorage.getItem(AuthorizationService.userId);
      body.name = this.postTopicText;
      this.httpService.postTopic(body).subscribe(response => {
        this.loading = false;
        this.loadTopics();
      });
    }
  }

  postMessage() {
    if (this.postText.length != 0) {
      this.loading = true;
      const body: any = {};
      body.authorid = localStorage.getItem(AuthorizationService.userId);
      body.topicid = this.selectedTopicId;
      body.message = this.postText;
      this.httpService.postPost(body).subscribe(response => {
        this.loadPosts(this.selectedTopicId);
        this.postText = '';
        this.loading = false;
      });
    }
  }

  postReplyMessage() {
    this.loading = true;
    const body: any = {};
    body.authorid = localStorage.getItem(AuthorizationService.userId);
    body.topicid = this.selectedTopicId;
    body.message = this.postReplyText;
    body.replytoid = this.selectedReplyToId;
    this.httpService.postPost(body).subscribe(response => {
      this.loadPosts(this.selectedTopicId);
      this.postReplyText = '';
      this.selectedReplyToId = null;
      this.loading = false;
    });
  }

  selectTopic(topicId) {
    this.selectedTopicId = topicId;
    this.loadPosts(topicId);
  }

  loadPosts(topicId) {
    this.loading = true;
    this.httpService.getPosts(topicId).subscribe((response : any[]) => {
      this.posts = response;
      this.loading = false;
    });
  }

  openReplyWindow(postId) {
    if (this.selectedReplyToId == postId) {
      this.selectedReplyToId = null;
    } else {
      this.selectedReplyToId = postId;
    }
  }

  logout() {
    this.authorizationService.logout();
  }
}
