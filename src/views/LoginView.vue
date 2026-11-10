<script setup lang="ts">
import { login } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isPasswordFocused = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const router = useRouter();

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
  <AuthLayout :cat-eyes-closed="isPasswordFocused && !showPassword">
    <p class="mb-10 text-lg font-bold tracking-wide text-[#b8631d]">
      MeowVerse
    </p>

    <h1 class="text-4xl font-bold text-[#3d2b1f]">Welcome back, friend.</h1>
    <p class="mt-2 text-base text-[#5b6b57]">
      Sign in to keep your cat in good paws.
    </p>

    <form class="mt-10 space-y-5" @submit.prevent="onSubmit">
      <div>
        <label
          for="email"
          class="mb-1.5 block text-sm font-semibold text-[#3d2b1f]"
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
          class="w-full rounded-xl border border-[#c3d1bc] bg-[#fffdf8] px-4 py-3 text-base text-[#3d2b1f] outline-none transition placeholder:text-[#8d9a88] focus:border-[#b8631d] focus:ring-2 focus:ring-[#dc8a3c]/30"
        />
      </div>

      <div>
        <label
          for="password"
          class="mb-1.5 block text-sm font-semibold text-[#3d2b1f]"
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
            class="w-full rounded-xl border border-[#c3d1bc] bg-[#fffdf8] py-3 pr-16 pl-4 text-base text-[#3d2b1f] outline-none transition placeholder:text-[#8d9a88] focus:border-[#b8631d] focus:ring-2 focus:ring-[#dc8a3c]/30"
            @focus="isPasswordFocused = true"
            @blur="isPasswordFocused = false"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-4 text-xs font-semibold text-[#5b6b57] hover:text-[#3d2b1f]"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "Hide" : "Show" }}
          </button>
        </div>
      </div>

      <p
        v-if="errorMessage"
        class="rounded-xl bg-[#fbe9dc] px-4 py-3 text-sm text-[#9a3b12]"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full rounded-xl bg-[#b8631d] py-3 text-base font-semibold text-white transition hover:bg-[#9f5217] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ isLoading ? "Signing in..." : "Sign in" }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-[#5b6b57]">
      Don't have an account?
      <RouterLink
        to="/register"
        class="font-semibold text-[#4f6b4e] underline hover:text-[#3d2b1f]"
      >
        Create an account
      </RouterLink>
    </p>
  </AuthLayout>
</template>
