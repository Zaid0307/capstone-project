import { useState, useEffect } from 'react';
import { BiArrowToTop } from 'react-icons/bi';
import styled from 'styled-components';

export default function BacktoTopButton() {
  const [backtoTop, setBacktoTop] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        setBacktoTop(true);
      } else {
        setBacktoTop(false);
      }
    });
  }, []);

  const scroleToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {backtoTop && (
        <ToTopButton onClick={scroleToTop}>
          <BiArrowToTop size={30} />
        </ToTopButton>
      )}
    </div>
  );
}

const ToTopButton = styled.button`
  background-color: #496b73;
  color: white;
  position: fixed;
  bottom: 60px;
  right: 10px;
  height: 30px;
  border-radius: 50%;
  width: 30px;
  display: inline-flex;
  border: none;
  border: 2px solid #283a45;
  outline: none;
`;
