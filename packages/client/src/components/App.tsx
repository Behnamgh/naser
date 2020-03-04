import React, { useEffect, useRef } from 'react';

import Section from './sections';
import { FullPage, Slide } from 'react-full-page';
import Frames from "./Frames";
import Logos from "./Logos";
import Walls from "./Walls";
import Menu from "./Menu";
import Gears from "./Gears";
import '../sass/main.scss';

const App = () => {

  const ImageRefs = {
    gear1: useRef<HTMLImageElement>(null),
    gear2: useRef<HTMLImageElement>(null),
    gear3: useRef<HTMLImageElement>(null),
    mainHeader: useRef<HTMLImageElement>(null)
  }

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      if (ImageRefs.gear1.current) ImageRefs.gear1.current.style.transform = `rotate(${-window.scrollY / 10}deg)`;
      if (ImageRefs.gear2.current) ImageRefs.gear2.current.style.transform = `rotate(${window.scrollY / 10}deg)`;
      if (ImageRefs.gear3.current) ImageRefs.gear3.current.style.transform = `rotate(${window.scrollY / 10}deg)`;
    })
  });

  const startChange = (data: { from: number, to: number }) => {
    if (ImageRefs.mainHeader.current) ImageRefs.mainHeader.current.style.display = "none"
  }

  const endChange = (data: { from: number, to: number }) => {
    if (ImageRefs.mainHeader.current) ImageRefs.mainHeader.current.style.display = "unset"
  }

  return (<div className="App">
    <Walls />
    <Logos />
    <Gears ImageRefs={ImageRefs} />
    <Frames />
    <div className="content">
      <FullPage controls={(props: any) => <Menu {...props} forwardRef={ImageRefs.mainHeader} />} afterChange={endChange} beforeChange={startChange}>
        <Slide>
          <Section title="homepage" />
        </Slide>
        <Slide>
          <Section title="videos" />
        </Slide>
        <Slide>
          <Section title="gameplay" />
        </Slide>
        <Slide>
          <Section title="gallery" />
        </Slide>
        <Slide>
          <Section title="news" />
        </Slide>
        <Slide>
          <Section title="joinus" />
        </Slide>
      </FullPage>
    </div>
  </div>
  );
};

export default App;