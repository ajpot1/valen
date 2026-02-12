import React, { useEffect, useMemo, useRef, useState } from "react";
import "./mail.css";

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function randSeeded(i) {
  const x = Math.sin(i * 999) * 10000;
  return x - Math.floor(x);
}

export default function Mail() {
  const rootRef = useRef(null);
  const rafRef = useRef(null);
  const animRef = useRef({ from: 0, to: 0, start: 0, duration: 760 });

  const [isOpen, setIsOpen] = useState(false);
  const [openValue, setOpenValue] = useState(0);
  const [showBouquet, setShowBouquet] = useState(false);

  const letterText = useMemo(
    () => ({
      title: "Happy Valentine’s ❤️",
      body: `Hi love,

hindi man tayo makapag date sa personal, 
 pero let me ask you pa rin:) 

Will you be my Valentine?
`,
    }),
    []
  );

  const letterVisible = openValue > 0.12;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--open", String(openValue));
  }, [openValue]);

  function stopAnim() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  function animateTo(target) {
    stopAnim();

    const from = openValue;
    const to = clamp01(target);
    const start = performance.now();

    animRef.current = { from, to, start, duration: 760 };

    const tick = (now) => {
      const { from, to, start, duration } = animRef.current;
      const t = clamp01((now - start) / duration);
      const eased = easeInOutCubic(t);
      const v = from + (to - from) * eased;

      setOpenValue(v);

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function toggleOpen() {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) setShowBouquet(false);
    animateTo(next ? 1 : 0);
  }

  useEffect(() => () => stopAnim(), []);

  const petals = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }).map((_, i) => {
      const r1 = randSeeded(i + 1);
      const r2 = randSeeded(i + 20);
      const r3 = randSeeded(i + 50);

      return {
        id: i,
        left: `${Math.floor(r1 * 70) + 10}%`,
        delay: `${(r2 * 6).toFixed(2)}s`,
        dur: `${(5.5 + r3 * 5).toFixed(2)}s`,
        size: `${(10 + r1 * 16).toFixed(0)}px`,
        drift: `${(-18 + r2 * 36).toFixed(0)}px`,
        rot: `${Math.floor(r3 * 180) - 90}deg`,
        type: i % 3,
      };
    });
  }, []);

  return (
    <div className="mailPage valentinesBg">
      {showBouquet && (
        <div
          className="bouquetOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Bouquet"
          onClick={() => setShowBouquet(false)}
        >
          <div className="bouquetPopup" onClick={(e) => e.stopPropagation()}>
            <div className="bouquetCloseRow">
              <button
                type="button"
                className="bouquetClose"
                onClick={() => setShowBouquet(false)}
                aria-label="Close bouquet"
              >
                ✕
              </button>
            </div>

            <div className="bouquetEmoji" aria-hidden="true">
              💐
            </div>

            <div className="bouquetTitle">Yay! 🌸</div>
            <div className="bouquetText">isang dambuhalang bouquet for u my Valentine :3</div>
          </div>
        </div>
      )}

      <div className="sideDecor left" aria-hidden="true">
        <div className="flowerCluster">
          <div className="flower f1">
            <span className="petal p1" />
            <span className="petal p2" />
            <span className="petal p3" />
            <span className="petal p4" />
            <span className="petal p5" />
            <span className="center" />
          </div>

          <div className="flower f2">
            <span className="petal p1" />
            <span className="petal p2" />
            <span className="petal p3" />
            <span className="petal p4" />
            <span className="petal p5" />
            <span className="center" />
          </div>

          <div className="stem s1" />
          <div className="stem s2" />
          <div className="leaf l1" />
          <div className="leaf l2" />
        </div>

        <div className="petalRain">
          {petals.map((p) => (
            <span
              key={`L-${p.id}`}
              className={`petalDrop t${p.type}`}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
                width: p.size,
                height: p.size,
                ["--drift"]: p.drift,
                ["--rot"]: p.rot,
              }}
            />
          ))}
        </div>
      </div>

      <div className="sideDecor right" aria-hidden="true">
        <div className="flowerCluster">
          <div className="flower f1">
            <span className="petal p1" />
            <span className="petal p2" />
            <span className="petal p3" />
            <span className="petal p4" />
            <span className="petal p5" />
            <span className="center" />
          </div>

          <div className="flower f2">
            <span className="petal p1" />
            <span className="petal p2" />
            <span className="petal p3" />
            <span className="petal p4" />
            <span className="petal p5" />
            <span className="center" />
          </div>

          <div className="stem s1" />
          <div className="stem s2" />
          <div className="leaf l1" />
          <div className="leaf l2" />
        </div>

        <div className="petalRain">
          {petals.map((p) => (
            <span
              key={`R-${p.id}`}
              className={`petalDrop t${p.type}`}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
                width: p.size,
                height: p.size,
                ["--drift"]: `${parseInt(p.drift, 10) * -1}px`,
                ["--rot"]: p.rot,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mailCard">
        <div className="mailHeader">
          <h2 className="mailTitle">top secret</h2>
          <p className="mailHint">click mo yung envelope</p>
        </div>

        <div
          ref={rootRef}
          className={`envelopeWrap valentines ${isOpen ? "open" : ""}`}
          role="button"
          tabIndex={0}
          aria-label={isOpen ? "Close mail" : "Open mail"}
          onClick={toggleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleOpen();
          }}
        >
          <div className={`letter ${letterVisible ? "visible" : "hidden"}`} aria-hidden={!letterVisible}>
            <div className="letterInner">
              <div className="letterTopRow">
                <span className="stamp" aria-hidden="true">
                
                </span>
                <span className="letterDate">{new Date().toDateString()}</span>
              </div>

              <h3 className="letterHeading">{letterText.title}</h3>

              <div className="letterBody">
                <pre className="letterBodyText">{letterText.body}</pre>

                <div className="letterCtaRow">
                  <button
                    type="button"
                    className="yesBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBouquet(true);
                    }}
                  >
                    Yes 💐
                  </button>
                </div>
              </div>

              <div className="letterFooter">
                <span className="signature">— Ajpotty</span>
              </div>
            </div>
          </div>

          <div className="envelope" aria-hidden="true">
            <div className="envBack" />
            <div className="envPocket" />
            <div className="envFlap" />
            <div className="envFront" />
            <div className="heartSeal" aria-hidden="true">
              ❤
            </div>
          </div>

          <div className="clickLabel">{isOpen ? "Click to close" : "Click to open"}</div>
        </div>
      </div>
    </div>
  );
}
