import { motion, useReducedMotion } from 'framer-motion';

import glow1 from '@/assets/images/capsule/glow-1.svg';
import glow2 from '@/assets/images/capsule/glow-2.svg';
import glow3 from '@/assets/images/capsule/glow-3.svg';
import letter1 from '@/assets/images/capsule/letter-1.webp';
import letter2 from '@/assets/images/capsule/letter-2.webp';
import letter3 from '@/assets/images/capsule/letter-3.webp';
import letter4 from '@/assets/images/capsule/letter-4.webp';
import letter5 from '@/assets/images/capsule/letter-5.webp';
import letter6 from '@/assets/images/capsule/letter-6.webp';

/** Figma 캡슐 커버 프레임 크기. 모든 좌표는 이 값 기준 비율로 환산한다. */
const FRAME_WIDTH = 393;
const FRAME_HEIGHT = 852;

interface Ellipse {
  src: string;
  /** 좌상단 좌표 (Figma px) */
  x: number;
  y: number;
  size: number;
}

// 배경에 깔리는 보라색 글로우
const ELLIPSES: Ellipse[] = [
  { src: glow1, x: -85, y: 14, size: 300 },
  { src: glow2, x: -116, y: 381, size: 300 },
  { src: glow3, x: 92, y: 80, size: 500 },
];

interface FloatingLetter {
  src: string;
  /** 중심 좌표 (Figma px) */
  cx: number;
  cy: number;
  /** 회전 전 한 변 길이 (Figma px) */
  size: number;
  /** deg */
  rotate: number;
  /**
   * 원본 이미지 좌우 여백을 잘라내기 위한 가로 배율.
   * 이미지는 높이를 꽉 채우고 (scaleX - 1) / 2 만큼 양옆으로 넘겨 자른다.
   */
  scaleX: number;
}

// Figma 그룹(Group 46~57) 순서대로. 겹침 순서도 그대로 유지한다.
const LETTERS: FloatingLetter[] = [
  { src: letter1, cx: 234, cy: 265, size: 117.03, rotate: 20, scaleX: 1.5 },
  {
    src: letter1,
    cx: 255.13,
    cy: 502.13,
    size: 117.03,
    rotate: 0,
    scaleX: 1.5,
  },
  { src: letter2, cx: 77.31, cy: 238.31, size: 160, rotate: -25, scaleX: 1.2 },
  { src: letter3, cx: 111.27, cy: 354.27, size: 80, rotate: -20, scaleX: 1.2 },
  {
    src: letter4,
    cx: 84.43,
    cy: 457.43,
    size: 171.67,
    rotate: 10,
    scaleX: 1.2,
  },
  { src: letter5, cx: 124.3, cy: 592.3, size: 130, rotate: -10, scaleX: 1.2 },
  {
    src: letter5,
    cx: 227.76,
    cy: 387.76,
    size: 84.57,
    rotate: 30,
    scaleX: 1.2,
  },
  { src: letter6, cx: 265.88, cy: 669.05, size: 169, rotate: 10, scaleX: 1.2 },
  {
    src: letter4,
    cx: 346.94,
    cy: 348.16,
    size: 121.43,
    rotate: 30,
    scaleX: 1.2,
  },
  {
    src: letter4,
    cx: 324.67,
    cy: 195.08,
    size: 80.92,
    rotate: -50,
    scaleX: 1.2,
  },
  {
    src: letter2,
    cx: 345.57,
    cy: 552.57,
    size: 68.32,
    rotate: 10,
    scaleX: 1.2,
  },
  { src: letter2, cx: 61.66, cy: 680.66, size: 68.32, rotate: 30, scaleX: 1.2 },
];

/** 한 장의 편지는 글로우 / 약한 블러 / 선명한 원본 3겹을 겹쳐 발광 효과를 낸다. */
const LAYER_BLURS = ['blur-[15px]', 'blur-[2.5px]', ''];

/**
 * Figma LetterCharacter 컴포넌트(6509:4440)의 floating 루프 스펙.
 * phase a ↔ b 를 ease-in-out 으로 왕복하며, b 는 a 의 부호 반대다.
 * 큰 편지일수록 느리게 움직이고 덜 회전한다.
 */
interface FloatSpec {
  /** 이 스펙의 기준 편지 크기 (px) */
  size: number;
  /** phase a 기준 오프셋 (px) */
  x: number;
  y: number;
  /** phase a 기준 회전 (deg) */
  rotate: number;
  /** a→b 지속 시간 (초) */
  durationTo: number;
  /** b→a 지속 시간 (초) */
  durationBack: number;
}

const FLOAT_SPECS: FloatSpec[] = [
  {
    size: 68,
    x: 0.82,
    y: -4,
    rotate: -3.5,
    durationTo: 1.65,
    durationBack: 1.5,
  },
  { size: 84, x: 1.02, y: -5, rotate: -3, durationTo: 1.87, durationBack: 1.7 },
  { size: 124, x: 1.5, y: -7, rotate: -2.5, durationTo: 2.2, durationBack: 2 },
  {
    size: 168,
    x: 2.03,
    y: -10,
    rotate: -2,
    durationTo: 2.64,
    durationBack: 2.4,
  },
];

/** 편지 크기에 가장 가까운 스펙을 고른다. */
const getFloatSpec = (size: number) =>
  FLOAT_SPECS.reduce((closest, spec) =>
    Math.abs(spec.size - size) < Math.abs(closest.size - size) ? spec : closest,
  );

/**
 * 같은 크기의 편지들이 한 몸처럼 움직이지 않도록 주는 시작 지연.
 * Figma 프로토타입에는 없는 값이라 조절해도 된다.
 */
const STAGGER_SECONDS = 0.17;

const percentOfWidth = (value: number) => `${(value / FRAME_WIDTH) * 100}%`;
const percentOfHeight = (value: number) => `${(value / FRAME_HEIGHT) * 100}%`;

/**
 * 캡슐 커버 화면 배경: 보라색 글로우 + 떠다니는 편지 캐릭터들.
 * 장식 요소라 스크린리더에는 노출하지 않는다.
 */
export default function FloatingLetters() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {ELLIPSES.map((ellipse) => (
        <img
          key={ellipse.src}
          src={ellipse.src}
          alt=""
          className="absolute"
          style={{
            left: percentOfWidth(ellipse.x),
            top: percentOfHeight(ellipse.y),
            width: percentOfWidth(ellipse.size),
            height: percentOfWidth(ellipse.size),
          }}
        />
      ))}

      {LETTERS.map((letter, index) => {
        const spec = getFloatSpec(letter.size);
        const duration = spec.durationTo + spec.durationBack;

        return (
          // 위치 지정과 중앙 정렬은 바깥 div 가 맡는다.
          // Motion 이 transform 을 덮어쓰기 때문에 애니메이션과 같은 요소에 두지 않는다.
          <div
            key={index}
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
            style={{
              left: percentOfWidth(letter.cx),
              top: percentOfHeight(letter.cy),
              width: percentOfWidth(letter.size),
            }}
          >
            <motion.div
              className="relative size-full"
              // 배치 회전(letter.rotate)에 흔들림(spec.rotate)을 더해 한 transform 으로 합친다.
              style={reduceMotion ? { rotate: letter.rotate } : undefined}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [spec.x, -spec.x, spec.x],
                      y: [spec.y, -spec.y, spec.y],
                      rotate: [
                        letter.rotate + spec.rotate,
                        letter.rotate - spec.rotate,
                        letter.rotate + spec.rotate,
                      ],
                    }
              }
              transition={{
                duration,
                times: [0, spec.durationTo / duration, 1],
                ease: 'easeInOut',
                repeat: Infinity,
                delay: index * STAGGER_SECONDS,
              }}
            >
              {LAYER_BLURS.map((blur) => (
                <div
                  key={blur}
                  className={`absolute inset-0 overflow-hidden ${blur}`}
                >
                  <img
                    src={letter.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute top-0 h-full max-w-none"
                    style={{
                      width: `${letter.scaleX * 100}%`,
                      left: `${((1 - letter.scaleX) / 2) * 100}%`,
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
