import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTag = props => {
  // props로 content 내용을 불러올 예정임
    return (
      <Helmet>
        <title>{props.title}</title>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={props.desc} />
        <meta name="naver-site-verification" content="69b2856597e9e025d8bcf572bdf5b21315723762" />
        <meta property="og:type" content="website" /> 
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.desc} />
        <meta property="og:image" content="https://fleaman.shop/logo.png" />
        <meta property="og:url" content={props.url} />

      </Helmet>
    );
};

export default MetaTag;