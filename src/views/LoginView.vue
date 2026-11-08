<script setup lang="ts">
import { login } from "@/api/auth";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isPasswordFocused = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const pupil = ref({ x: 0, y: 0 });
const tailAngle = ref(0);
const catRef = ref<SVGSVGElement | null>(null);

const MAX_PUPIL = 5;
const MAX_TAIL_ANGLE = 35;
const PUPIL_FULL_DISTANCE = 250;

const router = useRouter();

function onMouseMove(event: MouseEvent) {
  const cat = catRef.value;
  if (cat) {
    const rect = cat.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance > 0) {
      const strength = Math.min(distance / PUPIL_FULL_DISTANCE, 1);
      pupil.value = {
        x: (dx / distance) * strength * MAX_PUPIL,
        y: (dy / distance) * strength * MAX_PUPIL,
      };
    }
  }

  const halfWidth = window.innerWidth / 2;
  const side = (event.clientX - halfWidth) / halfWidth;
  tailAngle.value = side * MAX_TAIL_ANGLE;
}

onMounted(() => window.addEventListener("mousemove", onMouseMove));
onUnmounted(() => window.removeEventListener("mousemove", onMouseMove));

async function onSubmit() {
  errorMessage.value = "";
  isLoading.value = true;
  try {
    const { accessToken } = await login({
      email: email.value,
      password: password.value,
    });
    localStorage.setItem("token", accessToken);
    router.push("/");
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Something went wrong";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-sky-100 via-amber-50 to-white px-4 py-16"
  >
    <svg
      class="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="#c5e06a"
        d="M0 160 C240 80 480 100 720 150 C960 200 1200 120 1440 140 L1440 320 L0 320 Z"
      />
      <path
        fill="#7cbc3c"
        d="M0 230 C300 170 520 210 760 235 C1000 260 1200 190 1440 220 L1440 320 L0 320 Z"
      />
    </svg>

    <div class="relative w-full max-w-sm">
      <svg
        ref="catRef"
        class="relative z-0 mx-auto -mb-1 block w-48"
        viewBox="0 0 200 112"
        role="img"
        aria-label="A cute ginger cat peeking over the login card"
      >
        <polygon points="32,52 40,4 88,30" fill="#f2994a" />
        <polygon points="168,52 160,4 112,30" fill="#f2994a" />
        <polygon points="45,40 48,17 74,31" fill="#f6a6b2" />
        <polygon points="155,40 152,17 126,31" fill="#f6a6b2" />

        <ellipse cx="100" cy="68" rx="72" ry="50" fill="#f2994a" />

        <g stroke="#d9772b" stroke-width="5" stroke-linecap="round">
          <path d="M100 22 v14" />
          <path d="M85 25 l3 12" />
          <path d="M115 25 l-3 12" />
        </g>

        <ellipse cx="100" cy="88" rx="27" ry="18" fill="#fff1de" />
        <circle cx="52" cy="80" r="8" fill="#f6a6b2" opacity="0.55" />
        <circle cx="148" cy="80" r="8" fill="#f6a6b2" opacity="0.55" />

        <g v-for="cx in [70, 130]" :key="cx">
          <circle
            :cx="cx"
            cy="62"
            r="14"
            fill="#fff"
            stroke="#3b2a1a"
            stroke-width="2"
          />
          <g
            class="transition-transform duration-75 ease-out"
            :style="{
              transform: `translate(${pupil.x}px, ${pupil.y}px)`,
            }"
          >
            <circle :cx="cx" cy="62" r="7" fill="#2a1a0f" />
            <circle :cx="cx + 2.5" cy="59" r="2.2" fill="#fff" />
          </g>
        </g>

        <path d="M93 80 h14 l-7 8 z" fill="#f28ba5" />
        <path
          d="M100 88 q-6 8 -13 4 M100 88 q6 8 13 4"
          fill="none"
          stroke="#3b2a1a"
          stroke-width="2"
          stroke-linecap="round"
        />

        <g
          stroke="#3b2a1a"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.6"
        >
          <path d="M70 86 l-26 -4 M70 91 l-26 4" />
          <path d="M130 86 l26 -4 M130 91 l26 4" />
        </g>

        <g
          class="transition-transform duration-300 ease-out"
          :style="{
            transform:
              isPasswordFocused && !showPassword
                ? 'translate(10px, -44px)'
                : 'translate(0px, 0px)',
          }"
        >
          <ellipse cx="62" cy="106" rx="17" ry="12" fill="#f2994a" />
          <path
            d="M56 102 v6 M62 100 v8 M68 102 v6"
            stroke="#d9772b"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>
        <g
          class="transition-transform duration-300 ease-out"
          :style="{
            transform:
              isPasswordFocused && !showPassword
                ? 'translate(-10px, -44px)'
                : 'translate(0px, 0px)',
          }"
        >
          <ellipse cx="138" cy="106" rx="17" ry="12" fill="#f2994a" />
          <path
            d="M132 102 v6 M138 100 v8 M144 102 v6"
            stroke="#d9772b"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>
      </svg>

      <svg
        class="absolute -right-8 top-28 z-0 hidden w-16 overflow-visible sm:block"
        viewBox="0 0 60 120"
        aria-hidden="true"
      >
        <g
          class="transition-transform duration-200 ease-out"
          :style="{
            transform: `rotate(${tailAngle}deg)`,
            transformOrigin: '4px 115px',
          }"
        >
          <path
            d="M4 115 C 30 112, 58 80, 44 14"
            fill="none"
            stroke="#f2994a"
            stroke-width="14"
            stroke-linecap="round"
          />
          <path
            d="M4 115 C 30 112, 58 80, 44 14"
            fill="none"
            stroke="#d9772b"
            stroke-width="14"
            stroke-dasharray="5 21"
          />
        </g>
      </svg>

      <section
        class="relative z-10 rounded-3xl border border-amber-100 bg-white p-8 shadow-xl"
      >
        <h1 class="text-center text-2xl font-bold text-stone-900">
          Welcome back, friend.
        </h1>
        <p class="mt-1 text-center text-sm text-stone-500">
          Sign in to keep your cat in good paws.
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
          <div>
            <label
              for="email"
              class="mb-1 block text-sm font-medium text-stone-800"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
              class="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label
              for="password"
              class="mb-1 block text-sm font-medium text-stone-800"
            >
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                minlength="8"
                placeholder="At least 8 characters"
                class="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pr-16 pl-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                @focus="isPasswordFocused = true"
                @blur="isPasswordFocused = false"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 text-xs font-medium text-stone-500 hover:text-stone-800"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <p
            v-if="errorMessage"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-lg bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isLoading ? "Signing in..." : "Sign in" }}
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-stone-500">
          Don't have an account?
          <RouterLink to="/register" class="font-semibold text-stone-900">
            Create an account
          </RouterLink>
        </p>
      </section>
    </div>
  </main>
</template>
