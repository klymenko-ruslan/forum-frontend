import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../service/authorization.service';
import {HttpService} from '../service/http.service';
import {NotificationsService} from 'angular2-notifications';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html'
})
export class ForumComponent implements OnInit {

  loading = false;

  page = 1;

  userPage = 1;

  isUserManagement = false;

  postTopicText = '';
  postText = '';
  postReplyText = '';
  postModifyText = '';

  selectedModifyId = null;
  selectedReplyToId = null;
  selectedTopicId = null;
  selectedTopicAuthor = null;
  topics = [];
  posts = [];
  users = [];

  isCreateTopic = false;

  constructor(private authorizationService: AuthorizationService,
              private httpService: HttpService,
              private notificationService: NotificationsService,
              private datePipe: DatePipe) {}

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
      prefix = '' + this.getMessageText(message['replyto']['id']) + '';
    }
    return prefix + '"' + message['message'] + '" - ' + message['author']['username'] + ', ' + this.datePipe.transform(message['timestamp'], 'HH:mm:ss dd/MM/yyyy') + '\n';
  }

  checkCreateTopic() {
    this.isCreateTopic = !this.isCreateTopic;
  }

  postTopic() {
    if (this.postTopicText.length != 0) {
      this.loading = true;
      const body: any = {};
      body.authorid = localStorage.getItem(AuthorizationService.userId);
      body.name = this.postTopicText;
      this.httpService.postTopic(body).subscribe(response => {
        this.isCreateTopic = false;
        this.loading = false;
        this.notificationService.create('Accepted', 'Topic was created');
        this.loadTopics();
        this.selectedTopicId = null;
        this.selectedTopicAuthor = null;
        this.selectedReplyToId = null;
      }, err => {
        this.notificationService.error('Failed', 'Topic was not created. Please verify that the topic name is unique');
        this.loading = false;
        this.selectedTopicId = null;
        this.selectedTopicAuthor = null;
        this.selectedReplyToId = null;
      });
    } else {
      this.notificationService.error('Error', 'Topic name cant be empty');
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

  selectTopic(topicId, authorId) {
    if (this.selectedTopicId == topicId) {
      this.selectedTopicId = null;
      this.selectedTopicAuthor = null;
    } else {
      this.selectedTopicId = topicId;
      this.selectedTopicAuthor = authorId;
      this.loadPosts(topicId);
    }
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

  removeTopic() {
    this.loading = true;
    this.httpService.removeTopic(this.selectedTopicId).subscribe(response => {
      this.selectedTopicId = null;
      this.selectedTopicAuthor = null;
      this.loadTopics();
      this.loading = false;
    });
  }

  removePost(postId) {
    this.loading = true;
    this.httpService.removePost(postId).subscribe(response => {
      this.loadPosts(this.selectedTopicId);
      this.loading = false;
    }, err => {
      this.notificationService.error('Deletion failed', 'Its not possible to remove message. Somebody already replied to it.')
      this.loading = false;
    });
  }

  openModifyPost(postId) {
    if (this.selectedModifyId == postId) {
      this.selectedModifyId = null;
    } else {
      this.selectedModifyId = postId;
    }
  }

  modifyPost() {
    this.loading = true;
    this.httpService.modifyPost(this.selectedModifyId, this.postModifyText).subscribe(response => {
      this.loadPosts(this.selectedTopicId);
      this.selectedModifyId = null;
      this.postModifyText = null;
      this.loading = false;
    }, err => {
      this.notificationService.error('Update failed', 'Its not possible to update message now. Try later')
      this.loading = false;
    });
  }

  isAdmin() {
    return 'admin' == localStorage.getItem(AuthorizationService.role);
  }

  getUserid() {
    return localStorage.getItem(AuthorizationService.userId);
  }

  loadUserList() {
    this.isUserManagement = true;

    this.httpService.getUsers().subscribe((response: any[]) => {
      this.users = response;
    });
  }

  openTopics() {
    this.isUserManagement = false;
    this.loadTopics();
  }

  removeUser(userId) {
    this.loading = true;
    this.httpService.removeUser(userId).subscribe(response => {
      this.loadUserList();
      this.loading = false;
    });
  }

  logout() {
    this.authorizationService.logout();
  }
}
