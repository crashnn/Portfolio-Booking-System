import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } 
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null; // Bu bileşen ekrana bir şey çizmez, sadece işlevseldir.
};

export default ScrollToTop;