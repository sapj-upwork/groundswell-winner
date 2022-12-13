import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import Slide from "../Slide/Slide";
import Confetti from "react-dom-confetti";
import "./VerticalCarousel.css";
import Button from "react-bootstrap/Button";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const NavigationButtons = styled.div`
  position: relative;
  display: flex;

  height: 60px;
  margin: 0 auto;
  width: 20%;
  margin-top: 1rem;
  justify-content: space-between;
  z-index: 1000;
`;

const NavBtn = styled.div`
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

const myConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: "168",
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

function mod(a, b) {
  return ((a % b) + b) % b;
}

function getSpeed(limit) {
  return 50;
}

class VerticalCarousel extends React.Component {
  state = {
    index: 0,
    goToSlide: null,
    prevPropsGoToSlide: 0,
    newSlide: false,
    confettiActive: false,
    showWinMsg: false,
    winner: "",
    spinning: false,
    translateWheel: false,
  };

  getLimit = (length) => {
    let limit = Math.floor(Math.random() * length);

    if (limit < 100) {
      limit += 100;
    }

    return limit;
  };

  componentDidMount = () => {
    const length = this.props.slides.length;
    let limit = this.getLimit(length);
    this.spinWheel(limit);
  };

  static propTypes = {
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.any,
        content: PropTypes.object,
      })
    ).isRequired,
    goToSlide: PropTypes.number,
    showNavigation: PropTypes.bool,
    offsetRadius: PropTypes.number,
    animationConfig: PropTypes.object,
  };

  static defaultProps = {
    offsetRadius: 2,
    animationConfig: { tension: 120, friction: 14 },
  };

  modBySlidesLength = (index) => {
    return mod(index, this.props.slides.length);
  };

  spinWheel = (limit) => {
    this.setState({
      showWinMsg: false,
      spinning: true,
      confettiActive: false,
    });

    let step = 0;
    // const winner = this.props.slides[limit - 1].content.props.children;

    const interval = setInterval(() => {
      if (step > limit) {
        this.setState({
          spinning: false,
        });

        const timer = setTimeout(() => {
          this.setState({
            confettiActive: true,
            showWinMsg: true,
          });
        }, 1000);
        clearInterval(interval);
      } else {
        this.moveSlide(1);
      }
      step += 1;
    }, getSpeed(limit));
  };

  moveSlide = (direction) => {
    this.setState({
      index: this.modBySlidesLength(this.state.index + direction),
      goToSlide: null,
    });
  };

  clampOffsetRadius(offsetRadius) {
    const { slides } = this.props;
    const upperBound = Math.floor((slides.length - 1) / 2);

    if (offsetRadius < 0) {
      return 0;
    }
    if (offsetRadius > upperBound) {
      return upperBound;
    }

    return offsetRadius;
  }

  getPresentableSlides() {
    const { slides } = this.props;
    const { index } = this.state;
    let { offsetRadius } = this.props;
    offsetRadius = this.clampOffsetRadius(offsetRadius);
    const presentableSlides = [];

    for (let i = -offsetRadius; i < 1 + offsetRadius; i++) {
      presentableSlides.push(slides[this.modBySlidesLength(index + i)]);
    }

    return presentableSlides;
  }

  restartAnimation() {
    this.props.onWheelSpin(null, null);
  }

  render() {
    const { animationConfig, offsetRadius, showNavigation } = this.props;

    let navigationButtons = null;
    if (showNavigation) {
      navigationButtons = (
        <NavigationButtons>
          <NavBtn onClick={() => this.moveSlide(1)}>&#8593;</NavBtn>
          <NavBtn onClick={() => this.moveSlide(-1)}>&#8595;</NavBtn>
        </NavigationButtons>
      );
    }
    return (
      <React.Fragment>
        <Wrapper
          className={
            this.state.spinning && this.state.translateWheel
              ? "vc-spinning"
              : "tesss"
          }
        >
          {this.getPresentableSlides().map((slide, presentableIndex) => (
            <Slide
              key={slide.key}
              content={slide.content}
              moveSlide={this.moveSlide}
              offsetRadius={this.clampOffsetRadius(offsetRadius)}
              index={presentableIndex}
              animationConfig={animationConfig}
              amount={this.props.amount}
              showWinMsg={this.state.showWinMsg}
            />
          ))}
          {this.state.showWinMsg ? (
            <Button
              onClick={() => {
                this.spinWheel(this.getLimit(this.props.slides.length));
              }}
              className="w-submit-btn vc-respin-button"
              size="lg"
              variant="info"
            >
              I'm Feeling Generous
            </Button>
          ) : (
            <></>
          )}
          <Confetti active={this.state.confettiActive} config={myConfig} />
        </Wrapper>
        {navigationButtons}
      </React.Fragment>
    );
  }
}

export default VerticalCarousel;
