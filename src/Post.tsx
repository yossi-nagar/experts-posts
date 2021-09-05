import React, { Component } from "react";

export type PostProps = {
    content: string,
    creationTime: number,
    postId: string,
    postLanguage: string,
    authorId: string
}
export class Post extends Component<PostProps> {


    formatCreationTime(timestamp: number) {
        let d = new Date(timestamp);
        return d.toLocaleString('en-GB');
    }

    createContentMarkup(content: string) {
        return {
            __html: content
        }
    }
    render() {
        return (
            <div className="post-container">
                <img className="exp-img" src="https://www.iforex.in/fihservices/13d4275c-0a4d-4728-99bc-e442ba804c9e_walid.png?auto=compress,format" alt="Walid Salaheldin Mohamed" />
                <div className="post-content-img-container">
                    <div className="post-content-wrapper">

                        <div className="post-header post-timestamp">{this.formatCreationTime(this.props.creationTime)}</div>


                        <div className="post-content" 
                        dangerouslySetInnerHTML={this.createContentMarkup(this.props.content)} />


                    </div>
                </div>
            </div>
        );
    }
}