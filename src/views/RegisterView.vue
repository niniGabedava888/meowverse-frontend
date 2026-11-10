<script setup lang="ts">
import { register } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const name = ref("");
const surname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const isPasswordFocused = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const router = useRouter();

const passwordMismatch = computed(() => {
  return (
    confirmPassword.value.length > 0 && password.value !== confirmPassword.value
  );
});

async function onSubmit() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords don't match";
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { accessToken } = await register({
      email: email.value,
      name: name.value,
      surname: surname.value,
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

    <h1 class="text-4xl font-bold text-[#3d2b1f]">Join the neighbourhood.</h1>
    <p class="mt-2 text-base text-[#5b6b57]">
      Create an account to find a sitter for your cat, or to look after one.
    </p>

    <form class="mt-10 space-y-5" @submit.prevent="onSubmit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            for="name"
            class="mb-1.5 block text-sm font-semibold text-[#3d2b1f]"
          >
            First name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="given-name"
            required
            maxlength="32"
            placeholder="John"
            class="w-full rounded-xl border border-[#c3d1bc] bg-[#fffdf8] px-4 py-3 text-base text-[#3d2b1f] outline-none transition placeholder:text-[#8d9a88] focus:border-[#b8631d] focus:ring-2 focus:ring-[#dc8a3c]/30"
          />
        </div>
        <div>
          <label
            for="surname"
            class="mb-1.5 block text-sm font-semibold text-[#3d2b1f]"
          >
            Last name
          </label>
          <input
            id="surname"
            v-model="surname"
            type="text"
            autocomplete="family-name"
            required
            maxlength="32"
            placeholder="Doe"
            class="w-full rounded-xl border border-[#c3d1bc] bg-[#fffdf8] px-4 py-3 text-base text-[#3d2b1f] outline-none transition placeholder:text-[#8d9a88] focus:border-[#b8631d] focus:ring-2 focus:ring-[#dc8a3c]/30"
          />
        </div>
      </div>

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
            autocomplete="new-password"
            required
            minlength="8"
            maxlength="32"
            placeholder="8 to 32 characters"
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

      <div>
        <label
          for="confirm-password"
          class="mb-1.5 block text-sm font-semibold text-[#3d2b1f]"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          required
          placeholder="Type it once more"
          class="w-full rounded-xl border bg-[#fffdf8] px-4 py-3 text-base text-[#3d2b1f] outline-none transition placeholder:text-[#8d9a88] focus:ring-2"
          :class="
            passwordMismatch
              ? 'border-[#c4532a] focus:border-[#c4532a] focus:ring-[#c4532a]/25'
              : 'border-[#c3d1bc] focus:border-[#b8631d] focus:ring-[#dc8a3c]/30'
          "
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
        />
        <p v-if="passwordMismatch" class="mt-1.5 text-sm text-[#9a3b12]">
          The passwords don't match yet.
        </p>
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
        {{ isLoading ? "Creating account..." : "Create account" }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-[#5b6b57]">
      Already have an account?
      <RouterLink
        to="/login"
        class="font-semibold text-[#4f6b4e] underline hover:text-[#3d2b1f]"
      >
        Sign in
      </RouterLink>
    </p>
  </AuthLayout>
</template>
