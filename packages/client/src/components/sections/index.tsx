import React, { useContext } from 'react';

import Videos from './Videos'
import Gallery from './Gallery'
import HomePage from './HomePage'
import GamePlay from './GamePlay';
import News from './News';
import JoinUs from './JoinUs';
import languageContext from '../contexts/lang';


interface ISampleProps {
  page: any;
}

const Section = ({ page }: ISampleProps) => {
  const { lang } = useContext(languageContext);

  const renderComponent = () => {

    switch (page.name) {
      case "homepage":
        return <HomePage page={page} />;

      case "videos":
        return <Videos page={page} />;

      case "gallery":
        return <Gallery page={page} />;

      case "gameplay":
        return <GamePlay page={page} />;

      case "news":
        const slideData = page.contents[0].values && page.contents[0].values[lang];

        return <News slideData={slideData.reverse()} />;

      case "joinus":
        return <JoinUs page={page} />;

      default:
        return <HomePage page={page} />;
    }

  }


  return (
    <div className="section">
      {renderComponent()}
    </div>
  )
};

export default Section;