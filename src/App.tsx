import React, { Component, ReactElement } from 'react';
import bent from 'bent';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Post } from './components/Post';
import { SpeechBubble } from './components/SpeechBubble';


//****Notice THE API ENV YOU ARE USING! */

export type ExpertsAppProps = {
  olderPostsUrl: string,
  lang: string,
  authorId: string
}

export type ExpertsAppState = {
  posts: ReactElement[],
  hasMore: boolean,
  showSpeechBubble: boolean
}
export default class App extends Component<ExpertsAppProps, ExpertsAppState> {

  private getJson: bent.RequestFunction<any>;
  private appRef: React.RefObject<HTMLDivElement>;
  private latestInterval: number;
  private latestPosts: ReactElement[];

  constructor(props: ExpertsAppProps) {
    super(props);
    this.state = {
      posts: [],
      hasMore: true,
      showSpeechBubble: false
    }
    
    this.latestPosts = [];
    this.fetchOlderThan = this.fetchOlderThan.bind(this);
    this.fetchInitial = this.fetchInitial.bind(this);
    this.onBubbleChange = this.onBubbleChange.bind(this);
    this.getJson = bent(this.props.olderPostsUrl, 'json');
    this.fetchLatest = this.fetchLatest.bind(this);
    this.appRef = React.createRef<HTMLDivElement>();
    this.latestInterval = 0;
  }


  private async fetchInitial() {
    let data = await this.getJson(`api/expertsPosts?env=prod&l=${this.props.lang}&a=${this.props.authorId}`);
    if (data && data.length) {
      this.setState({posts: this.asPosts(data)})
       this.latestInterval = window.setTimeout(this.fetchLatest, 1000 * 60)
    }
    // const initialPosts = require('./data.json');
    // this.setState({posts: this.asPosts(initialPosts)})
    // this.latestInterval = window.setTimeout(this.fetchLatest, 1000 * 2)
  }

  private async fetchLatest(ts?: number) {
    let post = this.state.posts[0];
    let data = await this.getJson(`api/expertsLatest?env=dev&l=${post.props.postLanguage}&a=${post.props.authorId}&ct=${ts || post.props.creationTime}`);
    
    if (data && data.length) {
      this.latestPosts.push(...this.asPosts(data));
      this.setState({ showSpeechBubble: true });
    }
    this.latestInterval = window.setTimeout(this.fetchLatest, 1000 * 60)
  }


  private renderSpeechBubble() {
    return this.state.showSpeechBubble ? <SpeechBubble bubbleClick={this.onBubbleChange} text="New Posts" /> : null;
  }


  private asPosts(data: any[]): ReactElement[] {
    let posts = [] as ReactElement[];
    for (const item of data) {
      let [, post] = item;
      posts.push(<Post
        key={post.id}
        creationTime={post.creationTime}
        postId={post.id}
        content={post.content}
        postLanguage={post.lang}
        authorId={post.authorId}
      />)
    }
    return posts;
  }


  private onBubbleChange() {
    if (this.appRef.current) {
      window.clearInterval(this.latestInterval);
      this.setState(prevState => {
        return {
          showSpeechBubble: false,
          posts: [...this.latestPosts, ...prevState.posts]
        }
      }, this.fetchLatest);
      this.appRef.current.scrollIntoView({behavior: "smooth"});//needs more tests
      // window.location.href = `#${this.appRef.current.id}`

    }
  }


  private fetchOlderThan() {
    let post = this.state.posts[this.state.posts.length - 1];
    let { authorId, creationTime, postLanguage, postId } = post.props;
    const url = `api/expertsPosts?env=prod&a=${authorId}&l=${postLanguage}&p=${postId}&ct=${creationTime}`;
    this.getJson(url)
      .then(data => {

        if (data && data.length) {          
          this.setState(prevState => {
            return {
              posts: [...prevState.posts, ...this.asPosts(data)],
              hasMore: true,
              showSpeechBubble: prevState.showSpeechBubble
            }
          })
        } else this.setState({ hasMore: false })
      })
  }

  public componentDidMount() {
    this.fetchInitial();
  }

  public componentWillUnmount() {
    window.clearInterval(this.latestInterval);
  }

  public render() {
    return (
      <div ref={this.appRef} id="feed" className="App posts-container">
        {this.renderSpeechBubble()}
        <InfiniteScroll
          dataLength={this.state.posts.length}
          next={this.fetchOlderThan}
          hasMore={this.state.hasMore}
          loader={<div className="exp-loader"></div>}>
          {this.state.posts}
        </InfiniteScroll>
      </div>

    );
  }
}
