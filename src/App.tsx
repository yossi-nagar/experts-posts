import { Component, ReactElement } from 'react';
import './App.css';
import './expertsAnalysis.css';
import { Post } from './Post';
import InfiniteScroll from 'react-infinite-scroll-component';
// eslint-disable-next-line
// import axios from 'axios';
import bent from 'bent';


export type ExpertsAppProps = {
  olderPostsUrl: string
}

export type ExpertsAppState = {
  posts: ReactElement[],
  hasMore: boolean
}
export default class App extends Component<ExpertsAppProps, ExpertsAppState> {
  private getJson: bent.RequestFunction<any>;
  constructor(props: ExpertsAppProps) {
    super(props);
    const initialPosts = require('./data.json');
    this.state = { posts: this.asPosts(initialPosts), hasMore: true }
    this.fetchOlderThan = this.fetchOlderThan.bind(this);
    this.getJson = bent(this.props.olderPostsUrl, 'json');
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

  private fetchOlderThan() {
    let post = this.state.posts[this.state.posts.length - 1];
    let { authorId, creationTime, postLanguage, postId } = post.props;
    const url = `api/expertsPosts?env=dev&a=${authorId}&l=${postLanguage}&p=${postId}&ct=${creationTime}`;
    console.log(url)
    this.getJson(url)
      .then(data => {

        if (data && data.length) {
          this.setState(prevState => {
            return {
              posts: [...prevState.posts, ...this.asPosts(data)],
              hasMore: true
            }
          })
        } else this.setState({hasMore: false})
      })
  }

  public render() {
    return (
      <div className="App posts-container">
        <InfiniteScroll
          dataLength={this.state.posts.length}
          next={this.fetchOlderThan}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}>
          {this.state.posts}
        </InfiniteScroll>
      </div>
    );
  }
}