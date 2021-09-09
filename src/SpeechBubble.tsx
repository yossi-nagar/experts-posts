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
    private myRef: React.RefObject<HTMLDivElement>
    constructor(props: SpeechBubbleProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = { isFixed: false }
        this.handleScroll = this.handleScroll.bind(this);
        this.myRef = React.createRef<HTMLDivElement>();
    }
    

    private handleScroll() {
        if (this.myRef.current) {
            let top = this.myRef.current.parentElement!.getBoundingClientRect().top;
            console.log(top);
            if (top <= 0) {
                this.myRef.current.style.position = "fixed";
            }
            else if (top > 21) this.myRef.current.style.position = "absolute";
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
        ref={this.myRef} 
        className="speech-bubble" 
        onClick={this.onClick} >
            {this.props.text}
        </div>
        )
    }
}