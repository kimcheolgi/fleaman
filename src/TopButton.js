import React, { useState, useEffect } from 'react';

function TopButton({ outside }) {

  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
      window.scroll({
          top: 0,
          behavior: 'smooth'
      })

  }
  useEffect(() => {
      const handleShowButton = () => {
          if (window.scrollY > 500) {
              setShowButton(true)
          } else {
              setShowButton(false)
          }
      }

      console.log(window.scrollY)
      window.addEventListener("scroll", handleShowButton)
      return () => {
          window.removeEventListener("scroll", handleShowButton)
      }
  }, [])

  return showButton && (
      <div className={outside ? "scroll__container__out" : "scroll__container"}>
          <button id="top" onClick={scrollToTop} type="button" > Top</button>
      </div>

  )
}

export default TopButton;