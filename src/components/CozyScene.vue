<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

defineProps<{ eyesClosed?: boolean }>();

const catHead = ref<SVGGElement | null>(null);
const gaze = ref({ x: 0, y: 0 });

const MAX_GAZE = 2.4;
const FULL_DISTANCE = 320;

function onMouseMove(event: MouseEvent) {
  const head = catHead.value;
  if (!head) return;

  const rect = head.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return;

  const strength = Math.min(distance / FULL_DISTANCE, 1);
  gaze.value = {
    x: (dx / distance) * strength * MAX_GAZE,
    y: (dy / distance) * strength * MAX_GAZE,
  };
}

onMounted(() => window.addEventListener("mousemove", onMouseMove));
onUnmounted(() => window.removeEventListener("mousemove", onMouseMove));

const bulbs = [
  { x: 150, y: 368 },
  { x: 212, y: 380 },
  { x: 275, y: 384 },
  { x: 337, y: 380 },
  { x: 400, y: 368 },
  { x: 462, y: 380 },
  { x: 525, y: 384 },
  { x: 587, y: 380 },
  { x: 650, y: 368 },
];

const fireflies = [
  { x: 130, y: 790, delay: "0s" },
  { x: 255, y: 835, delay: "1.4s" },
  { x: 575, y: 805, delay: "0.7s" },
  { x: 690, y: 770, delay: "2.1s" },
  { x: 470, y: 860, delay: "1s" },
];
</script>

<template>
  <svg
    viewBox="0 0 800 900"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="rough" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.035"
          numOctaves="2"
          seed="4"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="3.4"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.25  0 0 0 0 0.19  0 0 0 0 0.12  0 0 0 0.6 0"
        />
      </filter>

      <pattern
        id="shingles"
        width="30"
        height="18"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 12 Q15 2 30 12"
          fill="none"
          stroke="#8f4f22"
          stroke-opacity="0.35"
          stroke-width="2.5"
        />
      </pattern>

      <clipPath id="houseClip">
        <path d="M150 672 V350 L400 170 L650 350 V672 Z" />
      </clipPath>
      <clipPath id="windowClip">
        <rect x="196" y="412" width="188" height="146" />
      </clipPath>
    </defs>

    <rect width="800" height="900" fill="#e4ecdf" />
    <circle cx="630" cy="150" r="78" fill="#f4d9a6" opacity="0.3" />
    <circle cx="630" cy="150" r="54" fill="#f4d9a6" />

    <g fill="#f7f2e6" opacity="0.95">
      <g class="cloud cloud-a">
        <ellipse cx="150" cy="172" rx="62" ry="16" />
        <ellipse cx="186" cy="158" rx="34" ry="18" />
        <ellipse cx="118" cy="164" rx="30" ry="13" />
      </g>
      <g class="cloud cloud-b">
        <ellipse cx="560" cy="262" rx="52" ry="13" />
        <ellipse cx="590" cy="250" rx="28" ry="15" />
        <ellipse cx="534" cy="256" rx="24" ry="11" />
      </g>
    </g>

    <g filter="url(#rough)">
      <path
        d="M0 560 C120 500 260 520 380 560 C520 600 640 520 800 540 V900 H0 Z"
        fill="#c9d7c2"
      />
      <path
        d="M0 640 C160 590 300 620 440 650 C580 680 700 620 800 640 V900 H0 Z"
        fill="#b3c6ab"
      />
      <g fill="#8fa889">
        <circle cx="70" cy="580" r="34" />
        <circle cx="108" cy="596" r="26" />
        <circle cx="735" cy="590" r="36" />
        <circle cx="696" cy="606" r="24" />
      </g>
      <g stroke="#6b5036" stroke-width="5" stroke-linecap="round">
        <path d="M70 612 V650" />
        <path d="M735 624 V660" />
      </g>
    </g>

    <g filter="url(#rough)">
      <rect x="548" y="168" width="46" height="130" fill="#8f4f22" />
      <rect x="541" y="160" width="60" height="14" rx="2" fill="#a85d2a" />

      <path d="M150 672 V350 L400 170 L650 350 V672 Z" fill="#93ab8d" />
      <g clip-path="url(#houseClip)" stroke="#7f9a7a" stroke-width="2.5">
        <path
          v-for="x in 18"
          :key="x"
          :d="`M${150 + x * 27} 150 V672`"
          opacity="0.75"
        />
      </g>

      <polyline
        points="128,360 400,148 672,360"
        fill="none"
        stroke="#b5642b"
        stroke-width="20"
        stroke-linejoin="miter"
      />
      <polyline
        points="128,360 400,148 672,360"
        fill="none"
        stroke="url(#shingles)"
        stroke-width="20"
      />
      <polyline
        points="136,372 400,164 664,372"
        fill="none"
        stroke="#8f4f22"
        stroke-width="4"
        opacity="0.6"
      />

      <circle cx="400" cy="287" r="31" fill="#f6efe0" />
      <circle cx="400" cy="287" r="24" fill="#f4cf86" />
      <path d="M400 263 V311 M376 287 H424" stroke="#f6efe0" stroke-width="4" />

      <rect x="186" y="406" width="208" height="158" rx="6" fill="#f6efe0" />
      <rect x="196" y="412" width="188" height="146" fill="#f4cf86" />
      <g clip-path="url(#windowClip)">
        <rect x="204" y="470" width="62" height="5" fill="#8f6a43" />
        <rect x="204" y="508" width="62" height="5" fill="#8f6a43" />
        <g>
          <rect x="208" y="446" width="9" height="24" fill="#6b8a69" />
          <rect x="218" y="450" width="8" height="20" fill="#dc8a3c" />
          <rect x="227" y="444" width="10" height="26" fill="#f6efe0" />
          <rect x="238" y="449" width="8" height="21" fill="#b5642b" />
          <rect x="247" y="446" width="9" height="24" fill="#8fa889" />
          <rect x="210" y="484" width="10" height="24" fill="#dc8a3c" />
          <rect x="221" y="488" width="8" height="20" fill="#6b8a69" />
          <rect x="230" y="482" width="9" height="26" fill="#f6efe0" />
        </g>
        <path d="M318 468 L324 446 H342 L348 468 Z" fill="#e8913f" />
        <path d="M333 468 V520" stroke="#5a3d2b" stroke-width="3" />
        <ellipse cx="333" cy="522" rx="14" ry="5" fill="#5a3d2b" />
      </g>
      <path d="M290 412 V558 M196 486 H384" stroke="#f6efe0" stroke-width="6" />
      <rect x="176" y="560" width="228" height="12" rx="2" fill="#b58a5b" />

      <rect x="452" y="430" width="138" height="244" fill="#f6efe0" />
      <rect x="462" y="440" width="118" height="234" fill="#5f7d5b" />
      <g fill="none" stroke="#46634a" stroke-width="3">
        <rect x="474" y="452" width="94" height="72" />
        <rect x="474" y="536" width="94" height="124" />
      </g>
      <circle cx="521" cy="490" r="21" fill="#f6efe0" />
      <circle cx="521" cy="490" r="15" fill="#f4cf86" />
      <circle cx="566" cy="580" r="5" fill="#e9c46a" />
      <circle
        cx="521"
        cy="590"
        r="21"
        fill="none"
        stroke="#b9c9b3"
        stroke-width="8"
      />
      <g fill="#dc8a3c">
        <circle cx="506" cy="578" r="3.5" />
        <circle cx="537" cy="602" r="3.5" />
        <circle cx="534" cy="574" r="3" />
      </g>

      <path d="M620 436 H640 M632 436 V430" stroke="#5a3d2b" stroke-width="3" />
      <rect
        x="612"
        y="442"
        width="18"
        height="28"
        rx="2"
        fill="#f4cf86"
        stroke="#5a3d2b"
        stroke-width="3"
      />
      <path d="M609 442 H633 L621 430 Z" fill="#5a3d2b" />
    </g>

    <g class="flicker">
      <ellipse
        cx="333"
        cy="496"
        rx="58"
        ry="46"
        fill="#fff0c2"
        opacity="0.55"
      />
      <circle cx="400" cy="287" r="24" fill="#fff0c2" opacity="0.4" />
      <circle cx="521" cy="490" r="15" fill="#fff0c2" opacity="0.4" />
    </g>
    <g class="flicker lantern">
      <circle cx="621" cy="456" r="38" fill="#f8d98f" opacity="0.4" />
    </g>

    <g class="curtain curtain-l">
      <path d="M194 410 H238 C233 458 244 510 239 560 H194 Z" fill="#efe3c5" />
      <path d="M194 502 H239" stroke="#dc8a3c" stroke-width="7" />
    </g>
    <g class="curtain curtain-r">
      <path d="M386 410 H342 C347 458 336 510 341 560 H386 Z" fill="#efe3c5" />
      <path d="M386 502 H341" stroke="#dc8a3c" stroke-width="7" />
    </g>

    <g class="plant-sill">
      <path d="M198 560 L202 540 H222 L226 560 Z" fill="#dc8a3c" />
      <path
        d="M212 541 C196 524 196 510 204 500 C212 510 214 526 212 541 Z"
        fill="#6b8a69"
      />
      <path
        d="M212 541 C214 520 224 508 238 506 C236 520 226 534 212 541 Z"
        fill="#5f7d5b"
      />
      <path
        d="M212 541 C208 524 214 510 220 498 C226 512 222 528 212 541 Z"
        fill="#8fa889"
      />
    </g>

    <g class="hang-plant">
      <path d="M160 360 V392" stroke="#5a3d2b" stroke-width="2" />
      <path d="M145 392 H175 L171 416 H149 Z" fill="#b5642b" />
      <path
        d="M152 416 C140 436 144 452 150 462 C158 448 158 432 152 416 Z"
        fill="#6b8a69"
      />
      <path
        d="M160 416 C162 440 158 456 164 470 C172 452 170 432 160 416 Z"
        fill="#8fa889"
      />
      <path
        d="M168 416 C180 432 182 446 176 458 C168 446 166 430 168 416 Z"
        fill="#5f7d5b"
      />
    </g>

    <path
      d="M150 368 Q275 404 400 368 Q525 404 650 368"
      fill="none"
      stroke="#5a3d2b"
      stroke-width="1.6"
    />
    <g>
      <g v-for="(bulb, i) in bulbs" :key="i">
        <circle
          class="bulb"
          :cx="bulb.x"
          :cy="bulb.y + 5"
          r="10"
          fill="#f8d98f"
          opacity="0.35"
          :style="{ animationDelay: `${i * 0.35}s` }"
        />
        <circle :cx="bulb.x" :cy="bulb.y + 5" r="4.5" fill="#f8d98f" />
      </g>
    </g>

    <g filter="url(#rough)">
      <rect x="100" y="672" width="600" height="34" fill="#b58a5b" />
      <g stroke="#8f6a43" stroke-width="2" opacity="0.7">
        <path d="M100 684 H700 M100 696 H700" />
        <path d="M190 672 V706 M310 672 V706 M470 672 V706 M610 672 V706" />
      </g>
      <rect x="100" y="706" width="600" height="12" fill="#8f6a43" />
      <rect x="330" y="718" width="150" height="16" fill="#b58a5b" />
      <rect x="350" y="734" width="110" height="14" fill="#a07848" />

      <path
        d="M0 735 C120 715 250 740 380 750 C520 760 650 725 800 740 V900 H0 Z"
        fill="#7f9d79"
      />
      <path
        d="M0 800 C150 780 300 810 450 800 C600 790 700 805 800 795 V900 H0 Z"
        fill="#6b8a69"
      />

      <ellipse cx="82" cy="700" rx="62" ry="52" fill="#6b8a69" />
      <ellipse cx="60" cy="688" rx="30" ry="26" fill="#7f9d79" />
      <ellipse cx="724" cy="704" rx="66" ry="54" fill="#6b8a69" />
      <ellipse cx="746" cy="690" rx="30" ry="26" fill="#7f9d79" />
      <g fill="#dc8a3c">
        <circle cx="62" cy="708" r="4" />
        <circle cx="96" cy="690" r="4" />
        <circle cx="718" cy="712" r="4" />
        <circle cx="750" cy="696" r="4" />
      </g>

      <g stroke="#4f6b4e" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M60 790 q3 -14 9 -22 M69 790 q0 -12 -2 -20" />
        <path d="M300 826 q3 -14 9 -22 M309 826 q0 -12 -2 -20" />
        <path d="M640 812 q3 -14 9 -22 M649 812 q0 -12 -2 -20" />
        <path d="M740 850 q3 -14 9 -22 M749 850 q0 -12 -2 -20" />
        <path d="M180 860 q3 -14 9 -22 M189 860 q0 -12 -2 -20" />
      </g>
      <g stroke="#4f6b4e" stroke-width="2" fill="none">
        <path d="M150 800 V782 M520 830 V810 M690 790 V772 M220 822 V804" />
      </g>
      <g>
        <circle cx="150" cy="780" r="6" fill="#f6efe0" />
        <circle cx="520" cy="808" r="6" fill="#dc8a3c" />
        <circle cx="690" cy="770" r="6" fill="#f6efe0" />
        <circle cx="220" cy="802" r="6" fill="#dc8a3c" />
      </g>
    </g>

    <ellipse cx="352" cy="694" rx="96" ry="14" fill="#f1e3c4" />
    <path
      d="M258 694 Q352 707 446 694"
      fill="none"
      stroke="#dc8a3c"
      stroke-width="2.5"
    />

    <g class="mug">
      <rect x="534" y="676" width="24" height="24" rx="4" fill="#dc8a3c" />
      <path
        d="M558 682 q10 0 10 8 q0 8 -10 8"
        fill="none"
        stroke="#dc8a3c"
        stroke-width="3"
      />
      <g
        class="steam"
        fill="none"
        stroke="#f6efe0"
        stroke-width="2.5"
        stroke-linecap="round"
      >
        <path
          d="M541 668 q-5 -8 0 -15 q5 -7 0 -15"
          style="animation-delay: 0s"
        />
        <path
          d="M549 668 q-5 -8 0 -15 q5 -7 0 -15"
          style="animation-delay: 1s"
        />
        <path
          d="M556 668 q-5 -8 0 -15 q5 -7 0 -15"
          style="animation-delay: 2s"
        />
      </g>
    </g>

    <g transform="translate(352 690) scale(1.5) translate(-420 -690)">
      <g class="tail">
        <path
          d="M370 668 C342 690 330 702 336 718 C340 728 358 724 355 708"
          fill="none"
          stroke="#dc8a3c"
          stroke-width="14"
          stroke-linecap="round"
        />
        <path
          d="M370 668 C342 690 330 702 336 718 C340 728 358 724 355 708"
          fill="none"
          stroke="#b5642b"
          stroke-width="14"
          stroke-dasharray="5 15"
        />
      </g>

      <g class="breathe-cat">
        <ellipse cx="420" cy="662" rx="54" ry="30" fill="#dc8a3c" />
        <g fill="none" stroke="#b5642b" stroke-width="4" stroke-linecap="round">
          <path d="M392 640 Q396 650 392 660" />
          <path d="M408 636 Q412 648 408 658" />
          <path d="M424 636 Q428 648 424 658" />
        </g>
        <ellipse cx="446" cy="676" rx="22" ry="15" fill="#f3dfb8" />
        <ellipse cx="438" cy="690" rx="9" ry="5" fill="#f3dfb8" />
        <ellipse cx="466" cy="690" rx="9" ry="5" fill="#f3dfb8" />
      </g>

      <g ref="catHead" class="cat-head">
        <polygon points="436,630 440,602 458,618" fill="#dc8a3c" />
        <g class="ear-twitch">
          <polygon points="474,630 470,602 452,618" fill="#dc8a3c" />
          <polygon points="470,624 468,610 458,619" fill="#e59a85" />
        </g>
        <polygon points="440,624 442,609 452,619" fill="#e59a85" />
        <circle cx="455" cy="636" r="22" fill="#dc8a3c" />
        <g fill="none" stroke="#b5642b" stroke-width="3" stroke-linecap="round">
          <path d="M455 615 V622" />
          <path d="M446 617 L448 623" />
          <path d="M464 617 L462 623" />
        </g>
        <ellipse cx="455" cy="646" rx="12" ry="8" fill="#f3dfb8" />

        <g class="cat-eyes" :class="{ 'eyes-closed': eyesClosed }">
          <g
            :style="{ transform: `translate(${gaze.x}px, ${gaze.y}px)` }"
            class="gaze"
          >
            <g class="blink cat-blink" fill="#3b2a1c">
              <ellipse cx="446" cy="634" rx="3.2" ry="3.8" />
              <ellipse cx="464" cy="634" rx="3.2" ry="3.8" />
              <circle cx="447.2" cy="632.6" r="1.1" fill="#f6efe0" />
              <circle cx="465.2" cy="632.6" r="1.1" fill="#f6efe0" />
            </g>
          </g>
        </g>

        <path d="M452 641 H458 L455 645 Z" fill="#e0788d" />
        <path
          d="M455 645 Q451 649 447 647 M455 645 Q459 649 463 647"
          fill="none"
          stroke="#5a3d2b"
          stroke-width="1.6"
          stroke-linecap="round"
        />
        <g
          stroke="#f6efe0"
          stroke-width="1.2"
          stroke-linecap="round"
          opacity="0.85"
        >
          <path d="M442 644 L428 641 M442 647 L428 650" />
          <path d="M468 644 L482 641 M468 647 L482 650" />
        </g>
      </g>
    </g>

    <g class="smoke-group" fill="#f7f2e6">
      <circle
        class="smoke"
        cx="571"
        cy="150"
        r="14"
        style="animation-delay: 0s"
      />
      <circle
        class="smoke"
        cx="571"
        cy="150"
        r="12"
        style="animation-delay: 2.3s"
      />
      <circle
        class="smoke"
        cx="571"
        cy="150"
        r="13"
        style="animation-delay: 4.6s"
      />
    </g>

    <g fill="#f8d98f">
      <circle
        v-for="(fly, i) in fireflies"
        :key="i"
        class="firefly"
        :cx="fly.x"
        :cy="fly.y"
        r="3.5"
        :style="{ animationDelay: fly.delay }"
      />
    </g>

    <path
      class="leaf leaf-a"
      d="M0 0 C6 -8 16 -8 22 0 C16 8 6 8 0 0 Z"
      fill="#dc8a3c"
    />
    <path
      class="leaf leaf-b"
      d="M0 0 C6 -8 16 -8 22 0 C16 8 6 8 0 0 Z"
      fill="#8fa889"
    />

    <rect
      width="800"
      height="900"
      filter="url(#grain)"
      opacity="0.18"
      style="mix-blend-mode: multiply"
    />
  </svg>
</template>

<style scoped>
.cloud {
  animation: drift 40s ease-in-out infinite alternate;
}
.cloud-b {
  animation-duration: 52s;
  animation-direction: alternate-reverse;
}
@keyframes drift {
  from {
    transform: translateX(-26px);
  }
  to {
    transform: translateX(34px);
  }
}

.smoke {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation: smoke 7s ease-out infinite;
}
@keyframes smoke {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0;
  }
  15% {
    opacity: 0.6;
  }
  100% {
    transform: translate(34px, -120px) scale(2.3);
    opacity: 0;
  }
}

.flicker {
  animation: flicker 4.6s ease-in-out infinite;
}
.lantern {
  animation-duration: 3.1s;
}
@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  40% {
    opacity: 0.8;
  }
  62% {
    opacity: 0.95;
  }
}

.bulb {
  animation: twinkle 2.8s ease-in-out infinite;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.55;
  }
}

.curtain {
  transform-box: fill-box;
  transform-origin: 50% 0;
  animation: curtain 7s ease-in-out infinite alternate;
}
.curtain-r {
  animation-delay: -2.5s;
}
@keyframes curtain {
  from {
    transform: skewX(-1.6deg);
  }
  to {
    transform: skewX(2deg);
  }
}

.plant-sill {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: sway 5s ease-in-out infinite alternate;
}
.hang-plant {
  transform-box: fill-box;
  transform-origin: 50% 0;
  animation: sway 6s ease-in-out infinite alternate;
}
@keyframes sway {
  from {
    transform: rotate(-3.5deg);
  }
  to {
    transform: rotate(3.5deg);
  }
}

.steam path {
  opacity: 0;
  animation: steam 3.4s ease-out infinite;
}
@keyframes steam {
  0% {
    transform: translateY(8px);
    opacity: 0;
  }
  30% {
    opacity: 0.75;
  }
  100% {
    transform: translateY(-14px);
    opacity: 0;
  }
}

.breathe-cat {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: breathe-cat 3.2s ease-in-out infinite alternate;
}
@keyframes breathe-cat {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(1.04);
  }
}

.tail {
  transform-origin: 370px 668px;
  animation: tail 3.6s ease-in-out infinite alternate;
}
@keyframes tail {
  from {
    transform: rotate(-7deg);
  }
  to {
    transform: rotate(9deg);
  }
}

.ear-twitch {
  transform-origin: 460px 620px;
  animation: twitch 7s ease-in-out infinite;
}
@keyframes twitch {
  0%,
  88%,
  100% {
    transform: rotate(0);
  }
  91% {
    transform: rotate(-13deg);
  }
  94% {
    transform: rotate(3deg);
  }
  97% {
    transform: rotate(-6deg);
  }
}

.blink {
  transform-box: fill-box;
  transform-origin: center;
  animation: blink 5.5s ease-in-out infinite;
}
.cat-blink {
  animation-duration: 7.2s;
}
@keyframes blink {
  0%,
  93%,
  100% {
    transform: scaleY(1);
  }
  96% {
    transform: scaleY(0.1);
  }
}

.cat-eyes {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.3s ease;
}
.cat-eyes.eyes-closed {
  transform: scaleY(0.12);
}
.gaze {
  transition: transform 0.12s ease-out;
}

.firefly {
  opacity: 0.2;
  animation:
    wander 9s ease-in-out infinite,
    glow 3.2s ease-in-out infinite;
}
@keyframes wander {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(16px, -12px);
  }
  66% {
    transform: translate(-10px, -22px);
  }
}
@keyframes glow {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.95;
  }
}

.leaf {
  opacity: 0;
  animation: leaf-fall 19s linear infinite;
}
.leaf-b {
  animation-delay: -9s;
  animation-duration: 24s;
}
@keyframes leaf-fall {
  0% {
    transform: translate(720px, -30px) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 0.9;
  }
  50% {
    transform: translate(520px, 460px) rotate(240deg);
  }
  92% {
    opacity: 0.9;
  }
  100% {
    transform: translate(380px, 900px) rotate(520deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
  .smoke,
  .leaf {
    display: none;
  }
}
</style>
