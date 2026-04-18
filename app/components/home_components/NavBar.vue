<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import logoUrl from '~/assets/images/RestoQuick.png';

const colorMode = useColorMode();
const router = useRouter();
const { isLoaded, signIn, setActive } = useSignIn();
const scrolled = ref(false);
const isDemoSigningIn = ref(false);
const demoLoginError = ref<string | null>(null);

const DEMO_CREDENTIALS = {
  email: 'jhondoe@gmail.com',
  password: '1w18%%%AsBHtv788',
};

const links = [
  { label: 'Features', href: '#features' },
  { label: 'AI Assistant', href: '#maya' },
  { label: 'Pricing', href: '#pricing' },
];

const resolveClerkErrorMessage = (error: unknown) => {
  const clerkError = error as {
    errors?: Array<{ longMessage?: string; message?: string }>;
    message?: string;
  } | null;

  return clerkError?.errors?.[0]?.longMessage
    ?? clerkError?.errors?.[0]?.message
    ?? clerkError?.message
    ?? 'Unable to sign in to the demo account.';
};

const isDark = computed(() => colorMode.value === 'dark');
const logoClasses = computed(() =>
  isDark.value ? 'brightness-0 invert' : '',
);
const navClasses = computed(() =>
  'border-b border-border bg-background shadow-md',
);
const navItemClasses = computed(() =>
  'text-muted-foreground hover:text-primary',
);
const actionClasses = computed(() =>
  'text-muted-foreground hover:text-primary',
);
const ctaClasses = computed(() =>
  'bg-green-600 text-white hover:bg-green-700',
);
const demoButtonClasses = computed(() =>
  'inline-flex items-center rounded-2xl border border-border bg-card/80 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-60',
);

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark';
};

const signInToDemo = async () => {
  if (!isLoaded.value || !signIn.value || !setActive.value || isDemoSigningIn.value) {
    return;
  }

  if (!DEMO_CREDENTIALS.email || !DEMO_CREDENTIALS.password) {
    demoLoginError.value = 'Add the demo Clerk email and password in NavBar.vue first.';
    return;
  }

  demoLoginError.value = null;
  isDemoSigningIn.value = true;

  try {
    const signInAttempt = await signIn.value.create({
      strategy: 'password',
      identifier: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    });

    if (signInAttempt.status !== 'complete' || !signInAttempt.createdSessionId) {
      demoLoginError.value = 'The demo account needs an extra Clerk verification step before it can sign in.';
      return;
    }

    await setActive.value({
      session: signInAttempt.createdSessionId,
    });

    await router.push('/dashboard');
  } catch (error) {
    demoLoginError.value = resolveClerkErrorMessage(error);
  } finally {
    isDemoSigningIn.value = false;
  }
};

const updateScrollState = () => {
  scrolled.value = window.scrollY > 12;
};

onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState);
});
</script>

<template>
  <header class="sticky top-0 z-50">
    <nav class="flex w-full items-center justify-between px-4 py-3 transition duration-300 sm:px-6" :class="navClasses"
      aria-label="Primary">
      <NuxtLink to="/" class="flex items-center px-2 py-1.5">
        <img :src="logoUrl" alt="RestoQuick" class="h-10 w-auto transition sm:h-11 invert" :class="logoClasses">
      </NuxtLink>

      <div class="hidden items-center gap-2 lg:flex">
        <a v-for="link in links" :key="link.label" :href="link.href"
          class="px-4 py-2.5 text-sm font-medium transition duration-200" :class="navItemClasses">
          {{ link.label }}
        </a>
      </div>

      <div class="flex flex-col items-end gap-2">
        <div class="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <Show when="signed-out">
            <div class="flex flex-wrap items-center justify-end gap-3">

              <button type="button" :disabled="isDemoSigningIn || !isLoaded" :class="demoButtonClasses"
                @click="signInToDemo">
                {{ isDemoSigningIn ? 'Signing In…' : 'View Demo' }}
              </button>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          <NuxtLink to="/dashboard"
            class="inline-flex items-center rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-sm transition"
            :class="ctaClasses">
            <span class="hidden sm:inline">View Dashboard</span>
          </NuxtLink>
        </div>

        <p v-if="demoLoginError" class="max-w-xs text-right text-xs text-red-600 dark:text-red-400" aria-live="polite">
          {{ demoLoginError }}
        </p>
      </div>
    </nav>
  </header>
</template>