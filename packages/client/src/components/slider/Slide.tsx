import React from 'react';

import BOTTOMFRAME from '../../images/-e-SmallFrame.png'
import IMAGELIGHT from '../../images/-e-SmallFrame-Light.png'
import NEWSHOLDER from '../../images/Layer 1.png'
import cx from "classnames";


function Slide(props: any) {

  const handleSlideClick = (event: any) => {
    props.handleSlideClick(props.slide.index);
  }

  const { index, src } = props.slide;

  const current = props.current;
  let classNames = "";

  if (props.type === "GALLERY") classNames = "gallery-slide"
  else if (props.type === "NEWS") classNames += " news-slide";

  if (current === index) classNames += " slide--current";
  else if (current - 1 === index) classNames += " slide--previous";
  else if (current + 1 === index) classNames += " slide--next";

  return (
    <li
      className={classNames}
      onClick={handleSlideClick}
    >
      {
        props.type === "GALLERY" &&
        <div className="gallery-slide__image-wrapper">
          <img key={index} src={src} className={cx("slide__image", { "slide--current-image": current === index })} alt={src} />
          <img src={BOTTOMFRAME} className={cx("gallery__bottom", { "slide--current-frame": current === index })} alt="" />
          <img src={IMAGELIGHT} className={cx("slide--current-light", { "slide--current-light": current === index })} alt="" />
        </div>
      }

      {
        props.type === "NEWS" &&
        <div className="">
          <img className="news__holder" src={NEWSHOLDER} alt="" />
        </div>
      }

    </li>
  );
}

export default Slide;
