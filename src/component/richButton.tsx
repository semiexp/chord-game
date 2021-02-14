import React, { CSSProperties } from 'react';

type RichButtonProps = {
    text: string;
    textSize: number;
    height: number;
    width: number;
    style?: CSSProperties;
    disabled?: boolean;
    onClick?: () => void;
}

type RichButtonState = {
    isMousedown: boolean;
    isMouseover: boolean;
}

export class RichButton extends React.Component<RichButtonProps, RichButtonState> {
    constructor(props: RichButtonProps) {
        super(props);

        this.state = {
            isMousedown: false,
            isMouseover: false
        };
    }

    mouseDown() {
        if (this.props.disabled) return;

        this.setState({
            isMousedown: true
        });
    }

    mouseUp() {
        if (!this.state.isMousedown) return;

        this.setState({
            isMousedown: false
        });
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    mouseEnter() {
        this.setState({
            isMouseover: true
        });
    }

    mouseLeave() {
        this.setState({
            isMouseover: false
        });
    }

    render() {
        const {text, textSize, height, width, disabled} = this.props;
        const {isMouseover} = this.state;

        const bgColor = disabled ? "#cccccc" : isMouseover ? "#9999ff" : "#ccccff";

        const style: CSSProperties = {
            height,
            width,

            display: "inline-block",
            borderColor: "#666666",
            borderWidth: 2,
            borderStyle: "solid",
            borderRadius: 10,

            backgroundColor: bgColor,

            textAlign: "center",

            userSelect: "none",
            ...this.props.style
        };

        return (
            <div style={style} onMouseDown={() => this.mouseDown()} onMouseUp={() => this.mouseUp()}
                 onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()}>
                <div style={{display: "inline-block"}}>
                    <div style={{verticalAlign: "middle", display: "table-cell", height, fontSize: textSize}}>
                        {text}
                    </div>
                </div>
            </div>
        );
    }
}
