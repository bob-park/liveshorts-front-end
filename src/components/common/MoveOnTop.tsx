import { useState, useEffect } from 'react';

// react icon
import { FaArrowUp } from 'react-icons/fa';

export default function MoveOnTop() {
  // state
  const [showMoveTop, setShowMoveTop] = useState<boolean>(false);

  // useEffect
  useEffect(() => {
    document.addEventListener('scroll', () => {
      setShowMoveTop(scrollY > 150);
    });
  }, []);

  // handle
  const handleScrollTop = () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`sticky bottom-5 transition-all delay-150 duration-300 ${
        showMoveTop ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex justify-end">
        <div className="tooltip" data-tip="맨 위로">
          <button
            className="btn btn-circle btn-neutral transition delay-300 hover:scale-110 duration-300"
            type="button"
            onClick={handleScrollTop}
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
