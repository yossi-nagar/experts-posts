import React from "react";
import { Component } from "react";

export type SpeechBubbleProps = {
    text: string;
    bubbleClick: () => void
}

type SpeechBubbleState = {
    isFixed: boolean
}

export class SpeechBubble extends Component<SpeechBubbleProps, SpeechBubbleState> {
    private bubbleRef: React.RefObject<HTMLDivElement>
    constructor(props: SpeechBubbleProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = { isFixed: false }
        this.handleScroll = this.handleScroll.bind(this);
        this.bubbleRef = React.createRef<HTMLDivElement>();
    }
    

    private handleScroll() {
        if (this.bubbleRef.current) {

            let top = this.bubbleRef.current.parentElement!.getBoundingClientRect().top;
            if (top <= 0) {
                this.bubbleRef.current.style.position = "fixed";
            }
            else if (top > 21) this.bubbleRef.current.style.position = "absolute";
        }
    }

    public componentDidMount() {
        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll, {passive: true});
    }
    public componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    private onClick() {
        this.props.bubbleClick();
    }


    render() {
        return (<div 
        ref={this.bubbleRef} 
        className="speech-bubble" 
        onClick={this.onClick} >
            {this.props.text}
        </div>
        )
    }
}